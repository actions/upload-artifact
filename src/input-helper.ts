import * as core from '@actions/core'
import {Inputs, NoFileOptions} from './constants'
import {UploadInputs} from './upload-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs {
  const name = core.getInput(Inputs.Name)
  const path = core.getInput(Inputs.Path, {required: true})

  const searchPath = parseFromJSON(path) || [path]

  const defaultArtifactName = 'artifact'
  // Accepts an individual value or an array as input, if array sizes don't match, use default value instead
  const artifactName = parseParamaterToArrayFromInput(
    name,
    searchPath.length,
    defaultArtifactName,
    (defaultInput, index) => {
      const artifactIndexStr = index == 0 ? '' : `_${index + 1}`
      return `${defaultInput}${artifactIndexStr}`
    }
  )

  // Accepts an individual value or an array as input
  const retention = core.getInput(Inputs.RetentionDays)
  const retentionDays = parseParamaterToArrayFromInput(
    retention,
    searchPath.length,
    undefined,
    defaultInput => defaultInput
  ).map(parseRetentionDays)

  const ifNoFilesFound = core.getInput(Inputs.IfNoFilesFound)
  const noFileBehavior: NoFileOptions = NoFileOptions[ifNoFilesFound]

  if (!noFileBehavior) {
    core.setFailed(
      `Unrecognized ${
        Inputs.IfNoFilesFound
      } input. Provided: ${ifNoFilesFound}. Available options: ${Object.keys(
        NoFileOptions
      )}`
    )
  }

  const inputs = {
    artifactName,
    searchPath,
    retentionDays,
    ifNoFilesFound: noFileBehavior
  } as UploadInputs

  return inputs
}

function parseParamaterToArrayFromInput(
  input: string | undefined,
  requiredLength: number,
  defaultInput: string | undefined,
  defaultFunc: (
    defaultInput: string | undefined,
    index: number
  ) => string | undefined
): (string | undefined)[] {
  // Accepts an individual value or an array as input, if array size doesn't match the required length, fill the rest with a default value
  const inputArray = parseFromJSON(input || '[]')
  if (inputArray != null) {
    // If a stringified JSON array is provided, use it and concat it with the default when required
    return (<(string | undefined)[]>inputArray).concat(
      Array.from(
        {length: Math.max(0, requiredLength - inputArray.length)},
        (_, index) => defaultFunc(defaultInput, index)
      )
    )
  }
  // If a string is provided, fill the array with that value
  return Array.from({length: Math.max(0, requiredLength)}, (_, index) =>
    defaultFunc(input || defaultInput, index)
  )
}

function parseFromJSON(jsonStr: string): string[] | undefined {
  try {
    const json = <string[]>JSON.parse(jsonStr)
    if (Array.isArray(json)) {
      return json
    }
  } catch (_err) {
    // Input wasn't a stringified JSON array (string[]), return undefined to signal an invalid JSON was provided
  }
  return undefined
}

function parseRetentionDays(
  retentionDaysStr: string | undefined
): number | undefined {
  if (retentionDaysStr != null) {
    const retentionDays = parseInt(retentionDaysStr)
    if (isNaN(retentionDays)) {
      core.setFailed('Invalid retention-days')
    }
    return retentionDays
  }
  return undefined
}
