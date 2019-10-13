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

- uses: actions/upload-artifact@master
  with:
    name: my-artifact
    path: path/to/artifact
```

To upload artifacts only when the previous step of a job failed, use [`if: failure()`](https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#job-status-check-functions):

```yaml
- uses: actions/upload-artifact@master
  if: failure()
  with:
    name: my-artifact
    path: path/to/artifact
```


## Where does the upload go?
In the top right corner of a workflow run, once the run is over, if you used this action, there will be a `Artifacts` dropdown which you can download items from. Here's a screenshot of what it looks like<br/>
![Artifacts Screenshot](https://user-images.githubusercontent.com/3685876/62906968-1b4aff80-bd3f-11e9-8815-9058eb05692a.png)


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
