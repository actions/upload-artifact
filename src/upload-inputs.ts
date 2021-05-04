import {NoFileOptions} from './constants'

export interface UploadInputs {
  /**
   * The name of the artifact that will be uploaded
   */
  artifactName: string[]

  /**
   * The search path used to describe what to upload as part of the artifact
   */
  searchPath: string[]

  /**
   * The desired behavior if no files are found with the provided search path
   */
  ifNoFilesFound: NoFileOptions

  /**
   * Duration after which artifact will expire in days
   */
  retentionDays: (number | undefined)[]
}
