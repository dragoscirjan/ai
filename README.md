# AI agent assets

This repository contains reusable skills, instructions, configuration assets, and references for AI coding agents. The assets target Pi, OpenCode, and Claude Code, while portable skills follow the Agent Skills format.

## Skills

| Skill | Purpose |
|---|---|
| [`cleanup-workspaces`](.agents/skills/cleanup-workspaces/SKILL.md) | Plan and safely remove integrated Git/Jujutsu workspaces and stale registrations. |
| [`asd-ste100-technical`](.agents/skills/asd-ste100-technical/SKILL.md) | Apply ASD-STE100-inspired plain language to developer-facing prose without losing technical precision. |
| [`code-review`](.agents/skills/code-review/SKILL.md) | Review a diff against repository standards and its originating issue or specification with separate read-only subagents. |
| [`coding`](.agents/skills/coding/SKILL.md) | Apply project-first design, security, testing, and quality gates to code changes in any language. |
| [`debloat`](.agents/skills/debloat/SKILL.md) | Prevent overengineering and simplify existing mechanisms with evidence while preserving required behavior and boundaries. |
| [`coding-with-rules`](.agents/skills/coding-with-rules/SKILL.md) | Combine the `coding` workflow with on-demand language and extension reference files. |
| [`init-gdscript`](.agents/skills/init-gdscript/SKILL.md) | Initialize Godot and GDScript tooling, validation, tests, and mise tasks. |
| [`init-project`](.agents/skills/init-project/SKILL.md) | Initialize mise, Node, pnpm, Tempel validation, Husky hooks, and stable project tasks. |
| [`init-typescript`](.agents/skills/init-typescript/SKILL.md) | Initialize project-owned TypeScript configuration, validation, tests, builds, and mise tasks. |
| [`grill-me`](.agents/skills/grill-me/SKILL.md) | Start an explicit grilling interview. |
| [`grilling`](.agents/skills/grilling/SKILL.md) | Interview a user until a plan or decision has no unresolved branches. |
| [`wait-what`](.agents/skills/wait-what/SKILL.md) | Ask the agent to re-pitch its last response with missing context and simpler language. |
| [`isolated-workspace`](.agents/skills/isolated-workspace/SKILL.md) | Create or reuse a protected change workspace before repository mutation. |
| [`instruction-maintenance`](.agents/skills/instruction-maintenance/SKILL.md) | Diagnose instruction drift, propose an exact adaptation, and wait for human approval before mutation. |
| [`scaffold`](.agents/skills/scaffold/SKILL.md) | Create reviewable source skeleton files with fail-fast placeholders and stop before implementing behavior. |
| [`subagent-orchestration`](.agents/skills/subagent-orchestration/SKILL.md) | Bound child-agent workers and reviewers, coordinate isolated write lanes, and clean integrated temporary lanes. |
| [`systematic-debugging`](.agents/skills/systematic-debugging/SKILL.md) | Diagnose failures through evidence, root-cause tracing, controlled experiments, and project-owned verification. |
| [`sync-agent-assets`](.agents/skills/sync-agent-assets/SKILL.md) | Initialize or update project instructions and skills with project detection, grilling, dependency closure, and conflict-safe managed state. |
| [`unslop`](.agents/skills/unslop/SKILL.md) | Remove common AI writing patterns from an existing draft. |

## Independent skills and compositions

Skills load other instructions only through declared requirements. Leaves normally omit them; `cleanup-workspaces` explicitly requires `isolated-workspace` as an owner-approved exception. Select combinations explicitly, or use a thin composition such as `grill-me`, which declares `require: ["grilling"]`. For code work, `coding-with-rules` declares `require: ["coding"]` and selects its own language and extension reference files on demand. The former language and extension skills are replaced by those plain documents; see the [migration guide](.agents/skills/coding-with-rules/README.md#migrate-existing-installations). Project instructions resolve requirements before applying the composition; its body defines the workflow.

`require` is a project extension, not a native harness loader or standard Agent Skills field. External Skills CLI commands do not automatically install its requirements. See [the declaration and compatibility contract](CONTRIBUTING.md#independent-skills-and-explicit-composition). Shared helper-code dependencies remain distinct.

## Use the skills

Pi and OpenCode discover project skills from `.agents/skills/`. Claude Code discovers the same canonical skills through relative links under `.claude/skills/` and loads the shared instruction graph through [`CLAUDE.md`](CLAUDE.md). Claude Code support requires a Git checkout that preserves symbolic links.

Install one skill into another project with the Skills CLI:

```sh
npx skills@1.7.4 add dragoscirjan/ai --skill isolated-workspace
```

Replace `isolated-workspace` with the required skill name. Review a skill and its supporting files before installing or trusting it.

Bootstrap or update a project without dirtying its primary checkout by generating a temporary `sync-agent-assets` prompt:

```sh
SYNC_AGENT_PROMPT="$(
  npx --yes skills@1.7.4 use dragoscirjan/ai@sync-agent-assets
)"
```

Skills CLI 1.7.4 cannot launch Pi or OpenCode with `skills use --agent`. Start the required harness from the target repository.

For Pi:

```sh
pi "$SYNC_AGENT_PROMPT

User request: Initialize or update agent assets in this repository."
```

For OpenCode:

```sh
opencode --prompt "$SYNC_AGENT_PROMPT

User request: Initialize or update agent assets in this repository."
```

Skills CLI 1.7.4 supports Claude Code directly:

```sh
npx --yes skills@1.7.4 use dragoscirjan/ai@sync-agent-assets --agent claude-code
```

The generated prompt names a temporary supporting-files directory. Keep it until the session exits, then remove it. The workflow creates an approved isolated workspace, installs complete selected assets under `.agents/skills/`, exposes them to Claude Code with relative `.claude/skills/` symlinks, and records reproducible synchronization state.

## Releases

After this workflow is merged, open **Actions → Version and release → Run workflow** on `main`. Choose `patch` (default), `minor`, or `major`. You can also trigger it with:

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

- [`.agents/skills/`](.agents/skills/) contains portable Agent Skills.
- [`AGENTS.md`](AGENTS.md) contains the small startup routing and safety contract for coding agents.
- [`CLAUDE.md`](CLAUDE.md) imports `AGENTS.md` for Claude Code.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) contains contribution policy loaded before actionable change planning.
- [`VALIDATION.md`](VALIDATION.md) contains checks loaded before validation or publication.
- [`RESOURCES.md`](RESOURCES.md) contains the curated list of external tools and references.

## Contribute

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before planning a repository change. Run the applicable checks in [`VALIDATION.md`](VALIDATION.md) before publishing it.

Do not merge or release without explicit owner instruction.
