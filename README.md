# upload-artifact

This uploads artifacts from your workflow.

See also [download-artifact](https://github.com/actions/download-artifact).

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@v1

- run: mkdir -p path/to/artifact

- run: echo hello > path/to/artifact/world.txt

- uses: actions/upload-artifact@v1
  with:
    name: my-artifact
    path: path/to/artifact
```

To upload artifacts only when the previous step of a job failed, use [`if: failure()`](https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#job-status-check-functions):

```yaml
- uses: actions/upload-artifact@v1
  if: failure()
  with:
    name: my-artifact
    path: path/to/artifact
```


## Where does the upload go?
In the top right corner of a workflow run, once the run is over, if you used this action, there will be a `Artifacts` dropdown which you can download items from. Here's a screenshot of what it looks like<br/>
<img src="https://user-images.githubusercontent.com/16109154/72556687-20235a80-386d-11ea-9e2a-b534faa77083.png" width="375" height="140">

There is a trashcan icon that can be used to delete the artifact. This icon will only appear for users who have write permissions to the repository. 


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
