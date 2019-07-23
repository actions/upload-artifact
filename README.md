# upload-artifact

This uploads artifacts from your build.

# Usage

See [action.yml](action.yml)

Basic (upload current working directory):
```yaml
actions:
- uses: actions/checkout@latest

# Do stuff

- uses: actions/upload-artifact@latest
  with:
    name: my-artifact
```

Upload specific directory:
```yaml
actions:
- uses: actions/checkout@latest

- run: mkdir -p path/to/artifact

- run: echo hello > path/to/artifact/world.txt

- uses: actions/upload-artifact@latest
  with:
    name: my-artifact
    path: path/to/artifact
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
