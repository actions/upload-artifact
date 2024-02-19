import {NoFileOptions} from '../shared/constants'

export interface MergeInputs {
  /**
   * The name of the artifact that the artifacts will be merged into
   */
  name: string

  /**
   * A glob pattern matching the artifacts that should be merged.
   */
  pattern: string

  /**
   * The desired behavior if no files are found with the provided search path
   */
  ifNoFilesFound: NoFileOptions

  /**
   * Duration after which artifact will expire in days
   */
  retentionDays: number

  /**
   * The level of compression for Zlib to be applied to the artifact archive.
   */
  compressionLevel?: number

  /**
   * If true, the artifacts that were merged will be deleted.
   * If false, the artifacts will still exist.
   */
  deleteMerged: boolean

  /**
   * If true, the artifacts will be merged into separate directories.
   * If false, the artifacts will be merged into the root of the destination.
   */
  separateDirectories: boolean
}
