import * as core from '@actions/core'
import * as artifact from '@actions/artifact'
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
      const artifactClient = artifact.create()
      const options = {
        continueOnError: true
      }
      await artifactClient.uploadArtifact(
        name || getDefaultArtifactName(),
        searchResult.filesToUpload,
        searchResult.rootDirectory,
        options
      )

      core.info('Artifact upload has finished successfully')
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
