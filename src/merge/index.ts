import * as core from '@actions/core'
import {run} from './merge-artifacts'

run().catch(error => {
  core.setFailed((error as Error).message)
})
