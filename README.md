# Upload-Artifact v2

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

- uses: actions/upload-artifact@v2
  with:
    name: my-artifact
    path: path/to/artifact/world.txt
```

### Upload an Entire Directory

```yaml
- uses: actions/upload-artifact@v2
  with:
    name: my-artifact
    path: path/to/artifact/ # or path/to/artifact
```

### Upload using a Wildcard Pattern
```yaml
- uses: actions/upload-artifact@v2
  with:
    name: my-artifact
    path: path/**/[abc]rtifac?/*
```

### Upload using Multiple Paths and Exclusions
```yaml
- uses: actions/upload-artifact@v2
  with:
    name: my-artifact
    path: |
      path/output/bin/
      path/output/test-results
      !path/**/*.tmp
```

For supported wildcards along with behavior and documentation, see [@actions/glob](https://github.com/actions/toolkit/tree/master/packages/glob) which is used internally to search for files.

If a wildcard pattern is used, the path hierarchy will be preserved after the first wildcard pattern. 

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
If multiple paths are provided as input, the least common ancestor of all the search paths will be used as the root directory of the artifact. Exclude characters do not effect the directory structure.

Relative and absolute file paths are both allowed. Relative paths are rooted against the current working directory. Paths that begin with a wildcard character should be quoted to avoid being interpreted as YAML aliases.

The [@actions/artifact](https://github.com/actions/toolkit/tree/master/packages/artifact) package is used internally to handle most of the logic around uploading an artifact. There is extra documentation around upload limitations and behavior in the toolkit repo that is worth checking out.

### Conditional Artifact Upload

To upload artifacts only when the previous step of a job failed, use [`if: failure()`](https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#job-status-check-functions):

```yaml
- uses: actions/upload-artifact@v2
  if: failure()
  with:
    name: my-artifact
    path: path/to/artifact/
```

### Uploading without an artifact name

You can upload an artifact without specifying a name
```yaml
- uses: actions/upload-artifact@v2
  with:
    path: path/to/artifact/world.txt
```

If not provided, `artifact` will be used as the default name which will manifest itself in the UI after upload.

### Uploading to the same artifact

Each artifact behaves as a file share. Uploading to the same artifact multiple times in the same workflow can overwrite and append already uploaded files

```yaml
- run: echo hi > world.txt
- uses: actions/upload-artifact@v2
  with:
    path: world.txt

- run: echo howdy > extra-file.txt
- uses: actions/upload-artifact@v2
  with:
    path: extra-file.txt

- run: echo hello > world.txt
- uses: actions/upload-artifact@v2
  with:
    path: world.txt
```
With the following example, the available artifact (named `artifact` which is the default if no name is provided) would contain both `world.txt` (`hello`) and `extra-file.txt` (`howdy`).

> **_Warning:_**  Be careful when uploading to the same artifact via multiple jobs as artifacts may become corrupted 

```yaml
    strategy:
      matrix:
          node-version: [8.x, 10.x, 12.x, 13.x]
    steps:
        - name: 'Create a file'
          run: echo ${{ matrix.node-version }} > my_file.txt
        - name: 'Accidently upload to the same artifact via multiple jobs'
          uses: 'actions/upload-artifact@v2'
          with:
              name: my-artifact
              path: ${{ github.workspace }}
```

In the above example, four jobs will upload four different files to the same artifact but there will only be one file available when `my-artifact` is downloaded. Each job overwrites what was previously uploaded. To ensure that jobs don't overwrite existing artifacts, use a different name per job.

```yaml
          uses: 'actions/upload-artifact@v2'
          with:
              name: my-artifact ${{ matrix.node-version }}
              path: ${{ github.workspace }}
```

### Environment Variables and Tilde Expansion

You can use `~` in the path input as a substitute for `$HOME`. Basic tilde expansion is supported.

```yaml
  - run: |	
      mkdir -p ~/new/artifact
      echo hello > ~/new/artifact/world.txt
  - uses: actions/upload-artifact@v2
    with:	
      name: 'Artifacts-V2'	
      path: '~/new/**/*'
```

Environment variables along with context expressions can also be used for input. For documentation see [context and expression syntax](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions).

```yaml
    env:
      name: my-artifact
    steps:
    - run: |	
        mkdir -p ${{ github.workspace }}/artifact
        echo hello > ${{ github.workspace }}/artifact/world.txt
    - uses: actions/upload-artifact@v2
      with:	
        name: ${{ env.name }}-name	
        path: ${{ github.workspace }}/artifact/**/*
```

## Where does the upload go?
In the top right corner of a workflow run, once the run is over, if you used this action, there will be a `Artifacts` dropdown which you can download items from. Here's a screenshot of what it looks like<br/>
<img src="https://user-images.githubusercontent.com/16109154/72556687-20235a80-386d-11ea-9e2a-b534faa77083.png" width="375" height="140">

There is a trashcan icon that can be used to delete the artifact. This icon will only appear for users who have write permissions to the repository. 

## Additional Documentation

See [persisting workflow data using artifacts](https://help.github.com/en/actions/configuring-and-managing-workflows/persisting-workflow-data-using-artifacts) for additional examples and tips.

See extra documentation for the [@actions/artifact](https://github.com/actions/toolkit/blob/master/packages/artifact/docs/additional-information.md) package that is used internally regarding certain behaviors and limitations.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
