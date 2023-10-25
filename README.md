# Upload-Artifact v4 beta

❗ Not publicly available. If you try to use this version then it will fail. Available only internally at GitHub while in development. Stay tuned for public announcements soon about broader availability❗

This uploads artifacts from your workflow allowing you to share data between jobs and store data once a workflow is complete.

See also [download-artifact](https://github.com/actions/download-artifact).

# What's new

🚧 Under construction 🚧

Big changes coming...

Refer [here](https://github.com/actions/upload-artifact/tree/releases/v3) for the previous version

# Usage

See [action.yml](action.yml)

### Upload an Individual File

```yaml
steps:
- uses: actions/checkout@v3

- run: mkdir -p path/to/artifact

- run: echo hello > path/to/artifact/world.txt

- uses: actions/upload-artifact@v4-beta
  with:
    name: my-artifact
    path: path/to/artifact/world.txt
```

### Upload an Entire Directory

```yaml
- uses: actions/upload-artifact@v4-beta
  with:
    name: my-artifact
    path: path/to/artifact/ # or path/to/artifact
```

### Upload using a Wildcard Pattern

```yaml
- uses: actions/upload-artifact@v4-beta
  with:
    name: my-artifact
    path: path/**/[abc]rtifac?/*
```

### Upload using Multiple Paths and Exclusions

```yaml
- uses: actions/upload-artifact@v4-beta
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
- uses: actions/upload-artifact@v4-beta
  with:
    name: my-artifact
    path: path/to/artifact/
    if-no-files-found: error # 'warn' or 'ignore' are also available, defaults to `warn`
```

### Conditional Artifact Upload

To upload artifacts only when the previous step of a job failed, use [`if: failure()`](https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#job-status-check-functions):

```yaml
- uses: actions/upload-artifact@v4-beta
  if: failure()
  with:
    name: my-artifact
    path: path/to/artifact/
```

### Uploading without an artifact name

You can upload an artifact without specifying a name

```yaml
- uses: actions/upload-artifact@v4-beta
  with:
    path: path/to/artifact/world.txt
```

If not provided, `artifact` will be used as the default name which will manifest itself in the UI after upload.

### Uploading to the same artifact

Unlike earlier versions of `upload-artifact`, uploading to the same artifact via multiple jobs is _not_ supported with `v4`. 

```yaml
- run: echo hi > world.txt
- uses: actions/upload-artifact@v4-beta
  with:
    path: world.txt

- run: echo howdy > extra-file.txt
- uses: actions/upload-artifact@v4-beta
  with:
    path: extra-file.txt
```

Artifact names must be unique since each created artifact is idempotent so multiple jobs cannot modify the same artifact.

### Environment Variables and Tilde Expansion

You can use `~` in the path input as a substitute for `$HOME`. Basic tilde expansion is supported:

```yaml
  - run: |
      mkdir -p ~/new/artifact
      echo hello > ~/new/artifact/world.txt
  - uses: actions/upload-artifact@v4-beta
    with:
      name: Artifacts-V4-beta
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
    - uses: actions/upload-artifact@v4-beta
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
    - uses: actions/upload-artifact@v4-beta
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
    uses: actions/upload-artifact@v4-beta
    with:
      name: my-artifact
      path: my_file.txt
      retention-days: 5
```

The retention period must be between 1 and 90 inclusive. For more information see [artifact and log retention policies](https://docs.github.com/en/free-pro-team@latest/actions/reference/usage-limits-billing-and-administration#artifact-and-log-retention-policy).

## Outputs

If an artifact upload is successful then an `artifact-id` output is available. This ID is a unique identifier that can be used with [Artifact REST APIs](https://docs.github.com/en/rest/actions/artifacts).

### Example output between steps

```yml
    - uses: actions/upload-artifact@v4-beta
      id: artifact-upload-step
      with:
        name: my-artifact
        path: path/to/artifact/content/

    - name: Output artifact ID
      run:  echo 'Artifact ID is ${{ steps.artifact-upload-step.outputs.artifact-id }}'
```

### Example output between jobs

```yml
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      output1: ${{ steps.my-artifact.outputs.artifact-id }}
    steps:
      - uses: actions/upload-artifact@v4-beta
        id: artifact-upload-step
        with:
          name: my-artifact
          path: path/to/artifact/content/
  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:
      - env:
          OUTPUT1: ${{needs.job1.outputs.output1}}
        run: echo "Artifact ID from previous job is $OUTPUT1"
```

## Where does the upload go?

At the bottom of the workflow summary page, there is a dedicated section for artifacts. Here's a screenshot of something you might see:

<img src="https://user-images.githubusercontent.com/16109154/103645952-223c6880-4f59-11eb-8268-8dca6937b5f9.png" width="700" height="300">

There is a trashcan icon that can be used to delete the artifact. This icon will only appear for users who have write permissions to the repository.

The size of the artifact is denoted in bytes. The displayed artifact size denotes the size of the zip that `upload-artifact` creates during upload.

## Additional Documentation

See [Storing workflow data as artifacts](https://docs.github.com/en/actions/advanced-guides/storing-workflow-data-as-artifacts) for additional examples and tips.

See extra documentation for the [@actions/artifact](https://github.com/actions/toolkit/blob/main/packages/artifact/docs/additional-information.md) package that is used internally regarding certain behaviors and limitations.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
