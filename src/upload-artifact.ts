import * as core from '@actions/core'
import {create, UploadOptions} from '@actions/artifact'
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
      core.info(
        `With the provided path, there will be ${searchResult.filesToUpload.length} file(s) uploaded`
      )
      core.debug(`Root artifact directory is ${searchResult.rootDirectory}`)

      const artifactClient = create()
      const options: UploadOptions = {
        continueOnError: false
      }
      if (inputs.retentionDays) {
        options.retentionDays = inputs.retentionDays
      }

      if (inputs.singleArchive === 'false') {
        core.info(`Uploading artifacts as individual archives`)

        for (const fileToUpload of searchResult.filesToUpload) {
          const uploadName = inputs.artifactName.concat(
            '_'.concat(
              fileToUpload.substring(fileToUpload.lastIndexOf('/') + 1)
            )
          )
          core.info(
            `Attempting to upload artifact with name: ${uploadName} at path ${fileToUpload}`
          )
          const uploadResponse = await artifactClient.uploadArtifact(
            uploadName,
            [fileToUpload],
            searchResult.rootDirectory,
            options
          )

          if (uploadResponse.failedItems.length > 0) {
            core.setFailed(
              `An error was encountered when uploading ${uploadName}. There were ${uploadResponse.failedItems.length} items that failed to upload.`
            )
          } else {
            core.info(`Artifact ${uploadName} has been successfully uploaded!`)
          }
        }
      } else {
        const uploadResponse = await artifactClient.uploadArtifact(
          inputs.artifactName,
          searchResult.filesToUpload,
          searchResult.rootDirectory,
          options
        )

        if (uploadResponse.failedItems.length > 0) {
          core.setFailed(
            `An error was encountered when uploading ${uploadResponse.artifactName}. There were ${uploadResponse.failedItems.length} items that failed to upload.`
          )
        } else {
          core.info(
            `Artifact ${uploadResponse.artifactName} has been successfully uploaded!`
          )
        }
      }
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
