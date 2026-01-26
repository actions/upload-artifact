# `@actions/upload-artifact/merge`

Merge multiple [Actions Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts) in Workflow Runs. Internally powered by [@actions/artifact](https://github.com/actions/toolkit/tree/main/packages/artifact) package.

- [`@actions/upload-artifact/merge`](#actionsupload-artifactmerge)
  - [Usage](#usage)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
  - [Examples](#examples)
    - [Combining all artifacts in a workflow run](#combining-all-artifacts-in-a-workflow-run)
    - [Prefix directories in merged artifact](#prefix-directories-in-merged-artifact)
    - [Deleting artifacts after merge](#deleting-artifacts-after-merge)
    - [Retention and Compression Level](#retention-and-compression-level)

## Usage

> [!IMPORTANT]
> upload-artifact/merge@v4+ is not currently supported on GHES.

Note: this actions can only merge artifacts created with actions/upload-artifact@v4+

This sub-action is a helper to merge multiple artifacts after they are created. To do so, it will download multiple artifacts to a temporary directory and reupload them as a single artifact.

For most cases, this may not be the most efficient solution. See [the migration docs](../docs/MIGRATION.md#multiple-uploads-to-the-same-named-artifact) on how to download multiple artifacts to the same directory on a runner. This action should only be necessary for cases where multiple artifacts will need to be downloaded outside the runner environment, like downloads via the UI or REST API.

### Inputs

```yaml
- uses: actions/upload-artifact/merge@v4
  with:
    # The name of the artifact that the artifacts will be merged into
    # Optional. Default is 'merged-artifacts'
    name:

    # A glob pattern matching the artifacts that should be merged.
    # Optional. Default is '*'
    pattern:

    # If true, the artifacts will be merged into separate directories.
    # If false, the artifacts will be merged into the root of the destination.
    # Optional. Default is 'false'
    separate-directories:

    # If true, the artifacts that were merged will be deleted.
    # If false, the artifacts will still exist.
    # Optional. Default is 'false'
    delete-merged:

    # Duration after which artifact will expire in days. 0 means using default retention.
    # Minimum 1 day.
    # Maximum 90 days unless changed from the repository settings page.
    # Optional. Defaults to repository settings.
    retention-days:

    # The level of compression for Zlib to be applied to the artifact archive.
    # The value can range from 0 to 9.
    # For large files that are not easily compressed, a value of 0 is recommended for significantly faster uploads.
    # Optional. Default is '6'
    compression-level:
```

### Outputs

| Name | Description | Example |
| - | - | - |
| `artifact-id` | GitHub ID of an Artifact, can be used by the REST API | `1234` |
| `artifact-url` | URL to download an Artifact. Can be used in many scenarios such as linking to artifacts in issues or pull requests. Users must be logged-in in order for this URL to work. This URL is valid as long as the artifact has not expired or the artifact, run or repository have not been deleted | `https://github.com/example-org/example-repo/actions/runs/1/artifacts/1234` |
| `artifact-digest` | SHA-256 digest of an Artifact | 0fde654d4c6e659b45783a725dc92f1bfb0baa6c2de64b34e814dc206ff4aaaf |

## Examples

For each of these examples, assume we have a prior job matrix that generates three artifacts: `my-artifact-a`, `my-artifact-b` and `my-artifact-c`.

e.g.

```yaml
jobs:
  upload:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        foo: [a, b, c]

    steps:
      - name: Run a one-line script
        run: echo "hello from job ${{ matrix.foo }}" > file-${{ matrix.foo }}.txt
      - name: Upload
        uses: actions/upload-artifact@v4
        with:
          name: my-artifact-${{ matrix.foo }}
          path: file-${{ matrix.foo }}.txt
```

Each of the following examples will use the `needs: upload` as a prerequesite before any merging operations.

### Combining all artifacts in a workflow run

By default (with no inputs), calling this action will take all the artifacts in the workflow run and combined them into a single artifact called `merged-artifacts`:

```yaml
jobs:
  # ... <upload job> ...
  merge:
    runs-on: ubuntu-latest
    needs: upload
    steps:
      - name: Merge Artifacts
        uses: actions/upload-artifact/merge@v4
```

This will result in an artifact called `merged-artifacts` with the following content:

```
.
  ∟ file-a.txt
  ∟ file-b.txt
  ∟ file-c.txt
```

To change the name of the artifact and filter on what artifacts are added, you can use the `name` and `pattern` inputs:

```yaml
jobs:
  # ... <upload job> ...
  merge:
    runs-on: ubuntu-latest
    needs: upload
    steps:
      - name: Merge Artifacts
        uses: actions/upload-artifact/merge@v4
        with:
          name: my-amazing-merged-artifact
          pattern: my-artifact-*
```

### Prefix directories in merged artifact

To prevent overwriting files in artifacts that may have the same name, you can use the `separate-directories` to prefix the extracted files with directories (named after the original artifact):

```yaml
jobs:
  # ... <upload job> ...
  merge:
    runs-on: ubuntu-latest
    needs: upload
    steps:
      - name: Merge Artifacts
        uses: actions/upload-artifact/merge@v4
        with:
          separate-directories: true
```

This will result in the following artifact structure:

```
.
  ∟ my-artifact-a
    ∟ file-a.txt
  ∟ my-artifact-b
    ∟ file-b.txt
  ∟ my-artifact-c
    ∟ file-c.txt
```

### Deleting artifacts after merge

After merge, the old artifacts may no longer be required. To automatically delete them after they are merged into a new artifact, you can use `delete-merged` like so:

```yaml
jobs:
  # ... <upload job> ...
  merge:
    runs-on: ubuntu-latest
    needs: upload
    steps:
      - name: Merge Artifacts
        uses: actions/upload-artifact/merge@v4
        with:
          delete-merged: true
```

After this runs, the matching artifact (`my-artifact-a`, `my-artifact-b` and `my-artifact-c`) will be merged.

### Retention and Compression Level

Similar to actions/upload-artifact, both [`retention-days`](../README.md#retention-period) and [`compression-level`](../README.md#altering-compressions-level-speed-v-size) are supported:

```yaml
jobs:
  # ... <upload job> ...
  merge:
    runs-on: ubuntu-latest
    needs: upload
    steps:
      - name: Merge Artifacts
        uses: actions/upload-artifact/merge@v4
        with:
          retention-days: 1
          compression-level: 9
```
