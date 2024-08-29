# Migration

- [Migration](#migration)
  - [Multiple uploads to the same named Artifact](#multiple-uploads-to-the-same-named-artifact)
  - [Overwriting an Artifact](#overwriting-an-artifact)
  - [Merging multiple artifacts](#merging-multiple-artifacts)
  - [Hidden files](#hidden-files)

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
          name: my-artifact
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
-       name: my-artifact
        path: my-artifact
+       pattern: my-artifact-*
+       merge-multiple: true
    - run: ls -R my-artifact
```

In `v4`, the new `pattern:` input will filter the downloaded Artifacts to match the name specified. The new `merge-multiple:` input will support downloading multiple Artifacts to the same directory. If the files within the Artifacts have the same name, the last writer wins.

## Overwriting an Artifact

In `v3`, the contents of an Artifact were mutable so something like the following was possible:

```yaml
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Create a file
        run: echo "hello world" > my-file.txt
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: my-artifact # NOTE: same artifact name
          path: my-file.txt
  upload-again:
    needs: upload
    runs-on: ubuntu-latest
    steps:
      - name: Create a different file
        run: echo "goodbye world" > my-file.txt
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: my-artifact # NOTE: same artifact name
          path: my-file.txt
```

The resulting `my-file.txt` in `my-artifact` will have "goodbye world" as the content.

In `v4`, Artifacts are immutable unless deleted. To achieve this same behavior, you can use `overwrite: true` to delete the Artifact before a new one is created:

```diff
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Create a file
        run: echo "hello world" > my-file.txt
      - name: Upload Artifact
-       uses: actions/upload-artifact@v3
+       uses: actions/upload-artifact@v4
        with:
          name: my-artifact # NOTE: same artifact name
          path: my-file.txt
  upload-again:
    needs: upload
    runs-on: ubuntu-latest
    steps:
      - name: Create a different file
        run: echo "goodbye world" > my-file.txt
      - name: Upload Artifact
-       uses: actions/upload-artifact@v3
+       uses: actions/upload-artifact@v4
        with:
          name: my-artifact # NOTE: same artifact name
          path: my-file.txt
+         overwrite: true
```

Note that this will create an _entirely_ new Artifact, with a different ID from the previous.

## Merging multiple artifacts

In `v3`, multiple uploads from multiple jobs could be done to the same Artifact. This would result in a single archive, which could be useful for sending to upstream systems outside of Actions via API or UI downloads.

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
          name: all-my-files # NOTE: same artifact name
          path: file-${{ matrix.runs-on }}.txt
```

The single `all-my-files` artifact would contain the following:

```
.
  ∟ file-ubuntu-latest.txt
  ∟ file-macos-latest.txt
  ∟ file-windows-latest.txt
```

To achieve the same in `v4` you can change it like so:

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
-       uses: actions/upload-artifact@v3
+       uses: actions/upload-artifact@v4
        with:
-         name: all-my-files
+         name: my-artifact-${{ matrix.runs-on }}
          path: file-${{ matrix.runs-on }}.txt
+  merge:
+    runs-on: ubuntu-latest
+    needs: upload
+    steps:
+      - name: Merge Artifacts
+        uses: actions/upload-artifact/merge@v4
+        with:
+          name: all-my-files
+          pattern: my-artifact-*
```

Note that this will download all artifacts to a temporary directory and reupload them as a single artifact. For more information on inputs and other use cases for `actions/upload-artifact/merge@v4`, see [the action documentation](../merge/README.md).

## Hidden Files

By default, hidden files are ignored by this action to avoid unintentionally uploading sensitive
information.

In versions of this action before v4.4.0, these hidden files were included by default.

If you need to upload hidden files, you can use the `include-hidden-files` input.

```yaml
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Create a Hidden File
        run: echo "hello from a hidden file" > .hidden-file.txt
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          path: .hidden-file.txt
```


```diff
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Create a Hidden File
        run: echo "hello from a hidden file" > .hidden-file.txt
      - name: Upload Artifact
-       uses: actions/upload-artifact@v3
+       uses: actions/upload-artifact@v4
        with:
          path: .hidden-file.txt
+         include-hidden-files: true
```