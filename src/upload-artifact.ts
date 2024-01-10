import * as core from '@actions/core'
import * as github from '@actions/github'
import artifact, {UploadArtifactOptions} from '@actions/artifact'
import {findFilesToUpload} from './search'
import {getInputs} from './input-helper'
import {NoFileOptions} from './constants'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    const searchResult = await findFilesToUpload(inputs.searchPath)
    if (searchResult.filesToUpload.length === 0) {
      // No files were found, different use cases warrant different types of behavior if nothing is found
      switch (inputs.ifNoFilesFound) {
        case NoFileOptions.warn: {
          core.warning(
            `No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`
          )
          break
        }
        case NoFileOptions.error: {
          core.setFailed(
            `No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`
          )
          break
        }
        case NoFileOptions.ignore: {
          core.info(
            `No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`
          )
          break
        }
      }
    } else {
      const s = searchResult.filesToUpload.length === 1 ? '' : 's'
      core.info(
        `With the provided path, there will be ${searchResult.filesToUpload.length} file${s} uploaded`
      )
      core.debug(`Root artifact directory is ${searchResult.rootDirectory}`)

      const options: UploadArtifactOptions = {}
      if (inputs.retentionDays) {
        options.retentionDays = inputs.retentionDays
      }

      if (typeof inputs.compressionLevel !== 'undefined') {
        options.compressionLevel = inputs.compressionLevel
      }

      const uploadResponse = await artifact.uploadArtifact(
        inputs.artifactName,
        searchResult.filesToUpload,
        searchResult.rootDirectory,
        options
      )

      core.info(
        `Artifact ${inputs.artifactName} has been successfully uploaded! Final size is ${uploadResponse.size} bytes. Artifact ID is ${uploadResponse.id}`
      )
      core.setOutput('artifact-id', uploadResponse.id)

      const repository = github.context.repo
      const artifactURL = `${github.context.serverUrl}/${repository.owner}/${repository.repo}/actions/runs/${github.context.runId}/artifacts/${uploadResponse.id}`

      core.info(`Artifact web download URL: ${artifactURL}`)
      core.setOutput('artifact-url', artifactURL)
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
