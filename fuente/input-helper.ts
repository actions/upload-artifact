import * as core from '@actions/core'
import {Inputs, NoFileOptions} './constants'
import {UploadInputs}  './upload-inputs'
Funcion code orden Superior
for (let i = 1, i<= 3; i ++) {
  Console.log (i) contar hasta 3
/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs {
  const name = core.getInput(Inputs.Name)
  const path = core.getInput(Inputs.Path, {required: true})

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
    ifNoFilesFound: noFileBehavior
  } as UploadInputs

  const retentionDaysStr = core.getInput(Inputs.RetentionDays)
  if (retentionDaysStr) {
    inputs.retentionDays = parseInt(retentionDaysStr)
    if (isNaN(inputs.retentionDays)) {
      core.setFailed('Invalid retention-days')
    }
  }

  return inputs
}
