import * as core from '@actions/core'
import * as github from '@actions/github'
import artifact, {ArtifactNotFoundError} from '@actions/artifact'
import {run} from '../src/upload/upload-artifact'
import {Inputs} from '../src/upload/constants'
import * as search from '../src/shared/search'

const fixtures = {
  artifactName: 'artifact-name',
  rootDirectory: '/some/artifact/path',
  filesToUpload: [
    '/some/artifact/path/file1.txt',
    '/some/artifact/path/file2.txt'
  ]
}

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'actions',
      repo: 'toolkit'
    },
    runId: 123,
    serverUrl: 'https://github.com'
  }
}))

jest.mock('@actions/core')

/* eslint-disable no-unused-vars */
const mockInputs = (overrides?: Partial<{[K in Inputs]?: any}>) => {
  const inputs = {
    [Inputs.Name]: 'artifact-name',
    [Inputs.Path]: '/some/artifact/path',
    [Inputs.IfNoFilesFound]: 'warn',
    [Inputs.RetentionDays]: 0,
    [Inputs.CompressionLevel]: 6,
    [Inputs.Overwrite]: false,
    ...overrides
  }

  ;(core.getInput as jest.Mock).mockImplementation((name: string) => {
    return inputs[name]
  })
  ;(core.getBooleanInput as jest.Mock).mockImplementation((name: string) => {
    return inputs[name]
  })

  return inputs
}

describe('upload', () => {
  beforeEach(async () => {
    mockInputs()

    jest.spyOn(search, 'findFilesToUpload').mockResolvedValue({
      filesToUpload: fixtures.filesToUpload,
      rootDirectory: fixtures.rootDirectory
    })

    jest.spyOn(artifact, 'uploadArtifact').mockResolvedValue({
      size: 123,
      id: 1337,
      digest: 'facefeed'
    })
  })

  it('uploads a single file', async () => {
    jest.spyOn(search, 'findFilesToUpload').mockResolvedValue({
      filesToUpload: [fixtures.filesToUpload[0]],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      [fixtures.filesToUpload[0]],
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )
  })

  it('uploads multiple files', async () => {
    await run()

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )
  })

  it('sets outputs', async () => {
    await run()

    expect(core.setOutput).toHaveBeenCalledWith('artifact-id', 1337)
    expect(core.setOutput).toHaveBeenCalledWith('artifact-digest', 'facefeed')
    expect(core.setOutput).toHaveBeenCalledWith(
      'artifact-url',
      `${github.context.serverUrl}/${github.context.repo.owner}/${
        github.context.repo.repo
      }/actions/runs/${github.context.runId}/artifacts/${1337}`
    )
  })

  it('supports custom compression level', async () => {
    mockInputs({
      [Inputs.CompressionLevel]: 2
    })

    await run()

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 2}
    )
  })

  it('supports custom retention days', async () => {
    mockInputs({
      [Inputs.RetentionDays]: 7
    })

    await run()

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {retentionDays: 7, compressionLevel: 6}
    )
  })

  it('supports warn if-no-files-found', async () => {
    mockInputs({
      [Inputs.IfNoFilesFound]: 'warn'
    })

    jest.spyOn(search, 'findFilesToUpload').mockResolvedValue({
      filesToUpload: [],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(core.warning).toHaveBeenCalledWith(
      `No files were found with the provided path: ${fixtures.rootDirectory}. No artifacts will be uploaded.`
    )
  })

  it('supports error if-no-files-found', async () => {
    mockInputs({
      [Inputs.IfNoFilesFound]: 'error'
    })

    jest.spyOn(search, 'findFilesToUpload').mockResolvedValue({
      filesToUpload: [],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      `No files were found with the provided path: ${fixtures.rootDirectory}. No artifacts will be uploaded.`
    )
  })

  it('supports ignore if-no-files-found', async () => {
    mockInputs({
      [Inputs.IfNoFilesFound]: 'ignore'
    })

    jest.spyOn(search, 'findFilesToUpload').mockResolvedValue({
      filesToUpload: [],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(core.info).toHaveBeenCalledWith(
      `No files were found with the provided path: ${fixtures.rootDirectory}. No artifacts will be uploaded.`
    )
  })

  it('supports overwrite', async () => {
    mockInputs({
      [Inputs.Overwrite]: true
    })

    jest.spyOn(artifact, 'deleteArtifact').mockResolvedValue({
      id: 1337
    })

    await run()

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )

    expect(artifact.deleteArtifact).toHaveBeenCalledWith(fixtures.artifactName)
  })

  it('supports overwrite and continues if not found', async () => {
    mockInputs({
      [Inputs.Overwrite]: true
    })

    jest
      .spyOn(artifact, 'deleteArtifact')
      .mockRejectedValue(new ArtifactNotFoundError('not found'))

    await run()

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )

    expect(artifact.deleteArtifact).toHaveBeenCalledWith(fixtures.artifactName)
    expect(core.debug).toHaveBeenCalledWith(
      `Skipping deletion of '${fixtures.artifactName}', it does not exist`
    )
  })
})
