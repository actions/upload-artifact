import * as core from '@actions/core'
import {run} from './upload-artifact'

run().catch(error => {
  core.setFailed((error as Error).message)
})
