import * as core from '@actions/core'
import * as github from '@actions/github'
import artifact, {UploadArtifactOptions} from '@actions/artifact'

export async function uploadArtifact(
  artifactName: string,
  filesToUpload: string[],
  rootDirectory: string,
  options: UploadArtifactOptions
) {
  const uploadResponse = await artifact.uploadArtifact(
    artifactName,
    filesToUpload,
    rootDirectory,
    options
  )

  const size = uploadResponse.size
  const displaySize =
    size === undefined
      ? 'unknown'
      : size >= 1024 * 1024
        ? `${(size / (1024 * 1024)).toFixed(2)} MB`
        : size >= 1024
          ? `${(size / 1024).toFixed(2)} KB`
          : `${size} bytes`
  core.info(
    `Artifact ${artifactName} has been successfully uploaded! Final size is ${displaySize}. Artifact ID is ${uploadResponse.id}`
  )
  core.setOutput('artifact-id', uploadResponse.id)
  core.setOutput('artifact-digest', uploadResponse.digest)

  const repository = github.context.repo
  const artifactURL = `${github.context.serverUrl}/${repository.owner}/${repository.repo}/actions/runs/${github.context.runId}/artifacts/${uploadResponse.id}`

  core.info(`Artifact download URL: ${artifactURL}`)
  core.setOutput('artifact-url', artifactURL)
}
