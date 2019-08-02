# upload-artifact

This uploads artifacts from your workflow.

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@master

- run: mkdir -p path/to/artifact

- run: echo hello > path/to/artifact/world.txt

- uses: actions/upload-artifact@master
  with:
    name: my-artifact
    path: path/to/artifact
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
