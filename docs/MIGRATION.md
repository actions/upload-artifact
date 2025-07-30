# Migration

- [Migration](#migration)
  - [Multiple uploads to the same named Artifact](#multiple-uploads-to-the-same-named-artifact)

Several behavioral differences exist between Artifact actions `v3` and below vs `v4`. This document outlines common scenarios in `v3`, and how they would be handled in `v4`.

## Multiple uploads to the same named Artifact

In `v3`, Artifacts are _mutable_ so it's possible to write workflow scenarios where multiple jobs upload to the same Artifact like so:

```yaml
jobs:
  upload:
    strategy:
      matrix:
        runs-on: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.runs-on }}
    steps:
      - name: Create a File
        run: echo "hello from ${{ matrix.runs-on }}" > file-${{ matrix.runs-on }}.txt
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: my-artifact # NOTE: same artifact name
          path: file-${{ matrix.runs-on }}.txt
  download:
    needs: upload
    runs-on: ubuntu-latest
    steps:
      - name: Download All Artifacts
        uses: actions/download-artifact@v3
        with:
          path: my-artifact
      - run: ls -R my-artifact
```

This results in a directory like so:

```
my-artifact/
  file-macos-latest.txt
  file-ubuntu-latest.txt
  file-windows-latest.txt
```

In v4, Artifacts are immutable (unless deleted). So you must change each of the uploaded Artifacts to have a different name and filter the downloads by name to achieve the same effect:

```diff
jobs:
  upload:
    strategy:
      matrix:
        runs-on: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.runs-on }}
    steps:
    - name: Create a File
      run: echo "hello from ${{ matrix.runs-on }}" > file-${{ matrix.runs-on }}.txt
    - name: Upload Artifact
-     uses: actions/upload-artifact@v3
+     uses: actions/upload-artifact@v4
      with:
-       name: my-artifact
+       name: my-artifact-${{ matrix.runs-on }}
        path: file-${{ matrix.runs-on }}.txt
  download:
    needs: upload
    runs-on: ubuntu-latest
    steps:
    - name: Download All Artifacts
-     uses: actions/download-artifact@v3
+     uses: actions/download-artifact@v4
      with:
        path: my-artifact
+       pattern: my-artifact-*
+       merge-multiple: true
    - run: ls -R my-artifact
```

In `v4`, the new `pattern:` input will filter the downloaded Artifacts to match the name specified. The new `merge-multiple:` input will support downloading multiple Artifacts to the same directory. If the files within the Artifacts have the same name, the last writer wins.
