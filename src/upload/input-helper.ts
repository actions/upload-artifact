import * as core from '@actions/core'
import {Inputs} from './constants'
import {NoFileOptions} from '../shared/constants'
import {UploadInputs} from './upload-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs {
  const name = core.getInput(Inputs.Name)
  const path = core.getInput(Inputs.Path, {required: true})
  const overwrite = core.getBooleanInput(Inputs.Overwrite)

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
    artifactName: name,
    searchPath: path,
    ifNoFilesFound: noFileBehavior,
    overwrite: overwrite
  } as UploadInputs

  const retentionDaysStr = core.getInput(Inputs.RetentionDays)
  if (retentionDaysStr) {
    inputs.retentionDays = parseInt(retentionDaysStr)
    if (isNaN(inputs.retentionDays)) {
      core.setFailed('Invalid retention-days')
    }
  }

  const compressionLevelStr = core.getInput(Inputs.CompressionLevel)
  if (compressionLevelStr) {
    inputs.compressionLevel = parseInt(compressionLevelStr)
    if (isNaN(inputs.compressionLevel)) {
      core.setFailed('Invalid compression-level')
    }

    if (inputs.compressionLevel < 0 || inputs.compressionLevel > 9) {
      core.setFailed('Invalid compression-level. Valid values are 0-9')
    }
  }

  return inputs
}
