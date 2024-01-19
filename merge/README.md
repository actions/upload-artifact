# `@actions/upload-artifact/merge`

Merge multiple [Actions Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts) in Workflow Runs. Internally powered by [@actions/artifact](https://github.com/actions/toolkit/tree/main/packages/artifact) package.

- [`@actions/upload-artifact/merge`](#actionsupload-artifactmerge)
  - [Usage](#usage)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
  - [Examples](#examples)

## Usage

> [!IMPORTANT]
> upload-artifact/merge@v4+ is not currently supported on GHES.

Note: this actions can only merge artifacts created with actions/upload-artifact@v4+

### Inputs

```yaml
- uses: actions/upload-artifact/merge@v4
  with:
    # The name of the artifact that the artifacts will be merged into
    # Optional. Default is 'merged-artifact'
    into:

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

## Examples

TODO(robherley): add examples
