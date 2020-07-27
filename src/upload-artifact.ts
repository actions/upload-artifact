import * as core from '@actions/core'
import {create, UploadOptions, ArtifactClient} from '@actions/artifact'
import {Inputs, getDefaultArtifactName} from './constants'
import {findFilesToUpload} from './search'
import { basename } from 'path';

async function run(): Promise<void> {
  try {
    const name = core.getInput(Inputs.Name, {required: false})
    const path = core.getInput(Inputs.Path, {required: true})
    const skipArchive = core.getInput(Inputs.SkipArchive, {required: false})

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

      const uploadedArtifacts: string[] = [];

      if (skipArchive) {
        for (const file of searchResult.filesToUpload) {
          const resultName = await uploadArtifacts(artifactClient, [file], searchResult.rootDirectory, options, basename(file));
          resultName && uploadedArtifacts.push(resultName);
        }
      } else {
        const resultName = await uploadArtifacts(artifactClient, searchResult.filesToUpload, searchResult.rootDirectory, options, name);
        resultName && uploadedArtifacts.push(resultName);
      }

      core.setOutput('uploaded_artifacts', uploadedArtifacts.join(','))
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

async function uploadArtifacts(artifactClient: ArtifactClient, files: string[], rootDirectory: string, options: UploadOptions, name = getDefaultArtifactName()): Promise<string | undefined> {
  const uploadResponse = await artifactClient.uploadArtifact(
    name,
    files,
    rootDirectory,
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

    return uploadResponse.artifactName;
  }
}

run()
