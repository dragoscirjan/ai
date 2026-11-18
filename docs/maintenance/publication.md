# Publish documentation through a destination PR

Every push to source `main` runs the documentation workflow. After checks pass, it uploads a site artifact and opens a separate PR in `dragoscirjan/dragoscirjan.github.io` when the output differs from destination `main`. There is no publish argument. The source workflow does not deploy Pages or merge pull requests. An owner must review and merge the destination PR before the destination's existing Pages workflow can publish it.

## URL paths

| Use                                               | Base                   |
| ------------------------------------------------- | ---------------------- |
| Independent development, build, or preview        | `/`                    |
| Documentation hosted beside the existing projects | `/projects/ai-skills/` |

`DOCS_BASE` selects the build/preview base. The destination stores this site under `projects/ai-skills/` and copies project documentation into its Hugo output under `/projects/`. The destination owns its domain and Pages deployment. Do not publish a `/` build under a subpath or assume a future source-repository rename changes these routes.

## Build the artifact only

For an artifact without a destination PR, choose **Actions → Documentation artifact and destination PR → Run workflow** and select a branch other than `main`. Manual runs on `main` also prepare a destination PR.

The workflow uses the tracked mise/pnpm locks, checks the documentation and dependency audit, builds with `DOCS_BASE=/projects/ai-skills/`, and uploads `docs/.vitepress/dist/` as the `docs-site` artifact. It does not need a destination token for this mode and has read-only source permissions.

For an independent local build, use `mise run docs` with `DOCS_BASE` unset instead. Preview each build with the same base used to create it.

## Prepare a publication PR

Publication runs after a push to trusted `main` or a manual rerun on `main`. Before merging a source change that will publish:

1. Review the source change and intended destination.
2. Confirm that the repository secret `GH_TOKEN` has been supplied by the owner. Do not put its value in files, logs, commands, artifacts, or model prompts.
3. Use a least-privilege token that can write contents and create PRs in the destination repository. The artifact download uses the caller's short-lived `GITHUB_TOKEN` with `actions: read`, including for private callers; this workflow does not need to grant the destination PAT access to the source repository. The caller's ordinary `GITHUB_TOKEN` cannot write into another repository.

A push to `main` starts the workflow automatically. To retry without a new push, choose **Run workflow** on `main`, or run this command from an authenticated GitHub CLI session:

```sh
gh workflow run docs.publish.yml --repo dragoscirjan/ai --ref main
```

The run uploads `docs-site` after the build passes. The dependent publication job then opens a destination PR if the generated output changed.

The publication job verifies the built site, uses a fresh destination checkout, replaces only `projects/ai-skills/`, and pushes a new `docs-publish/ai-skills/<run>-<attempt>` branch. If the output is unchanged, it makes no publication commit or PR. It does not run incoming project code inside the Hugo repository.

A changed artifact produces a destination PR. Review that PR separately. The source workflow never calls `gh pr merge`, never writes directly to destination `main`, and never triggers Pages manually. Do not copy the auto-merge behavior of the older project publishers into this workflow.

## Resolve a failed or stopped run

- **Wrong branch or event:** publish through a push or manual dispatch on `main`. Other branches can build an artifact but cannot publish. Pull-request events cannot publish.
- **Missing token or permissions:** ask the owner to configure the secret or narrow missing access. Artifact-only mode remains usable without it.
- **Dependency audit failure:** inspect the advisory and fix the dependency. Do not bypass the audit. See [the local picomatch mitigation](#maintain-the-picomatch-mitigation) for its scoped exception.
- **Malformed base, missing page, symlink, diagram hash mismatch, or missing notice:** fix and validate the source artifact. Do not bypass verification or manually patch the destination output.
- **Changed destination or dirty checkout:** stop and inspect the target. Do not force-push, reset user work, or broaden the writable directory.
- **Unchanged output:** no PR is needed.
- **Open destination PR:** wait for owner review and a separate merge decision. A successful build or mergeable PR is not merge authority.

## Maintain the picomatch mitigation

The pinned `picomatch@4.0.7` has a local guard for [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf). Its patch treats repeated extglobs containing wildcard stars as literal text, including `+(*)` and `+(*a)`, rather than emitting nested unbounded quantifiers. Ordinary globs and safe repeated extglobs remain supported.

The owner-approved audit exception covers only this advisory, because the installed version still reports `4.0.7`. Documentation checks test the installed Vite matcher, bounded adversarial inputs, and the patched lockfile before the audit runs. Other advisories remain blocking.

When a verified upstream fix is released, upgrade the dependency, remove the local patch and exception, and update the regression tests in the same change.

No secrets, destination changes, workflow dispatch, merge, release, or live deployment are required to inspect or validate this site locally.
