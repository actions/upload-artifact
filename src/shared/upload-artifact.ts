import * as core from '@actions/core'
import * as github from '@actions/github'
import artifact, {
  UploadArtifactOptions,
  ArtifactNotFoundError,
  InvalidResponseError
} from '@actions/artifact'
import {UploadInputs} from '../upload/upload-inputs'
import {MergeInputs} from '../merge/merge-inputs'

async function deleteArtifactIfExists(artifactName: string): Promise<void> {
  try {
    await artifact.deleteArtifact(artifactName)
  } catch (error) {
    if (error instanceof ArtifactNotFoundError) {
      core.debug(`Skipping deletion of '${artifactName}', it does not exist`)
      return
    }

    // Best effort, we don't want to fail the action if this fails
    core.debug(`Unable to delete artifact: ${(error as Error).message}`)
  }
}

export async function uploadArtifact(
  artifactName: string,
  filesToUpload: string[],
  rootDirectory: string,
  options: UploadArtifactOptions,
  overwrite: boolean = false,
  retryAttempts: number = 3
) {
  try {
    if (overwrite) {
      await deleteArtifactIfExists(artifactName)
    }
    const uploadResponse = await artifact.uploadArtifact(
      artifactName,
      filesToUpload,
      rootDirectory,
      options
    )

    core.info(
      `Artifact ${artifactName} has been successfully uploaded! Final size is ${uploadResponse.size} bytes. Artifact ID is ${uploadResponse.id}`
    )
    core.setOutput('artifact-id', uploadResponse.id)

    const repository = github.context.repo
    const artifactURL = `${github.context.serverUrl}/${repository.owner}/${repository.repo}/actions/runs/${github.context.runId}/artifacts/${uploadResponse.id}`

    core.info(`Artifact download URL: ${artifactURL}`)
    core.setOutput('artifact-url', artifactURL)
  } catch (error) {
    if (
      error instanceof InvalidResponseError &&
      error.message.includes(
        'Conflict: an artifact with this name already exists on the workflow run'
      ) &&
      overwrite &&
      retryAttempts
    ) {
      uploadArtifact(
        artifactName,
        filesToUpload,
        rootDirectory,
        options,
        overwrite,
        retryAttempts - 1
      )
    }
  }
}
