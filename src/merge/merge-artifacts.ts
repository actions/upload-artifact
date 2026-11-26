import * as path from 'path'
import {mkdtemp, rm} from 'fs/promises'
import * as core from '@actions/core'
import {Minimatch} from 'minimatch'
import artifactClient, {
  ArtifactNotFoundError,
  UploadArtifactOptions
} from '@actions/artifact'
import {getInputs} from './input-helper.js'
import {uploadArtifact} from '../shared/upload-artifact.js'
import {findFilesToUpload} from '../shared/search.js'

const PARALLEL_DOWNLOADS = 5

export const chunk = <T>(arr: T[], n: number): T[][] =>
  arr.reduce((acc, cur, i) => {
    const index = Math.floor(i / n)
    acc[index] = [...(acc[index] || []), cur]
    return acc
  }, [] as T[][])

function isArtifactNotFoundError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    error instanceof ArtifactNotFoundError ||
    message.includes('(404)') ||
    message.includes('artifact does not exist') ||
    message.includes('artifact not found')
  )
}

async function deleteArtifact(artifactName: string): Promise<void> {
  try {
    await artifactClient.deleteArtifact(artifactName)
  } catch (error) {
    if (!isArtifactNotFoundError(error)) {
      throw error
    }
    core.info(`Artifact '${artifactName}' has already been deleted`)
  }
}

export async function run(): Promise<void> {
  const inputs = getInputs()

  const listArtifactResponse = await artifactClient.listArtifacts({
    latest: true
  })
  const matcher = new Minimatch(inputs.pattern)
  const artifacts = listArtifactResponse.artifacts.filter(
    artifact => artifact.name !== inputs.name && matcher.match(artifact.name)
  )
  const mergedArtifact = listArtifactResponse.artifacts.find(
    artifact => artifact.name === inputs.name
  )
  core.debug(
    `Filtered from ${listArtifactResponse.artifacts.length} to ${artifacts.length} artifacts`
  )

  if (!mergedArtifact && artifacts.length === 0) {
    throw new Error(`No artifacts found matching pattern '${inputs.pattern}'`)
  }

  const artifactsToMerge = mergedArtifact
    ? artifacts.filter(artifact => artifact.id > mergedArtifact.id)
    : artifacts

  if (artifactsToMerge.length === 0) {
    if (inputs.deleteMerged && artifacts.length > 0) {
      await Promise.all(
        artifacts.map(artifact => deleteArtifact(artifact.name))
      )
    }
    core.info(`Artifact '${inputs.name}' has already been merged`)
    return
  }

  const tmpDir = await mkdtemp('merge-artifact')

  core.info(`Preparing to download the following artifacts:`)
  if (mergedArtifact) {
    core.info(
      `- ${mergedArtifact.name} (ID: ${mergedArtifact.id}, Size: ${mergedArtifact.size})`
    )
  }
  artifactsToMerge.forEach(artifact => {
    core.info(`- ${artifact.name} (ID: ${artifact.id}, Size: ${artifact.size})`)
  })

  if (mergedArtifact) {
    await artifactClient.downloadArtifact(mergedArtifact.id, {path: tmpDir})
  }

  const downloadPromises = artifactsToMerge.map(artifact =>
    artifactClient.downloadArtifact(artifact.id, {
      path: inputs.separateDirectories
        ? path.join(tmpDir, artifact.name)
        : tmpDir
    })
  )

  const chunkedPromises = chunk(downloadPromises, PARALLEL_DOWNLOADS)
  for (const chunk of chunkedPromises) {
    await Promise.all(chunk)
  }

  const options: UploadArtifactOptions = {}
  if (inputs.retentionDays) {
    options.retentionDays = inputs.retentionDays
  }

  if (typeof inputs.compressionLevel !== 'undefined') {
    options.compressionLevel = inputs.compressionLevel
  }

  const searchResult = await findFilesToUpload(
    tmpDir,
    inputs.includeHiddenFiles
  )

  if (mergedArtifact) {
    await deleteArtifact(mergedArtifact.name)
  }

  await uploadArtifact(
    inputs.name,
    searchResult.filesToUpload,
    searchResult.rootDirectory,
    options
  )

  core.info(
    `The ${artifactsToMerge.length + (mergedArtifact ? 1 : 0)} artifact(s) have been successfully merged!`
  )

  if (inputs.deleteMerged) {
    await Promise.all(artifacts.map(artifact => deleteArtifact(artifact.name)))
    core.info(`The ${artifacts.length} artifact(s) have been deleted`)
  }

  try {
    await rm(tmpDir, {recursive: true})
  } catch (error) {
    core.warning(
      `Unable to remove temporary directory: ${(error as Error).message}`
    )
  }
}
