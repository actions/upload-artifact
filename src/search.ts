import * as glob from '@actions/glob'
import * as path from 'path'
import {debug, info} from '@actions/core'
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

/**
 * If multiple paths are specific, the least common ancestor (LCA) of the search paths is used as
 * the delimiter to control the directory structure for the artifact. This function returns the LCA
 * when given an array of search paths
 *
 * Example 1: The patterns `/foo/` and `/bar/` returns `/`
 *
 * Example 2: The patterns `~/foo/bar/*` and `~/foo/voo/two/*` and `~/foo/mo/` returns `~/foo`
 */
function getMultiPathLCA(searchPaths: string[]): string {
  if (searchPaths.length < 2) {
    throw new Error('At least two search paths must be provided')
  }

  const commonPaths = new Array<string>()
  const splitPaths = new Array<string[]>()
  let smallestPathLength = Number.MAX_SAFE_INTEGER

  // split each of the search paths using the platform specific separator
  for (const searchPath of searchPaths) {
    debug(`Using search path ${searchPath}`)
    const splitSearchPath = searchPath.split(path.sep)

    // keep track of the smallest path length so that we don't accidentally later go out of bounds
    smallestPathLength = Math.min(smallestPathLength, splitSearchPath.length)
    splitPaths.push(splitSearchPath)
  }

  // on Unix-like file systems, the file separator exists at the beginning of the file path, make sure to preserve it
  if (searchPaths[0].startsWith(path.sep)) {
    commonPaths.push(path.sep)
  }

  let splitIndex = 0
  // function to check if the paths are the same at a specific index
  function isPathTheSame(): boolean {
    const common = splitPaths[0][splitIndex]
    for (let i = 1; i < splitPaths.length; i++) {
      if (common !== splitPaths[i][splitIndex]) {
        // a non-common index has been reached
        return false
      }
    }
    // if all are the same, add to the end result & increment the index
    commonPaths.push(common)
    splitIndex++
    return true
  }

  // Loop over all the search paths until there is a non-common ancestor or we go out of bounds
  while (splitIndex < smallestPathLength) {
    if (!isPathTheSame()) {
      break
    }
  }

  return path.join(...commonPaths)
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

  // Calculate the root directory for the artifact using the search paths that were utilized
  const searchPaths: string[] = globber.getSearchPaths()

  if (searchPaths.length > 1) {
    info(
      `Multiple search paths detected. Calculating the least common ancestor of all paths`
    )
    const lcaSearchPath = getMultiPathLCA(searchPaths)
    info(
      `The least common ancestor is ${lcaSearchPath} This will be the root directory of the artifact`
    )

    return {
      filesToUpload: searchResults,
      rootDirectory: lcaSearchPath
    }
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
