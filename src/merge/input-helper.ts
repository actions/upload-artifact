import * as core from '@actions/core'
import {Inputs} from './constants'
import {NoFileOptions} from '../shared/constants'
import {MergeInputs} from './merge-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): MergeInputs {
  const name = core.getInput(Inputs.Name, {required: true})
  const pattern = core.getInput(Inputs.Pattern, {required: true})
  const separateDirectories = core.getBooleanInput(Inputs.SeparateDirectories)
  const deleteMerged = core.getBooleanInput(Inputs.DeleteMerged)

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
    name,
    pattern,
    ifNoFilesFound: noFileBehavior,
    separateDirectories,
    deleteMerged,
    retentionDays: 0,
    compressionLevel: 6
  } as MergeInputs

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
