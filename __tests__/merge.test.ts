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

// Mock fs/promises
const actualFsPromises = await import('fs/promises')
jest.unstable_mockModule('fs/promises', () => ({
  ...actualFsPromises,
  mkdtemp: jest
    .fn<() => Promise<string>>()
    .mockResolvedValue('/tmp/merge-artifact'),
  rm: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
}))

// Mock shared search module
const mockFindFilesToUpload =
  jest.fn<() => Promise<{filesToUpload: string[]; rootDirectory: string}>>()
jest.unstable_mockModule('../src/shared/search.js', () => ({
  findFilesToUpload: mockFindFilesToUpload
}))

// Dynamic imports after mocking
const core = await import('@actions/core')
const artifact = await import('@actions/artifact')
const {run} = await import('../src/merge/merge-artifacts.js')
const {Inputs} = await import('../src/merge/constants.js')

const fixtures = {
  artifactName: 'my-merged-artifact',
  tmpDirectory: '/tmp/merge-artifact',
  filesToUpload: [
    '/some/artifact/path/file-a.txt',
    '/some/artifact/path/file-b.txt',
    '/some/artifact/path/file-c.txt'
  ],
  artifacts: [
    {
      name: 'my-artifact-a',
      id: 1,
      size: 100,
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      name: 'my-artifact-b',
      id: 2,
      size: 100,
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      name: 'my-artifact-c',
      id: 3,
      size: 100,
      createdAt: new Date('2024-01-01T00:00:00Z')
    }
  ]
}

const mockInputs = (
  overrides?: Partial<{[K in (typeof Inputs)[keyof typeof Inputs]]?: any}>
) => {
  const inputs: Record<string, any> = {
    [Inputs.Name]: 'my-merged-artifact',
    [Inputs.Pattern]: '*',
    [Inputs.SeparateDirectories]: false,
    [Inputs.RetentionDays]: 0,
    [Inputs.CompressionLevel]: 6,
    [Inputs.DeleteMerged]: false,
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

describe('merge', () => {
  beforeEach(async () => {
    mockInputs()
    jest.clearAllMocks()

    jest
      .spyOn(artifact.default, 'listArtifacts')
      .mockResolvedValue({artifacts: fixtures.artifacts})

    jest.spyOn(artifact.default, 'downloadArtifact').mockResolvedValue({
      downloadPath: fixtures.tmpDirectory
    })

    mockFindFilesToUpload.mockResolvedValue({
      filesToUpload: fixtures.filesToUpload,
      rootDirectory: fixtures.tmpDirectory
    })

    jest.spyOn(artifact.default, 'uploadArtifact').mockResolvedValue({
      size: 123,
      id: 1337
    })

    jest
      .spyOn(artifact.default, 'deleteArtifact')
      .mockImplementation(async (artifactName: string) => {
        const found = fixtures.artifacts.find(a => a.name === artifactName)
        if (!found) throw new Error(`Artifact ${artifactName} not found`)
        return {id: found.id}
      })
  })

  test('merges artifacts', async () => {
    await run()

    for (const a of fixtures.artifacts) {
      expect(artifact.default.downloadArtifact).toHaveBeenCalledWith(a.id, {
        path: fixtures.tmpDirectory
      })
    }

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.tmpDirectory,
      {compressionLevel: 6}
    )
  })

  test('fails if no artifacts found', async () => {
    mockInputs({[Inputs.Pattern]: 'this-does-not-match'})

    await expect(run()).rejects.toThrow()

    expect(artifact.default.uploadArtifact).not.toHaveBeenCalled()
    expect(artifact.default.downloadArtifact).not.toHaveBeenCalled()
  })

  test('supports custom compression level', async () => {
    mockInputs({
      [Inputs.CompressionLevel]: 2
    })

    await run()

    expect(artifact.default.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.tmpDirectory,
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
      fixtures.tmpDirectory,
      {retentionDays: 7, compressionLevel: 6}
    )
  })

  test('supports deleting artifacts after merge', async () => {
    mockInputs({
      [Inputs.DeleteMerged]: true
    })

    await run()

    for (const a of fixtures.artifacts) {
      expect(artifact.default.deleteArtifact).toHaveBeenCalledWith(a.name)
    }
  })
})
