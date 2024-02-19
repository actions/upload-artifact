import * as path from 'path'
import {mkdtemp, rm} from 'fs/promises'
import * as core from '@actions/core'
import {Minimatch} from 'minimatch'
import artifactClient, {UploadArtifactOptions} from '@actions/artifact'
import {getInputs} from './input-helper'
import {NoFileOptions} from '../shared/constants'
import {uploadArtifact} from '../shared/upload-artifact'
import {findFilesToUpload} from '../shared/search'

const PARALLEL_DOWNLOADS = 5

export const chunk = <T>(arr: T[], n: number): T[][] =>
  arr.reduce((acc, cur, i) => {
    const index = Math.floor(i / n)
    acc[index] = [...(acc[index] || []), cur]
    return acc
  }, [] as T[][])

export async function run(): Promise<void> {
  const inputs = getInputs()
  const tmpDir = await mkdtemp('merge-artifact')

  const listArtifactResponse = await artifactClient.listArtifacts({
    latest: true
  })
  const matcher = new Minimatch(inputs.pattern)
  const artifacts = listArtifactResponse.artifacts.filter(artifact =>
    matcher.match(artifact.name)
  )
  core.debug(
    `Filtered from ${listArtifactResponse.artifacts.length} to ${artifacts.length} artifacts`
  )

  if (artifacts.length === 0) {
    // No files were found, different use cases warrant different types of behavior if nothing is found
    switch (inputs.ifNoFilesFound) {
      case NoFileOptions.warn: {
        core.warning(
          `No artifacts were found with the provided pattern: ${inputs.pattern}.`
        )
        break
      }
      case NoFileOptions.error: {
        core.setFailed(
          `No artifacts were found with the provided pattern: ${inputs.pattern}.`
        )
        break
      }
      case NoFileOptions.ignore: {
        core.info(
          `No artifacts were found with the provided pattern: ${inputs.pattern}.`
        )
        break
      }
    }
    return;
  }

  core.info(`Preparing to download the following artifacts:`)
  artifacts.forEach(artifact => {
    core.info(`- ${artifact.name} (ID: ${artifact.id}, Size: ${artifact.size})`)
  })

  const downloadPromises = artifacts.map(artifact =>
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

  const searchResult = await findFilesToUpload(tmpDir)

  await uploadArtifact(
    inputs.name,
    searchResult.filesToUpload,
    searchResult.rootDirectory,
    options
  )

  core.info(
    `The ${artifacts.length} artifact(s) have been successfully merged!`
  )

  if (inputs.deleteMerged) {
    const deletePromises = artifacts.map(artifact =>
      artifactClient.deleteArtifact(artifact.name)
    )
    await Promise.all(deletePromises)
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
