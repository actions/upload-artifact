import * as core from '@actions/core'
import {Inputs, NoFileOptions} from './constants'
import {UploadInputs, UploadPerFile} from './upload-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs | UploadPerFile {
  const TRUE_MAP = ['true', 'True', 'TRUE']

  let artifactPerFile = false
  const artifactPerFileStr = core.getInput(Inputs.ArtifactPerFile)
  if (artifactPerFileStr) {
    artifactPerFile = TRUE_MAP.includes(artifactPerFileStr) ? true : false
  }

  let name = ''
  let artifactNameRule = ''
  if (!artifactPerFile) {
    name = core.getInput(Inputs.Name)
  } else {
    artifactNameRule = core.getInput(Inputs.ArtifactNameRule) || '${base}'
  }

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

  const typedInputs = (
    artifactPerFile: boolean
  ): UploadInputs | UploadPerFile => {
    const retentionDaysStr = core.getInput(Inputs.RetentionDays)

    if (!artifactPerFile) {
      const inputs = {
        artifactsName: name,
        searchPath: path,
        ifNoFilesFound: noFileBehavior
      } as UploadInputs

      if (retentionDaysStr) {
        inputs.retentionDays = parseInt(retentionDaysStr)
        if (isNaN(inputs.retentionDays)) {
          core.setFailed('Invalid retention-days')
        }
      }

      return inputs
    } else {
      const inputs = {
        searchPath: path,
        ifNoFilesFound: noFileBehavior,
        artifactPerFile: artifactPerFile,
        artifactNameRule: artifactNameRule
      } as UploadPerFile

      if (retentionDaysStr) {
        inputs.retentionDays = parseInt(retentionDaysStr)
        if (isNaN(inputs.retentionDays)) {
          core.setFailed('Invalid retention-days')
        }
      }

      return inputs
    }
  }

  return typedInputs(artifactPerFile)
}
