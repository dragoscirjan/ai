# AI agent assets

This repository contains reusable skills, instructions, configuration assets, and references for AI agents in coding and non-coding projects. The assets target Pi, OpenCode, and Claude Code, while portable skills follow the Agent Skills format.

## Synchronize skills

The Node.js CLI installs skills. The separate `sync-my-agents` skill maintains project instructions. Neither operation launches the other.

The root `package.json` maps the `sync-skills` executable to [`scripts/skills/sync.mjs`](scripts/skills/sync.mjs). It reads the [shared catalog](catalog/skill-catalog.yaml) and runs its pinned Skills CLI commands. Node.js 24, npm/npx, and Git are required.

Run directly from a reviewed GitHub ref containing this implementation, without npm registry publication. Replace `<tag-or-commit>` with that ref:

```sh
npx -y github:dragoscirjan/ai#<tag-or-commit> --help
npx -y github:dragoscirjan/ai#<tag-or-commit> --skill coding-with-rules --agent pi --target . --dry-run
```

These changes must be published before a GitHub ref can run them. From a trusted checkout with its approved dependencies already available, use `node scripts/skills/sync.mjs` instead of the GitHub invocation.

Review the preview, then repeat without `--dry-run` to confirm interactively, or add `--yes` for an explicitly approved noninteractive run. In a terminal, Inquirer offers categories, a skill checklist for each chosen category, and agents. Every skill starts selected. Press A to toggle all, Space to toggle one, and Enter to accept; clear a checklist to skip that category. Required prerequisites still appear in the preview. Ctrl+C cancels a prompt without installing skills. Explicit `--yes`, JSON, and noninteractive category runs select all scoped members without opening skill checklists. Use `list` to see all six catalog categories. The CLI includes skill prerequisites, verifies output and legal files, filters unwanted metadata, and leaves project instructions and legacy locks unchanged.

Existing selected destinations require `--overwrite`. The catalog now provides reviewed local `code-review`, `grill-me`, and `tdd` variants; `writing-for-agents` uses its unchanged pinned upstream source. Synchronization copies prepared files and needs no LLM, model API key, or generated instruction rewrite. Future unprepared adaptations remain blocked until reviewed sources are published. See [installation and update instructions](docs/guide/install.md) for scope, conflicts, and recovery.

### Custom skills directory

To populate an existing Claude plugin without creating normal agent directories, point `--target` at the plugin root and use `--skills-dir skills`:

```sh
npx -y github:dragoscirjan/ai#<tag-or-commit> \
  --target ./my-plugin --skills-dir skills --agent claude-code --dry-run
```

After confirmation, selected skills go directly into `my-plugin/skills/<name>/SKILL.md`, with supporting and legal files. The script verifies sources in a disposable workspace before copying them. It does not edit `.claude-plugin/plugin.json`, register the plugin, or add `.agents`/`.claude` directories to it.

Relative output paths are resolved under `--target`; absolute output paths must also remain inside that project. Existing selected skill folders still need `--overwrite`. See [custom output and plugin packaging](docs/guide/install.md#copy-skills-into-a-plugin-or-custom-directory).

## Maintain agent instructions

Invoke [`sync-my-agents`](.agents/skills/agentic-work/sync-my-agents/SKILL.md) explicitly to review `AGENTS.md` and the instruction documents it references, such as `CONTRIBUTING.md` and `VALIDATION.md`. It gathers evidence, asks about unresolved decisions, shows exact diffs, and applies only approved changes.

Here, dependencies mean instruction documents, not skill prerequisites. The skill never installs skills or imposes a fixed document bundle. See its [setup and review guide](.agents/skills/agentic-work/sync-my-agents/README.md).

The combined `sync-my-skills` manager is removed. Existing installations, personal command registrations, and legacy locks in other projects are not migrated or deleted automatically. The agreed split is tracked in [issue #95](https://github.com/dragoscirjan/ai/issues/95); merged [PR #96](https://github.com/dragoscirjan/ai/pull/96) describes the earlier implementation.

## Use a skill today

Individual skills remain available independently of the planned synchronization tools. Browse the [skill catalog](docs/reference/catalog.md), [workflow guides](docs/guide/start.md), or [skill requirements](docs/reference/relationships.md).

Review a skill and its supporting files before installing it. With Node.js and npm/npx available, run an explicit installation command from the destination project's root. For example:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/utility/isolated-workspace --skill isolated-workspace
```

The Skills CLI acquires the named skill and offers its installation choices. Inspect the selected destination before invoking the skill. This example follows `main`; use a reviewed commit or tag when you need a fixed source.

Some skills declare instruction requirements through the project's `requires` convention. The external Skills CLI does not automatically install these requirements or apply the catalog's filtering rules. Install and review missing requirements separately before invoking a skill that needs them. See the [dependency contract](CONTRIBUTING.md#independent-skills-and-explicit-composition).

Source skills are grouped under `.agents/skills/<category>/<name>/`. Project installations use flat skill names rather than category namespaces. Upstream-only skills come from their catalogued repositories, not nonexistent source directories here.

## Find a workflow

Start at the point that matches your task. You do not need to run every skill.

- Use `research` to investigate missing facts or compare options.
- Use `initiative` and `specify` to agree on outcomes and expected behavior.
- Use `plan-tasks` when the work needs to be divided into bounded tasks.
- Use `coding-with-rules` for implementation under the relevant language rules. Select `tdd` separately when a test-first workflow is wanted.
- Use `systematic-debugging` to investigate failures before proposing a fix.
- Use `document-project`, `asd-ste100-technical`, and `unslop` for affected documentation.
- Use `code-review` and `retro` for review and process improvements when selected.

The [workflow guides](docs/guide/start.md) explain handoffs, shorter paths, and rework. The [relationship reference](docs/reference/relationships.md) distinguishes instruction dependencies from execution order. A documented handoff does not authorize the next step automatically.

## Documentation and local development

Start with the [documentation overview](docs/index.md), [first-use guide](docs/guide/first-use.md), or [site maintenance instructions](docs/maintenance/index.md).

For authoring this repository, use Node.js 24 and npm/npx. After reviewing the project configuration and completing the [project-scoped mise setup](docs/maintenance/index.md), run these commands from the repository root:

```sh
mise run deps:sync
mise run docs:serve
```

The first command synchronizes development dependencies. The second starts the local VitePress site and prints its address. Use `mise run docs:check` for documentation checks and `mise run docs` for a production build.

Optional authoring skills have a separate [Bash installer](scripts/install-dev-skills.sh). Review it and its external sources before running it with Bash 4 or newer. It installs authoring dependencies into this checkout's ignored `.agents/skills/external/<name>/` directory. It is not the proposed cross-project Node.js CLI and does not synchronize instructions. See [authoring dependency setup](docs/maintenance/authoring-skills.md).

See [diagram maintenance](docs/maintenance/diagrams.md) and [documentation publication](docs/maintenance/publication.md) for their separate procedures. Hosted documentation uses `DOCS_BASE=/projects/ai-skills/`; local builds use `/`. Pushes to `main` can open a documentation destination PR, but do not merge or deploy it.

## Releases

With explicit owner approval to release, open **Actions → Version and release → Run workflow** on `main`. Choose `patch` (default), `minor`, or `major`. You can also trigger it with:

```sh
gh workflow run version.yml --ref main -f bump=patch
```

The workflow uses the highest stable `vX.Y.Z` Git tag as the current version. With no matching tags, the baseline is `0.0.0`, so the first patch release is **`v0.0.1`**. Minor and major bumps reset lower components. Unrelated tags, prereleases, and build-metadata tags are ignored. Versions belong to the repository as a whole, not individual skills; no version files or bump commits are needed.

A manual run tests the release tooling, creates a tag at the exact selected `main` commit, and immediately publishes a GitHub release with generated notes and `ai-vX.Y.Z.zip`. The ZIP contains Git-tracked files, including hidden skill directories and supporting files, under `ai-vX.Y.Z/`; it excludes untracked files and Git metadata. Relative Claude skill symlinks are preserved, so use an extractor that supports symlinks or a Git checkout when needed.

PRs and pushes affecting release tooling run its tests but never publish. Release jobs are serialized; concurrent pending runs may be superseded by GitHub, so do not queue multiple intended releases at once. If `main` advanced before the release checkout, the run stops; trigger a new run for the current commit. The workflow uses runner-provided Python 3.10+, Git, and GitHub CLI, plus the built-in `GITHUB_TOKEN` with `contents: write` only for the release job. No custom token, npm publishing, or Changesets setup is required. Repository or organization rules must permit tag creation and releases.

### Recover a retained tag

If publishing fails after tag creation, do not start a normal version run to repair it: that would select the next version. Recover the original tag instead. From a clone of this repository, fetch the retained tag without force and inspect its commit. Replace `v0.0.1` throughout these examples with the failed release's tag:

```sh
git fetch --no-tags origin refs/tags/v0.0.1:refs/tags/v0.0.1
git show --no-patch --format=fuller refs/tags/v0.0.1
```

Stop if the fetch fails, the commit is not the intended release, or the release is already published. If no release exists, rebuild its ZIP from that tag and create the missing release:

```sh
archive_dir="$(mktemp -d)" &&
git archive --format=zip --prefix=ai-v0.0.1/ \
  --output="${archive_dir}/ai-v0.0.1.zip" refs/tags/v0.0.1 &&
gh release create v0.0.1 "${archive_dir}/ai-v0.0.1.zip" \
  --repo dragoscirjan/ai --verify-tag --title v0.0.1 --generate-notes --latest=false
```

`--verify-tag` requires the retained remote tag; creating a release fails if a release already exists. No tag is moved or replaced. `--latest=false` avoids promoting an older recovered release over a newer release. If a partial draft already exists, inspect it, add any missing ZIP in GitHub's UI, and publish that same draft only after checking its tag and assets. Do not delete or overwrite an existing release or asset to recover.

### Preview the next version

The [version calculator](.github/scripts/release_version.py) is read-only and uses only tags already present in the local clone; it does not fetch tags or reserve a version. Compare local tags with this repository's remote tags before relying on its output, fetching with `git fetch --tags origin` when appropriate. Missing local tags or a later release can change the result. The workflow fetches all tags before calculating its version.

To check locally without creating a release:

```sh
python3 -B .github/scripts/release_version.py --bump patch
python3 -B -m unittest discover -s .github/scripts -p 'test_*.py' -v
```

## Repository map

- [`.agents/skills/`](.agents/skills/) contains categorized skill sources.
- [`docs/`](docs/index.md) contains task guides, catalog references, and maintenance instructions.
- [`templates/`](templates/README.md) contains reusable project instruction templates and their population contract.
- [`AGENTS.md`](AGENTS.md) contains the small startup routing and safety contract for agents.
- [`CLAUDE.md`](CLAUDE.md) imports `AGENTS.md` for Claude Code.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) contains contribution policy loaded before actionable change planning.
- [`VALIDATION.md`](VALIDATION.md) contains checks loaded before validation or publication.
- [`RESOURCES.md`](RESOURCES.md) contains the curated list of external tools and references.

## Contribute

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before planning a repository change. Run the applicable checks in [`VALIDATION.md`](VALIDATION.md) before publishing it.

Do not merge or release without explicit owner instruction.
