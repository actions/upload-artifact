import * as core from '../node_modules/@actions/core/'
import {
  UploadOptions,
  create
} from '../node_modules/@actions/artifact/lib/artifact'
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

      const artifactClient = create()
      const options: UploadOptions = {}
      if (inputs.retentionDays) {
        options.retentionDays = inputs.retentionDays
      }

      if (typeof inputs.compressionLevel !== 'undefined') {
        options.compressionLevel = inputs.compressionLevel
      }

      const uploadResponse = await artifactClient.uploadArtifact(
        inputs.artifactName,
        searchResult.filesToUpload,
        searchResult.rootDirectory,
        options
      )

      if (uploadResponse.success === false) {
        core.setFailed(
          `An error was encountered when uploading ${inputs.artifactName}.`
        )
      } else {
        core.info(
          `Artifact ${inputs.artifactName} has been successfully uploaded! Final size is ${uploadResponse.size} bytes. Artifact ID is ${uploadResponse.id}`
        )
        core.setOutput('artifact-id', uploadResponse.id)
      }
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
