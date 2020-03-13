# Upload-Artifact v2 Preview

This uploads artifacts from your workflow allowing you to share data between jobs and store data once a workflow is complete.

See also [download-artifact](https://github.com/actions/download-artifact).

# Usage

See [action.yml](action.yml)

### Upload an Individual File
```yaml
steps:
- uses: actions/checkout@v2

- run: mkdir -p path/to/artifact

- run: echo hello > path/to/artifact/world.txt

- uses: actions/upload-artifact@v2-preview
  with:
    name: my-artifact
    path: path/to/artifact/world.txt
```

### Upload an Entire Directory

```yaml
- uses: actions/upload-artifact@v2-preview
  with:
    name: my-artifact
    path: path/to/artifact/ # or path/to/artifact
```

### Upload using a Wildcard Pattern:
```yaml
- uses: actions/upload-artifact@v2-preview
  with:
    name: my-artifact
    path: path/**/[abc]rtifac?/*
```

For supported wildcards along with behavior and documentation, see [@actions/glob](https://github.com/actions/toolkit/tree/master/packages/glob) which is used internally to search for files.

Relative and absolute file paths are both allowed. Relative paths are rooted against the current working directory.

### Conditional Artifact Upload

To upload artifacts only when the previous step of a job failed, use [`if: failure()`](https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#job-status-check-functions):

```yaml
- uses: actions/upload-artifact@v2-preview
  if: failure()
  with:
    name: my-artifact
    path: path/to/artifact/
```

### Uploading without an artifact name

You can upload an artifact without specifying a name
```yaml
- uses: actions/upload-artifact@v2-preview
  with:
    path: path/to/artifact/world.txt
```

If not provided, `artifact` will be used as the default name which will manifest itself in the UI after upload.

### Uploading to the same artifact

Each artifact behaves as a file share. Uploading to the same artifact multiple times in the same workflow can overwrite and append already uploaded files

```yaml
- run: echo hi > world.txt
- uses: actions/upload-artifact@v2-preview
  with:
    path: world.txt

- run: echo howdy > extra-file.txt
- uses: actions/upload-artifact@v2-preview
  with:
    path: extra-file.txt

- run: echo hello > world.txt
- uses: actions/upload-artifact@v2-preview
  with:
    path: world.txt
```
With the following example, the available artifact (named `artifact`) would contain both `world.txt` (`hello`) and `extra-file.txt` (`howdy`).

## Where does the upload go?
In the top right corner of a workflow run, once the run is over, if you used this action, there will be a `Artifacts` dropdown which you can download items from. Here's a screenshot of what it looks like<br/>
<img src="https://user-images.githubusercontent.com/16109154/72556687-20235a80-386d-11ea-9e2a-b534faa77083.png" width="375" height="140">

There is a trash can icon that can be used to delete the artifact. This icon will only appear for users who have write permissions to the repository.

## Additional Documentation

See [persisting workflow data using artifacts](https://help.github.com/en/actions/configuring-and-managing-workflows/persisting-workflow-data-using-artifacts) for additional examples and tips. 


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
