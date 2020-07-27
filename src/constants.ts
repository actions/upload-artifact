export enum Inputs {
  Name = 'name',
  Path = 'path',
  IfNoFilesFound = 'if-no-files-found'
}

export enum NoFileOptions {
  /**
   * Default. Output a warning but do not fail the action
   */
  warn,

  /**
   * Fail the action with an error message
   */
  error,

  /**
   * Do not output any warnings or errors, the action does not fail
   */
  suppress
}
