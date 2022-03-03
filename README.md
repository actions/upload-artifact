# Upload-Artifact v3

This uploads artifacts from your workflow allowing you to share data between jobs and store data once a workflow is complete.

See also [download-artifact](https://github.com/actions/download-artifact).

# What's new

- Easier upload
  - Specify a wildcard pattern
  - Specify an individual file
  - Specify a directory (previously you were limited to only this option)
  - Multi path upload
    - Use a combination of individual files, wildcards or directories
    - Support for excluding certain files
- Upload an artifact without providing a name
- Fix for artifact uploads sometimes not working with containers
- Proxy support out of the box
- Port entire action to typescript from a runner plugin so it is easier to collaborate and accept contributions

Refer [here](https://github.com/actions/upload-artifact/tree/releases/v1) for the previous version

# Usage

See [action.yml](action.yml)

### Upload an Individual File

```yaml
steps:
- uses: actions/checkout@v2

- run: mkdir -p path/to/artifact

- run: echo hello > path/to/artifact/world.txt

- uses: actions/upload-artifact@v3
  with:
    name: my-artifact
    path: path/to/artifact/world.txt
```

### Upload an Entire Directory

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: my-artifact
    path: path/to/artifact/ # or path/to/artifact
```

### Upload using a Wildcard Pattern

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: my-artifact
    path: path/**/[abc]rtifac?/*
```

### Upload using Multiple Paths and Exclusions

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: my-artifact
    path: |
      path/output/bin/
      path/output/test-results
      !path/**/*.tmp
```

For supported wildcards along with behavior and documentation, see [@actions/glob](https://github.com/actions/toolkit/tree/main/packages/glob) which is used internally to search for files.

If a wildcard pattern is used, the path hierarchy will be preserved after the first wildcard pattern:

```
path/to/*/directory/foo?.txt =>
    ∟ path/to/some/directory/foo1.txt
    ∟ path/to/some/directory/foo2.txt
    ∟ path/to/other/directory/foo1.txt

would be flattened and uploaded as =>
    ∟ some/directory/foo1.txt
    ∟ some/directory/foo2.txt
    ∟ other/directory/foo1.txt
```

If multiple paths are provided as input, the least common ancestor of all the search paths will be used as the root directory of the artifact. Exclude paths do not affect the directory structure.

Relative and absolute file paths are both allowed. Relative paths are rooted against the current working directory. Paths that begin with a wildcard character should be quoted to avoid being interpreted as YAML aliases.

The [@actions/artifact](https://github.com/actions/toolkit/tree/main/packages/artifact) package is used internally to handle most of the logic around uploading an artifact. There is extra documentation around upload limitations and behavior in the toolkit repo that is worth checking out.

### Customization if no files are found

If a path (or paths), result in no files being found for the artifact, the action will succeed but print out a warning. In certain scenarios it may be desirable to fail the action or suppress the warning. The `if-no-files-found` option allows you to customize the behavior of the action if no files are found:

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: my-artifact
    path: path/to/artifact/
    if-no-files-found: error # 'warn' or 'ignore' are also available, defaults to `warn`
```

### Conditional Artifact Upload

To upload artifacts only when the previous step of a job failed, use [`if: failure()`](https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#job-status-check-functions):

```yaml
- uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: my-artifact
    path: path/to/artifact/
```

### Uploading without an artifact name

You can upload an artifact without specifying a name

```yaml
- uses: actions/upload-artifact@v3
  with:
    path: path/to/artifact/world.txt
```

If not provided, `artifact` will be used as the default name which will manifest itself in the UI after upload.

### Uploading to the same artifact

With the following example, the available artifact (named `artifact` by default if no name is provided) would contain both `world.txt` (`hello`) and `extra-file.txt` (`howdy`):

```yaml
- run: echo hi > world.txt
- uses: actions/upload-artifact@v3
  with:
    path: world.txt

- run: echo howdy > extra-file.txt
- uses: actions/upload-artifact@v3
  with:
    path: extra-file.txt

- run: echo hello > world.txt
- uses: actions/upload-artifact@v3
  with:
    path: world.txt
```

Each artifact behaves as a file share. Uploading to the same artifact multiple times in the same workflow can overwrite and append already uploaded files:

```yaml
    strategy:
      matrix:
          node-version: [8.x, 10.x, 12.x, 13.x]
    steps:
        - name: Create a file
          run: echo ${{ matrix.node-version }} > my_file.txt
        - name: Accidentally upload to the same artifact via multiple jobs
          uses: actions/upload-artifact@v3
          with:
              name: my-artifact
              path: ${{ github.workspace }}
```

> **_Warning:_** Be careful when uploading to the same artifact via multiple jobs as artifacts may become corrupted. When uploading a file with an identical name and path in multiple jobs, uploads may fail with 503 errors due to conflicting uploads happening at the same time. Ensure uploads to identical locations to not interfere with each other.

In the above example, four jobs will upload four different files to the same artifact but there will only be one file available when `my-artifact` is downloaded. Each job overwrites what was previously uploaded. To ensure that jobs don't overwrite existing artifacts, use a different name per job:

```yaml
          uses: actions/upload-artifact@v3
          with:
              name: my-artifact ${{ matrix.node-version }}
              path: ${{ github.workspace }}
```

### Environment Variables and Tilde Expansion

You can use `~` in the path input as a substitute for `$HOME`. Basic tilde expansion is supported:

```yaml
  - run: |
      mkdir -p ~/new/artifact
      echo hello > ~/new/artifact/world.txt
  - uses: actions/upload-artifact@v3
    with:
      name: Artifacts-V3
      path: ~/new/**/*
```

Environment variables along with context expressions can also be used for input. For documentation see [context and expression syntax](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions):

```yaml
    env:
      name: my-artifact
    steps:
    - run: |
        mkdir -p ${{ github.workspace }}/artifact
        echo hello > ${{ github.workspace }}/artifact/world.txt
    - uses: actions/upload-artifact@v3
      with:
        name: ${{ env.name }}-name
        path: ${{ github.workspace }}/artifact/**/*
```

For environment variables created in other steps, make sure to use the `env` expression syntax

```yaml
    steps:
    - run: | 
        mkdir testing
        echo "This is a file to upload" > testing/file.txt
        echo "artifactPath=testing/file.txt" >> $GITHUB_ENV
    - uses: actions/upload-artifact@v3
      with:
        name: artifact
        path: ${{ env.artifactPath }} # this will resolve to testing/file.txt at runtime
```

### Retention Period

Artifacts are retained for 90 days by default. You can specify a shorter retention period using the `retention-days` input:

```yaml
  - name: Create a file
    run: echo "I won't live long" > my_file.txt

  - name: Upload Artifact
    uses: actions/upload-artifact@v3
    with:
      name: my-artifact
      path: my_file.txt
      retention-days: 5
```

The retention period must be between 1 and 90 inclusive. For more information see [artifact and log retention policies](https://docs.github.com/en/free-pro-team@latest/actions/reference/usage-limits-billing-and-administration#artifact-and-log-retention-policy).

## Where does the upload go?

At the bottom of the workflow summary page, there is a dedicated section for artifacts. Here's a screenshot of something you might see:

<img src="https://user-images.githubusercontent.com/16109154/103645952-223c6880-4f59-11eb-8268-8dca6937b5f9.png" width="700" height="300">

There is a trashcan icon that can be used to delete the artifact. This icon will only appear for users who have write permissions to the repository.

The size of the artifact is denoted in bytes. The displayed artifact size denotes the raw uploaded artifact size (the sum of all the individual files uploaded during the workflow run for the artifact), not the compressed size. When you click to download an artifact from the summary page, a compressed zip is created with all the contents of the artifact and the size of the zip that you download may differ significantly from the displayed size. Billing is based on the raw uploaded size and not the size of the zip.

# Limitations

### Zipped Artifact Downloads

During a workflow run, files are uploaded and downloaded individually using the `upload-artifact` and `download-artifact` actions. However, when a workflow run finishes and an artifact is downloaded from either the UI or through the [download api](https://developer.github.com/v3/actions/artifacts/#download-an-artifact), a zip is dynamically created with all the file contents that were uploaded. There is currently no way to download artifacts after a workflow run finishes in a format other than a zip or to download artifact contents individually. One of the consequences of this limitation is that if a zip is uploaded during a workflow run and then downloaded from the UI, there will be a double zip created.

### Permission Loss

:exclamation: File permissions are not maintained during artifact upload :exclamation: For example, if you make a file executable using `chmod` and then upload that file, post-download the file is no longer guaranteed to be set as an executable.

### Case Insensitive Uploads

:exclamation: File uploads are case insensitive :exclamation: If you upload `A.txt` and `a.txt` with the same root path, only a single file will be saved and available during download.

### Maintaining file permissions and case sensitive files

If file permissions and case sensitivity are required, you can `tar` all of your files together before artifact upload. Post download, the `tar` file will maintain file permissions and case sensitivity:

```yaml
  - name: Tar files
    run: tar -cvf my_files.tar /path/to/my/directory

  - name: Upload Artifact
    uses: actions/upload-artifact@v3
    with:
      name: my-artifact
      path: my_files.tar
```

### Too many uploads resulting in 429 responses

A very minute subset of users who upload a very very large amount of artifacts in a short period of time may see their uploads throttled or fail because of `Request was blocked due to exceeding usage of resource 'DBCPU' in namespace` or `Unable to copy file to server StatusCode=TooManyRequests`.

To reduce the chance of this happening, you can reduce the number of HTTP calls made during artifact upload by zipping or archiving the contents of your artifact before an upload starts. As an example, imagine an artifact with 1000 files (each 10 Kb in size). Without any modification, there would be around 1000 HTTP calls made to upload the artifact. If you zip or archive the artifact beforehand, the number of HTTP calls can be dropped to single digit territory. Measures like this will significantly speed up your upload and prevent uploads from being throttled or in some cases fail.

## Additional Documentation

See [Storing workflow data as artifacts](https://docs.github.com/en/actions/advanced-guides/storing-workflow-data-as-artifacts) for additional examples and tips.

See extra documentation for the [@actions/artifact](https://github.com/actions/toolkit/blob/main/packages/artifact/docs/additional-information.md) package that is used internally regarding certain behaviors and limitations.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
