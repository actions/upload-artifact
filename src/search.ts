import * as glob from '@actions/glob'
import {debug} from '@actions/core'
import {lstatSync} from 'fs'
import {dirname} from 'path'

export interface SearchResult {
  filesToUpload: string[]
  rootDirectory: string
}

function getDefaultGlobOptions(): glob.GlobOptions {
  return {
    followSymbolicLinks: true,
    implicitDescendants: true,
    omitBrokenSymbolicLinks: true
  }
}

export async function findFilesToUpload(
  searchPath: string,
  globOptions?: glob.GlobOptions
): Promise<SearchResult> {
  const searchResults: string[] = []
  const globber = await glob.create(
    searchPath,
    globOptions || getDefaultGlobOptions()
  )
  const rawSearchResults: string[] = await globber.glob()

  /*
    Directories will be rejected if attempted to be uploaded. This includes just empty
    directories so filter any directories out from the raw search results
  */
  for (const searchResult of rawSearchResults) {
    if (!lstatSync(searchResult).isDirectory()) {
      debug(`File:${searchResult} was found using the provided searchPath`)
      searchResults.push(searchResult)
    } else {
      debug(
        `Removing ${searchResult} from rawSearchResults because it is a directory`
      )
    }
  }

  /*
    Only a single search pattern is being included so only 1 searchResult is expected. In the future if multiple search patterns are
    simultaneously supported this will change
  */
  const searchPaths: string[] = globber.getSearchPaths()
  if (searchPaths.length > 1) {
    throw new Error('Only 1 search path should be returned')
  }

  /*
    Special case for a single file artifact that is uploaded without a directory or wildcard pattern. The directory structure is
    not preserved and the root directory will be the single files parent directory
  */
  if (searchResults.length === 1 && searchPaths[0] === searchResults[0]) {
    return {
      filesToUpload: searchResults,
      rootDirectory: dirname(searchResults[0])
    }
  }

  return {
    filesToUpload: searchResults,
    rootDirectory: searchPaths[0]
  }
}
