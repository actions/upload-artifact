import * as core from '@actions/core'
import artifact from '@actions/artifact'
import {run} from '../src/merge/merge-artifacts'
import {Inputs} from '../src/merge/constants'
import * as search from '../src/shared/search'

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

jest.mock('fs/promises', () => ({
  mkdtemp: jest.fn().mockResolvedValue('/tmp/merge-artifact'),
  rm: jest.fn().mockResolvedValue(undefined)
}))

/* eslint-disable no-unused-vars */
const mockInputs = (overrides?: Partial<{[K in Inputs]?: any}>) => {
  const inputs = {
    [Inputs.Name]: 'my-merged-artifact',
    [Inputs.Pattern]: '*',
    [Inputs.SeparateDirectories]: false,
    [Inputs.RetentionDays]: 0,
    [Inputs.CompressionLevel]: 6,
    [Inputs.DeleteMerged]: false,
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

describe('merge', () => {
  beforeEach(async () => {
    mockInputs()

    jest
      .spyOn(artifact, 'listArtifacts')
      .mockResolvedValue({artifacts: fixtures.artifacts})

    jest.spyOn(artifact, 'downloadArtifact').mockResolvedValue({
      downloadPath: fixtures.tmpDirectory
    })

    jest.spyOn(search, 'findFilesToUpload').mockResolvedValue({
      filesToUpload: fixtures.filesToUpload,
      rootDirectory: fixtures.tmpDirectory
    })

    jest.spyOn(artifact, 'uploadArtifact').mockResolvedValue({
      size: 123,
      id: 1337
    })

    jest
      .spyOn(artifact, 'deleteArtifact')
      .mockImplementation(async artifactName => {
        const artifact = fixtures.artifacts.find(a => a.name === artifactName)
        if (!artifact) throw new Error(`Artifact ${artifactName} not found`)
        return {id: artifact.id}
      })
  })

  it('merges artifacts', async () => {
    await run()

    for (const a of fixtures.artifacts) {
      expect(artifact.downloadArtifact).toHaveBeenCalledWith(a.id, {
        path: fixtures.tmpDirectory
      })
    }

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.tmpDirectory,
      {compressionLevel: 6}
    )
  })

  it('fails if no artifacts found', async () => {
    mockInputs({[Inputs.Pattern]: 'this-does-not-match'})

    expect(run()).rejects.toThrow()

    expect(artifact.uploadArtifact).not.toBeCalled()
    expect(artifact.downloadArtifact).not.toBeCalled()
  })

  it('supports custom compression level', async () => {
    mockInputs({
      [Inputs.CompressionLevel]: 2
    })

    await run()

    expect(artifact.uploadArtifact).toHaveBeenCalledWith(
      fixtures.artifactName,
      fixtures.filesToUpload,
      fixtures.tmpDirectory,
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
      fixtures.tmpDirectory,
      {retentionDays: 7, compressionLevel: 6}
    )
  })

  it('supports deleting artifacts after merge', async () => {
    mockInputs({
      [Inputs.DeleteMerged]: true
    })

    await run()

    for (const a of fixtures.artifacts) {
      expect(artifact.deleteArtifact).toHaveBeenCalledWith(a.name)
    }
  })
})
