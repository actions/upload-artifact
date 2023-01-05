import {NoFileOptions} from './constants'

export interface UploadInputs {
  /**
   * The name of the artifact that will be uploaded
   */
  artifactsName: string

  /**
   * The search path used to describe what to upload as part of the artifact
   */
  searchPath: string

  /**
   * The desired behavior if no files are found with the provided search path
   */
  ifNoFilesFound: NoFileOptions

  /**
   * Duration after which artifact will expire in days
   */
  retentionDays: number
}

export interface UploadPerFile {
  searchPath: string
  ifNoFilesFound: NoFileOptions
  retentionDays: number

  // artifact-per-file: {true | false}
  // @default: false
  artifactPerFile: boolean

  // https://nodejs.org/docs/latest-v16.x/api/path.html#pathparsepath
  // @args: searchResult.filesToUpload
  // @return: String.replace()
  // @default: pathObject.base
  // @default rule: "${base}"
  artifactNameRule: string
}
