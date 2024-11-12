import * as core from '@actions/core'
import * as path from 'path'
import * as io from '@actions/io'
import {promises as fs} from 'fs'
import {findFilesToUpload} from '../src/shared/search'

const root = path.join(__dirname, '_temp', 'search')
const searchItem1Path = path.join(
  root,
  'folder-a',
  'folder-b',
  'folder-c',
  'search-item1.txt'
)
const searchItem2Path = path.join(root, 'folder-d', 'search-item2.txt')
const searchItem3Path = path.join(root, 'folder-d', 'search-item3.txt')
const searchItem4Path = path.join(root, 'folder-d', 'search-item4.txt')
const searchItem5Path = path.join(root, 'search-item5.txt')
const extraSearchItem1Path = path.join(
  root,
  'folder-a',
  'folder-b',
  'folder-c',
  'extraSearch-item1.txt'
)
const extraSearchItem2Path = path.join(
  root,
  'folder-d',
  'extraSearch-item2.txt'
)
const extraSearchItem3Path = path.join(
  root,
  'folder-f',
  'extraSearch-item3.txt'
)
const extraSearchItem4Path = path.join(
  root,
  'folder-h',
  'folder-i',
  'extraSearch-item4.txt'
)
const extraSearchItem5Path = path.join(
  root,
  'folder-h',
  'folder-i',
  'extraSearch-item5.txt'
)
const extraFileInFolderCPath = path.join(
  root,
  'folder-a',
  'folder-b',
  'folder-c',
  'extra-file-in-folder-c.txt'
)
const amazingFileInFolderHPath = path.join(root, 'folder-h', 'amazing-item.txt')
const lonelyFilePath = path.join(
  root,
  'folder-h',
  'folder-j',
  'folder-k',
  'lonely-file.txt'
)

const hiddenFile = path.join(root, '.hidden-file.txt')
const fileInHiddenFolderPath = path.join(
  root,
  '.hidden-folder',
  'folder-in-hidden-folder',
  'file.txt'
)
const fileInHiddenFolderInFolderA = path.join(
  root,
  'folder-a',
  '.hidden-folder-in-folder-a',
  'file.txt'
)

describe('Search', () => {
  beforeAll(async () => {
    // mock all output so that there is less noise when running tests
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(core, 'debug').mockImplementation(() => {})
    jest.spyOn(core, 'info').mockImplementation(() => {})
    jest.spyOn(core, 'warning').mockImplementation(() => {})

    // clear temp directory
    await io.rmRF(root)
    await fs.mkdir(path.join(root, 'folder-a', 'folder-b', 'folder-c'), {
      recursive: true
    })
    await fs.mkdir(path.join(root, 'folder-a', 'folder-b', 'folder-e'), {
      recursive: true
    })
    await fs.mkdir(path.join(root, 'folder-d'), {
      recursive: true
    })
    await fs.mkdir(path.join(root, 'folder-f'), {
      recursive: true
    })
    await fs.mkdir(path.join(root, 'folder-g'), {
      recursive: true
    })
    await fs.mkdir(path.join(root, 'folder-h', 'folder-i'), {
      recursive: true
    })
    await fs.mkdir(path.join(root, 'folder-h', 'folder-j', 'folder-k'), {
      recursive: true
    })

    await fs.mkdir(
      path.join(root, '.hidden-folder', 'folder-in-hidden-folder'),
      {recursive: true}
    )
    await fs.mkdir(path.join(root, 'folder-a', '.hidden-folder-in-folder-a'), {
      recursive: true
    })

    await fs.writeFile(searchItem1Path, 'search item1 file')
    await fs.writeFile(searchItem2Path, 'search item2 file')
    await fs.writeFile(searchItem3Path, 'search item3 file')
    await fs.writeFile(searchItem4Path, 'search item4 file')
    await fs.writeFile(searchItem5Path, 'search item5 file')

    await fs.writeFile(extraSearchItem1Path, 'extraSearch item1 file')
    await fs.writeFile(extraSearchItem2Path, 'extraSearch item2 file')
    await fs.writeFile(extraSearchItem3Path, 'extraSearch item3 file')
    await fs.writeFile(extraSearchItem4Path, 'extraSearch item4 file')
    await fs.writeFile(extraSearchItem5Path, 'extraSearch item5 file')

    await fs.writeFile(extraFileInFolderCPath, 'extra file')

    await fs.writeFile(amazingFileInFolderHPath, 'amazing file')

    await fs.writeFile(lonelyFilePath, 'all by itself')

    await fs.writeFile(hiddenFile, 'hidden file')
    await fs.writeFile(fileInHiddenFolderPath, 'file in hidden directory')
    await fs.writeFile(fileInHiddenFolderInFolderA, 'file in hidden directory')
    /*
      Directory structure of files that get created:
      root/
          .hidden-folder/
              folder-in-hidden-folder/
                  file.txt
          folder-a/
              .hidden-folder-in-folder-a/
                  file.txt
              folder-b/
                  folder-c/
                      search-item1.txt
                      extraSearch-item1.txt
                      extra-file-in-folder-c.txt
                  folder-e/
          folder-d/
              search-item2.txt
              search-item3.txt
              search-item4.txt
              extraSearch-item2.txt
          folder-f/
              extraSearch-item3.txt
          folder-g/
          folder-h/
              amazing-item.txt
              folder-i/
                  extraSearch-item4.txt
                  extraSearch-item5.txt
              folder-j/
                  folder-k/
                      lonely-file.txt
          .hidden-file.txt
          search-item5.txt
    */
  })

  it('Single file search - Absolute Path', async () => {
    const searchResult = await findFilesToUpload(extraFileInFolderCPath)
    expect(searchResult.filesToUpload.length).toEqual(1)
    expect(searchResult.filesToUpload[0]).toEqual(extraFileInFolderCPath)
    expect(searchResult.rootDirectory).toEqual(
      path.join(root, 'folder-a', 'folder-b', 'folder-c')
    )
  })

  it('Single file search - Relative Path', async () => {
    const relativePath = path.join(
      '__tests__',
      '_temp',
      'search',
      'folder-a',
      'folder-b',
      'folder-c',
      'search-item1.txt'
    )

    const searchResult = await findFilesToUpload(relativePath)
    expect(searchResult.filesToUpload.length).toEqual(1)
    expect(searchResult.filesToUpload[0]).toEqual(searchItem1Path)
    expect(searchResult.rootDirectory).toEqual(
      path.join(root, 'folder-a', 'folder-b', 'folder-c')
    )
  })

  it('Single file using wildcard', async () => {
    const expectedRoot = path.join(root, 'folder-h')
    const searchPath = path.join(root, 'folder-h', '**/*lonely*')
    const searchResult = await findFilesToUpload(searchPath)
    expect(searchResult.filesToUpload.length).toEqual(1)
    expect(searchResult.filesToUpload[0]).toEqual(lonelyFilePath)
    expect(searchResult.rootDirectory).toEqual(expectedRoot)
  })

  it('Single file using directory', async () => {
    const searchPath = path.join(root, 'folder-h', 'folder-j')
    const searchResult = await findFilesToUpload(searchPath)
    expect(searchResult.filesToUpload.length).toEqual(1)
    expect(searchResult.filesToUpload[0]).toEqual(lonelyFilePath)
    expect(searchResult.rootDirectory).toEqual(searchPath)
  })

  it('Directory search - Absolute Path', async () => {
    const searchPath = path.join(root, 'folder-h')
    const searchResult = await findFilesToUpload(searchPath)
    expect(searchResult.filesToUpload.length).toEqual(4)

    expect(
      searchResult.filesToUpload.includes(amazingFileInFolderHPath)
    ).toEqual(true)
    expect(searchResult.filesToUpload.includes(extraSearchItem4Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem5Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(lonelyFilePath)).toEqual(true)

    expect(searchResult.rootDirectory).toEqual(searchPath)
  })

  it('Directory search - Relative Path', async () => {
    const searchPath = path.join('__tests__', '_temp', 'search', 'folder-h')
    const expectedRootDirectory = path.join(root, 'folder-h')
    const searchResult = await findFilesToUpload(searchPath)
    expect(searchResult.filesToUpload.length).toEqual(4)

    expect(
      searchResult.filesToUpload.includes(amazingFileInFolderHPath)
    ).toEqual(true)
    expect(searchResult.filesToUpload.includes(extraSearchItem4Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem5Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(lonelyFilePath)).toEqual(true)

    expect(searchResult.rootDirectory).toEqual(expectedRootDirectory)
  })

  it('Wildcard search - Absolute Path', async () => {
    const searchPath = path.join(root, '**/*[Ss]earch*')
    const searchResult = await findFilesToUpload(searchPath)
    expect(searchResult.filesToUpload.length).toEqual(10)

    expect(searchResult.filesToUpload.includes(searchItem1Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem2Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem3Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem4Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem5Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(extraSearchItem1Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem2Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem3Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem4Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem5Path)).toEqual(
      true
    )

    expect(searchResult.rootDirectory).toEqual(root)
  })

  it('Wildcard search - Relative Path', async () => {
    const searchPath = path.join(
      '__tests__',
      '_temp',
      'search',
      '**/*[Ss]earch*'
    )
    const searchResult = await findFilesToUpload(searchPath)
    expect(searchResult.filesToUpload.length).toEqual(10)

    expect(searchResult.filesToUpload.includes(searchItem1Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem2Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem3Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem4Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem5Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(extraSearchItem1Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem2Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem3Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem4Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem5Path)).toEqual(
      true
    )

    expect(searchResult.rootDirectory).toEqual(root)
  })

  it('Multi path search - root directory', async () => {
    const searchPath1 = path.join(root, 'folder-a')
    const searchPath2 = path.join(root, 'folder-d')

    const searchPaths = searchPath1 + '\n' + searchPath2
    const searchResult = await findFilesToUpload(searchPaths)

    expect(searchResult.rootDirectory).toEqual(root)
    expect(searchResult.filesToUpload.length).toEqual(7)
    expect(searchResult.filesToUpload.includes(searchItem1Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem2Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem3Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem4Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(extraSearchItem1Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem2Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraFileInFolderCPath)).toEqual(
      true
    )
  })

  it('Multi path search - with exclude character', async () => {
    const searchPath1 = path.join(root, 'folder-a')
    const searchPath2 = path.join(root, 'folder-d')
    const searchPath3 = path.join(root, 'folder-a', 'folder-b', '**/extra*.txt')

    // negating the third search path
    const searchPaths = searchPath1 + '\n' + searchPath2 + '\n!' + searchPath3
    const searchResult = await findFilesToUpload(searchPaths)

    expect(searchResult.rootDirectory).toEqual(root)
    expect(searchResult.filesToUpload.length).toEqual(5)
    expect(searchResult.filesToUpload.includes(searchItem1Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem2Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem3Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(searchItem4Path)).toEqual(true)
    expect(searchResult.filesToUpload.includes(extraSearchItem2Path)).toEqual(
      true
    )
  })

  it('Multi path search - non root directory', async () => {
    const searchPath1 = path.join(root, 'folder-h', 'folder-i')
    const searchPath2 = path.join(root, 'folder-h', 'folder-j', 'folder-k')
    const searchPath3 = amazingFileInFolderHPath

    const searchPaths = [searchPath1, searchPath2, searchPath3].join('\n')
    const searchResult = await findFilesToUpload(searchPaths)

    expect(searchResult.rootDirectory).toEqual(path.join(root, 'folder-h'))
    expect(searchResult.filesToUpload.length).toEqual(4)
    expect(
      searchResult.filesToUpload.includes(amazingFileInFolderHPath)
    ).toEqual(true)
    expect(searchResult.filesToUpload.includes(extraSearchItem4Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(extraSearchItem5Path)).toEqual(
      true
    )
    expect(searchResult.filesToUpload.includes(lonelyFilePath)).toEqual(true)
  })

  it('Hidden files ignored by default', async () => {
    const searchPath = path.join(root, '**/*')
    const searchResult = await findFilesToUpload(searchPath)

    expect(searchResult.filesToUpload).not.toContain(hiddenFile)
    expect(searchResult.filesToUpload).not.toContain(fileInHiddenFolderPath)
    expect(searchResult.filesToUpload).not.toContain(
      fileInHiddenFolderInFolderA
    )
  })

  it('Hidden files included', async () => {
    const searchPath = path.join(root, '**/*')
    const searchResult = await findFilesToUpload(searchPath, true)

    expect(searchResult.filesToUpload).toContain(hiddenFile)
    expect(searchResult.filesToUpload).toContain(fileInHiddenFolderPath)
    expect(searchResult.filesToUpload).toContain(fileInHiddenFolderInFolderA)
  })
})
