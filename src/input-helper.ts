import * as core from '@actions/core'
import {Inputs, NoFileOptions} from './constants'
import {UploadInputs} from './upload-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs {
  const name = core.getInput(Inputs.Name)
  const path = core.getInput(Inputs.Path, {required: true})

  const searchPath = Array.isArray(path) ? path : [path]

  const defaultArtifactName = 'artifact'
  // Accepts an individual value or an array as input, if array sizes don't match, use default value instead
  const artifactName = Array.isArray(name)
    ? name.concat(
        new Array(Math.max(0, searchPath.length - name.length)).fill(
          defaultArtifactName
        )
      )
    : new Array(searchPath.length).fill(name || defaultArtifactName)

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
    ifNoFilesFound: noFileBehavior
  } as UploadInputs

  // Accepts an individual value or an array as input
  const retentionDays = core.getInput(Inputs.RetentionDays)
  if (Array.isArray(retentionDays)) {
    // If array sizes don't match, use default value instead
    inputs.retentionDays = retentionDays
      .map(parseRetentionDays)
      .concat(
        new Array(Math.max(0, searchPath.length - retentionDays.length)).fill(
          undefined
        )
      )
  } else {
    const retention = parseRetentionDays(retentionDays)
    inputs.retentionDays = new Array(searchPath.length).fill(retention)
  }

  return inputs
}

function parseRetentionDays(
  retentionDaysStr: string | undefined
): number | undefined {
  if (retentionDaysStr) {
    const retentionDays = parseInt(retentionDaysStr)
    if (isNaN(retentionDays)) {
      core.setFailed('Invalid retention-days')
    }
    return retentionDays
  } else {
    return undefined
  }
}
