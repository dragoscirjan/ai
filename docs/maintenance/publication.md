# Build an artifact or prepare a destination PR

The source workflow does not deploy Pages or merge pull requests. It builds an artifact by default. An explicitly requested publication opens a separate PR in `dragoscirjan/dragoscirjan.github.io`; an owner must review and merge that PR before the destination's existing Pages workflow can publish it.

## URL paths

| Use                                               | Base                   |
| ------------------------------------------------- | ---------------------- |
| Independent development, build, or preview        | `/`                    |
| Documentation hosted beside the existing projects | `/projects/ai-skills/` |

`DOCS_BASE` selects the build/preview base. The destination stores this site under `projects/ai-skills/` and copies project documentation into its Hugo output under `/projects/`. The destination owns its domain and Pages deployment. Do not publish a `/` build under a subpath or assume a future source-repository rename changes these routes.

## Build the artifact only

After the source workflow exists on the appropriate branch, choose **Actions → Documentation artifact and destination PR → Run workflow**. Leave **publish** unchecked.

The workflow uses the tracked mise/pnpm locks, checks the documentation and dependency audit, builds with `DOCS_BASE=/projects/ai-skills/`, and uploads `docs/.vitepress/dist/` as the `docs-site` artifact. It does not need a destination token for this mode and has read-only source permissions.

For an independent local build, use `mise run docs` with `DOCS_BASE` unset instead. Preview each build with the same base used to create it.

## Prepare a publication PR

This mode is available only through an explicit manual dispatch on the trusted `main` branch. Before running it:

1. Review the source change, checks, output, and intended destination.
2. Confirm that the repository secret `GH_TOKEN` has been supplied by the owner. Do not put its value in files, logs, commands, artifacts, or model prompts.
3. Use a least-privilege token that can write contents and create PRs in the destination repository. The artifact download uses the caller's short-lived `GITHUB_TOKEN` with `actions: read`, including for private callers; this workflow does not need to grant the destination PAT access to the source repository. The caller's ordinary `GITHUB_TOKEN` cannot write into another repository.
4. Run the workflow on `main` with **publish** checked.

The publication job verifies the built site, uses a fresh destination checkout, replaces only `projects/ai-skills/`, and pushes a new `docs-publish/ai-skills/<run>-<attempt>` branch. If the output is unchanged, it makes no publication commit or PR. It does not run incoming project code inside the Hugo repository.

A changed artifact produces a destination PR. Review that PR separately. The source workflow never calls `gh pr merge`, never writes directly to destination `main`, and never triggers Pages manually. Do not copy the auto-merge behavior of the older project publishers into this workflow.

## Resolve a failed or stopped run

- **Wrong branch or event:** use the approved manual `main` dispatch. Do not remove the guard.
- **Missing token or permissions:** ask the owner to configure the secret or narrow missing access. Artifact-only mode remains usable without it.
- **Malformed base, missing page, symlink, diagram hash mismatch, or missing notice:** fix and validate the source artifact. Do not bypass verification or manually patch the destination output.
- **Changed destination or dirty checkout:** stop and inspect the target. Do not force-push, reset user work, or broaden the writable directory.
- **Unchanged output:** no PR is needed.
- **Open destination PR:** wait for owner review and a separate merge decision. A successful build or mergeable PR is not merge authority.

No secrets, destination changes, workflow dispatch, merge, release, or live deployment are required to inspect or validate this site locally.
