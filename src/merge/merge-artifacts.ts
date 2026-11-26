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

function latestByName<T extends {name: string; id: number}>(
  artifacts: T[]
): T[] {
  const latest = new Map<string, T>()
  for (const artifact of artifacts) {
    const previous = latest.get(artifact.name)
    if (!previous || artifact.id > previous.id) {
      latest.set(artifact.name, artifact)
    }
  }
  return [...latest.values()]
}

async function deleteArtifacts(
  artifacts: Array<{name: string}>
): Promise<void> {
  for (const artifact of artifacts) {
    await deleteArtifact(artifact.name)
  }
}

export async function run(): Promise<void> {
  const inputs = getInputs()

  const listArtifactResponse = await artifactClient.listArtifacts({
    latest: false
  })
  const matcher = new Minimatch(inputs.pattern)
  const recoveryArtifactName = `${inputs.name}-merge-recovery`
  const sourceArtifacts = listArtifactResponse.artifacts.filter(
    artifact =>
      artifact.name !== inputs.name &&
      artifact.name !== recoveryArtifactName &&
      matcher.match(artifact.name)
  )
  const artifacts = latestByName(sourceArtifacts)
  const mergedArtifacts = listArtifactResponse.artifacts
    .filter(artifact => artifact.name === inputs.name)
    .sort((a, b) => b.id - a.id)
  const recoveryArtifacts = listArtifactResponse.artifacts
    .filter(artifact => artifact.name === recoveryArtifactName)
    .sort((a, b) => b.id - a.id)
  const mergedArtifact = mergedArtifacts[0]
  const recoveryArtifact = recoveryArtifacts[0]
  const previousArtifact = mergedArtifact ?? recoveryArtifact
  let recoveryUploaded = false
  const options: UploadArtifactOptions = {}
  if (inputs.retentionDays) {
    options.retentionDays = inputs.retentionDays
  }
  if (typeof inputs.compressionLevel !== 'undefined') {
    options.compressionLevel = inputs.compressionLevel
  }
  core.debug(
    `Filtered from ${listArtifactResponse.artifacts.length} to ${sourceArtifacts.length} source artifacts`
  )

  if (!previousArtifact && artifacts.length === 0) {
    throw new Error(`No artifacts found matching pattern '${inputs.pattern}'`)
  }

  const artifactsToMerge = previousArtifact
    ? artifacts.filter(artifact => artifact.id > previousArtifact.id)
    : artifacts

  if (mergedArtifact && artifactsToMerge.length === 0) {
    if (inputs.deleteMerged && artifacts.length > 0) {
      await deleteArtifacts(sourceArtifacts)
    }
    if (recoveryArtifacts.length > 0) {
      await deleteArtifacts(recoveryArtifacts)
    }
    core.info(`Artifact '${inputs.name}' has already been merged`)
    return
  }

  const tmpDir = await mkdtemp('merge-artifact')

  core.info(`Preparing to download the following artifacts:`)
  if (previousArtifact) {
    core.info(
      `- ${previousArtifact.name} (ID: ${previousArtifact.id}, Size: ${previousArtifact.size})`
    )
  }
  artifactsToMerge.forEach(artifact => {
    core.info(`- ${artifact.name} (ID: ${artifact.id}, Size: ${artifact.size})`)
  })

  if (previousArtifact) {
    await artifactClient.downloadArtifact(previousArtifact.id, {path: tmpDir})
  }

  if (mergedArtifact && artifactsToMerge.length > 0) {
    const previousSearchResult = await findFilesToUpload(
      tmpDir,
      inputs.includeHiddenFiles
    )
    await deleteArtifacts(recoveryArtifacts)
    await uploadArtifact(
      recoveryArtifactName,
      previousSearchResult.filesToUpload,
      previousSearchResult.rootDirectory,
      options
    )
    recoveryUploaded = true
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

  const searchResult = await findFilesToUpload(
    tmpDir,
    inputs.includeHiddenFiles
  )

  if (mergedArtifacts.length > 0) {
    await deleteArtifacts(mergedArtifacts)
  }

  await uploadArtifact(
    inputs.name,
    searchResult.filesToUpload,
    searchResult.rootDirectory,
    options
  )

  core.info(
    `The ${artifactsToMerge.length + (previousArtifact ? 1 : 0)} artifact(s) have been successfully merged!`
  )

  if (inputs.deleteMerged) {
    await deleteArtifacts(sourceArtifacts)
    core.info(`The ${sourceArtifacts.length} artifact(s) have been deleted`)
  }
  if (recoveryUploaded) {
    await deleteArtifact(recoveryArtifactName)
  } else if (recoveryArtifacts.length > 0) {
    await deleteArtifacts(recoveryArtifacts)
  }

  try {
    await rm(tmpDir, {recursive: true})
  } catch (error) {
    core.warning(
      `Unable to remove temporary directory: ${(error as Error).message}`
    )
  }
}
