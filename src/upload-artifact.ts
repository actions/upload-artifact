import * as core from '@actions/core'
import {create, UploadOptions} from '@actions/artifact'
import {Inputs, getDefaultArtifactName} from './constants'
import {findFilesToUpload} from './search'

async function run(): Promise<void> {
  try {
    const name = core.getInput(Inputs.Name, {required: false})
    const path = core.getInput(Inputs.Path, {required: true})

    const searchResult = await findFilesToUpload(path)
    if (searchResult.filesToUpload.length === 0) {
      core.warning(
        `No files were found for the provided path: ${path}. No artifacts will be uploaded.`
      )
    } else {
      core.info(
        `With the provided path, there will be ${searchResult.filesToUpload.length} files uploaded`
      )
      core.debug(`Root artifact directory is ${searchResult.rootDirectory}`)

      const artifactClient = create()
      const options: UploadOptions = {
        continueOnError: false
      }
      const uploadResponse = await artifactClient.uploadArtifact(
        name || getDefaultArtifactName(),
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
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
