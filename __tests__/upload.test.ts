import {jest, describe, test, expect, beforeEach} from '@jest/globals'

// Mock @actions/github before importing modules that use it
jest.unstable_mockModule('@actions/github', () => ({
  context: {
    repo: {
      owner: 'actions',
      repo: 'toolkit'
    },
    runId: 123,
    serverUrl: 'https://github.com'
  },
  getOctokit: jest.fn()
}))

// Mock @actions/core
jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn(),
  getBooleanInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  setSecret: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  notice: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  isDebug: jest.fn(() => false),
  getState: jest.fn(),
  saveState: jest.fn(),
  exportVariable: jest.fn(),
  addPath: jest.fn(),
  group: jest.fn((name: string, fn: () => Promise<unknown>) => fn()),
  toPlatformPath: jest.fn((p: string) => p),
  toWin32Path: jest.fn((p: string) => p),
  toPosixPath: jest.fn((p: string) => p)
}))

// Mock shared search module
const mockFindFilesToUpload = jest.fn<
  () => Promise<{filesToUpload: string[]; rootDirectory: string}>
>()
jest.unstable_mockModule('../src/shared/search.js', () => ({
  findFilesToUpload: mockFindFilesToUpload
}))

// Dynamic imports after mocking
const core = await import('@actions/core')
const github = await import('@actions/github')
const artifact = await import('@actions/artifact')
const {run} = await import('../src/upload/upload-artifact.js')
const {Inputs} = await import('../src/upload/constants.js')
const {ArtifactNotFoundError} = artifact

const fixtures = {
  artifactName: 'artifact-name',
  rootDirectory: '/some/artifact/path',
  filesToUpload: [
    '/some/artifact/path/file1.txt',
    '/some/artifact/path/file2.txt'
  ]
}

const mockInputs = (
  overrides?: Partial<{[K in (typeof Inputs)[keyof typeof Inputs]]?: any}>
) => {
  const inputs: Record<string, any> = {
    [Inputs.Name]: 'artifact-name',
    [Inputs.Path]: '/some/artifact/path',
    [Inputs.IfNoFilesFound]: 'warn',
    [Inputs.RetentionDays]: 0,
    [Inputs.CompressionLevel]: 6,
    [Inputs.Overwrite]: false,
    ...overrides
  }

  ;(core.getInput as jest.Mock<typeof core.getInput>).mockImplementation(
    (name: string) => {
      return inputs[name]
    }
  )
  ;(
    core.getBooleanInput as jest.Mock<typeof core.getBooleanInput>
  ).mockImplementation((name: string) => {
    return inputs[name]
  })

  return inputs
}

describe('upload', () => {
  beforeEach(async () => {
    mockInputs()
    jest.clearAllMocks()

    mockFindFilesToUpload.mockResolvedValue({
      filesToUpload: fixtures.filesToUpload,
      rootDirectory: fixtures.rootDirectory
    })

    jest.spyOn(artifact.default, 'uploadArtifact').mockResolvedValue({
      size: 123,
      id: 1337,
      digest: 'facefeed'
    })
  })

  test('uploads a single file', async () => {
    mockFindFilesToUpload.mockResolvedValue({
      filesToUpload: [fixtures.filesToUpload[0]],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      [fixtures.filesToUpload[0]],
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )
  })

  test('uploads multiple files', async () => {
    await run()

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )
  })

  test('sets outputs', async () => {
    await run()

    expect(core.setOutput).toHaveBeenCalledWith('artifact-id', 1337)
    expect(core.setOutput).toHaveBeenCalledWith('artifact-digest', 'facefeed')
    expect(core.setOutput).toHaveBeenCalledWith(
      'artifact-url',
      `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}/artifacts/${1337}`
    )
  })

  test('supports custom compression level', async () => {
    mockInputs({
      [Inputs.CompressionLevel]: 2
    })

    await run()

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 2}
    )
  })

  test('supports custom retention days', async () => {
    mockInputs({
      [Inputs.RetentionDays]: 7
    })

    await run()

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {retentionDays: 7, compressionLevel: 6}
    )
  })

  test('supports warn if-no-files-found', async () => {
    mockInputs({
      [Inputs.IfNoFilesFound]: 'warn'
    })

    mockFindFilesToUpload.mockResolvedValue({
      filesToUpload: [],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(core.warning).toHaveBeenCalledWith(
      `No files were found with the provided path: ${fixtures.rootDirectory}. No artifacts will be uploaded.`
    )
  })

  test('supports error if-no-files-found', async () => {
    mockInputs({
      [Inputs.IfNoFilesFound]: 'error'
    })

    mockFindFilesToUpload.mockResolvedValue({
      filesToUpload: [],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      `No files were found with the provided path: ${fixtures.rootDirectory}. No artifacts will be uploaded.`
    )
  })

  test('supports ignore if-no-files-found', async () => {
    mockInputs({
      [Inputs.IfNoFilesFound]: 'ignore'
    })

    mockFindFilesToUpload.mockResolvedValue({
      filesToUpload: [],
      rootDirectory: fixtures.rootDirectory
    })

    await run()

    expect(core.info).toHaveBeenCalledWith(
      `No files were found with the provided path: ${fixtures.rootDirectory}. No artifacts will be uploaded.`
    )
  })

  test('supports overwrite', async () => {
    mockInputs({
      [Inputs.Overwrite]: true
    })

    jest.spyOn(artifact.default, 'deleteArtifact').mockResolvedValue({
      id: 1337
    })

    await run()

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )

    expect(artifact.default.deleteArtifact).toHaveBeenCalledWith(
      fixtures.artifactName
    )
  })

  test('supports overwrite and continues if not found', async () => {
    mockInputs({
      [Inputs.Overwrite]: true
    })

    jest
      .spyOn(artifact.default, 'deleteArtifact')
      .mockRejectedValue(new ArtifactNotFoundError('not found'))

    await run()

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.rootDirectory,
      {compressionLevel: 6}
    )

    expect(artifact.default.deleteArtifact).toHaveBeenCalledWith(
      fixtures.artifactName
    )
    expect(core.debug).toHaveBeenCalledWith(
      `Skipping deletion of '${fixtures.artifactName}', it does not exist`
    )
  })
})
