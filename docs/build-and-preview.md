# Build and preview a Jackal site

Call Jackal's [Jekyll build workflow](../.github/workflows/jekyll-build.yml) from the site repository.
Pin `REF` to a Jackal release or commit. The workflow uses Ruby 4.0 by default and builds
with the site's own Gemfile and lockfile, so each site can select the latest Jekyll and plugins
it supports. Set `ruby_version` if a site needs a different Ruby version.

## Build and publish

This example builds a site on pushes to its default branch, on PRs, and when dispatched
manually. The repository must have **Settings → Pages → Source** set to **GitHub Actions**
to publish. Set `url` to the site's domain and `baseurl` to the public path in the
site's Jekyll config. For example, ThemerrDB uses `url: https://themerr.lizardbyte.dev`
and `baseurl: /ThemerrDB`. Leave `baseurl` empty for a domain root.

```yaml
name: Website
permissions: {}

on:
  pull_request:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  site:
    uses: LizardByte/jackal/.github/workflows/jekyll-build.yml@REF
    permissions:
      contents: read
    with:
      upload_pages: true

  deploy:
    if: needs.site.outputs.pages_artifact != ''
    needs: site
    runs-on: ubuntu-latest
    permissions:
      actions: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy the built files
        id: deployment
        uses: actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346  # v5.0.1
        with:
          artifact_name: ${{ needs.site.outputs.pages_artifact }}
```

The workflow produces a Pages artifact only for pushes, scheduled runs, or manual
runs on the default branch, with `upload_pages: true`. Add a `schedule` trigger if the
site has a scheduled data update.

Set `source_dir` for a site located below the checkout root. Use `bundle_dir` if its
Gemfile is in a different directory. Optional `config_files` paths are relative to
the bundle directory and apply from left to right.

### Generated sites and catalogs

Have an earlier job build the project data and upload an Actions artifact. Set
`needs` to that job and pass its artifact name to `site_artifact`. The workflow
overlays the contents onto `source_dir` before Jekyll builds. For an artifact that
contains a single archive, set `extract_archive` to its filename. Supported
formats are ZIP, TAR, and compressed TAR (`.tar.gz` or `.tgz`). If the generator
checks out the repository on a PR, use `${{ github.event.pull_request.head.sha || github.sha }}`
as its checkout ref so its data comes from the same commit as the site.

## Preview a pull request

Open the CI run summary and copy the PowerShell or Bash/Zsh command. GitHub CLI
downloads the files built from the exact PR head commit and run attempt. Docker
serves those files through Nginx at `http://127.0.0.1:8080`. For projects with a
`baseurl`, the local root redirects to the same subpath used on Pages. Stop the
container with Ctrl+C. The downloaded files remain in the temporary directory
named by the command's `preview` variable. Artifacts are available for up to
14 days.

### Put the command on the PR

Add this second workflow to the site's default branch. Set `workflows` to the
first workflow's `name`. The reporter looks up the rendered artifact and
updates one comment on the matching PR. It uses the default-branch workflow,
including when the build came from a fork.

```yaml
name: Website preview comment
permissions: {}

on:
  workflow_run:
    workflows: [Website]
    types: [completed]

jobs:
  comment:
    if: github.event.workflow_run.event == 'pull_request' && github.event.workflow_run.conclusion == 'success'
    uses: LizardByte/jackal/.github/workflows/jekyll-preview-comment.yml@REF
    permissions:
      actions: read
      contents: read
      pull-requests: write
```

The build runs with read access. The comment job reads Actions metadata and
never downloads or executes the files being reviewed.
