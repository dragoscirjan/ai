# Sync skills in a project

Use `/sync-my-skills` to inspect a project, choose skills, and approve their installation or update. Install the manager once in your personal agent configuration. The projects you work on receive only the skills you select.

The command leaves project root documents unchanged. It does not create a documentation site, run an initializer, commit project changes, or delete deprecated skills without your choice.

## Before you start

For the steps below, you need:

- A trusted checkout containing this manager in its committed Git tree. A checkout that still contains only `sync-agent-assets` is too old.
- Node.js 22.20 or newer, Git with worktree support, and npm/npx.
- A POSIX shell and `tar` for the clean-export commands. These commands were checked on Linux. Other shells need equivalent commands.
- A working Pi installation for the recommended walkthrough. OpenCode and Claude Code are supported alternatives described below.
- Permission to install the pinned Skills CLI and parser dependency. Public-source acquisition needs network access but no GitHub credentials.
- A trusted project with at least one Git commit. Before project writes, the agent must establish an approved isolated Git worktree. If it uses the catalogued `isolated-workspace` workflow, that workflow also requires Bun.

The walkthrough uses standard personal configuration paths. A custom agent configuration directory needs a separately reviewed setup; do not assume changing `--manager-root` also registers a custom Pi or OpenCode skill location.

## Install the personal manager

Run these commands from the checkout's repository root. They export only committed manager files, so a development `node_modules` directory is not copied into your personal installation. If you customized `TMPDIR`, first ensure it points outside your repositories:

```sh
EXPORT="$(mktemp -d)"
git archive HEAD .agents/skills/sync-my-skills | tar -x -C "$EXPORT"
npx -y skills@1.7.4 add "$EXPORT/.agents/skills/sync-my-skills" \
  --skill sync-my-skills --global --agent pi --yes
```

The installation should finish with exit code 0. Skills CLI 1.7.4 places the canonical personal package under `~/.agents/skills/sync-my-skills`. Keep the exported files until installation succeeds. Do not point a directory-copy installer at a checkout containing development dependencies.

From any trusted directory, set the package path and install its pinned parser without lifecycle scripts:

```sh
MANAGER="$HOME/.agents/skills/sync-my-skills"
npm ci --ignore-scripts --prefix "$MANAGER"
node "$MANAGER/scripts/sync-my-skills.mjs" --help
```

The help should list `inspect`, `prepare`, `review`, `plan`, `apply`, `status`, and `setup`. If the package is missing, stop and check the source checkout and installation destination. If the helper cannot import `yaml`, complete the approved parser setup rather than installing dependencies during project inspection.

Once this implementation is available on the upstream default branch, you can use the repository source instead of the clean export:

```sh
npx -y skills@1.7.4 add dragoscirjan/ai \
  --skill sync-my-skills --global --agent pi --yes
```

### Register the command

Plan the Pi command setup before changing personal configuration:

```sh
node "$MANAGER/scripts/sync-my-skills.mjs" setup --harnesses pi
```

The JSON result has `mode: setup-plan`, `actions`, and `planId`. On a first setup, the actions include writing `.pi/agent/prompts/sync-my-skills.md` under your home directory. The file is not written by this plan command. If the matching command already exists, the action list can be empty.

Review the destination and command content. Copy the `planId` from that result into the command below, replacing `APPROVED_SETUP_PLAN_ID`:

```sh
node "$MANAGER/scripts/sync-my-skills.mjs" setup --harnesses pi \
  --apply --confirm --plan-id APPROVED_SETUP_PLAN_ID
```

A successful result has `mode: setup-applied` and `reloadRequired: true`. In Pi, run `/reload` before using `/sync-my-skills`. A conflicting existing command is preserved; inspect it and request a deliberate resolution instead of deleting it to make setup pass.

## Run the first synchronization

Start Pi in the trusted project's repository root. For a small first example, use an existing Git repository containing a `README.md` such as:

```markdown
# Example documentation project

This repository contains project notes, not an application.
```

You do not need to add an application manifest or root agent instruction files. This walkthrough also works before the converted manager is published upstream, so explicitly choose its bundled review snapshot:

```text
/sync-my-skills --bundled
```

For normal use after upstream integration, run `/sync-my-skills` without that option. The agent then downloads the current compatible catalog, pins its commit, and uses that same snapshot throughout the run. New catalog entries become visible without reinstalling manager code. A network or schema failure stops the run; it never silently selects an older snapshot. Bundled mode is an explicit offline/review choice and may omit later entries.

The agent should first read the project's instructions and investigate its purpose without installing anything. For this documentation-only example, expect recommendations for `document-project`, `asd-ste100-technical`, and `unslop`, not a forced coding bundle. Recommendations remain your choices.

Answer the selection questions:

1. Choose which recommended skills to install or update. You may decline them all.
2. Review every remaining active project catalog entry. Choose additional skills or none. Earlier declines stay visible, and missing requirements or incompatible destinations must be explained.
3. Choose the desired harnesses. Pi is a suggestion for this example, not permission to configure every harness.
4. If deprecated installations exist, choose the exact skills to retain or remove. The default is retention. An unknown custom name is not deprecated merely because it begins with `coding-`.

For the first installation, you can accept the three documentation recommendations, decline other entries, and retain any deprecated skills. The agent should then prepare sources and an isolated workspace, show the actual file changes and source revisions, and ask you to approve one plan. It must stop for unavailable requirements or unresolved local edits rather than bypassing them.

Check the plan before approving it:

- The selected skills and any prerequisites match your choices.
- Source notices and required supporting files remain present; OpenAI metadata is excluded.
- The manager is not being installed into the project.
- No root instruction document or documentation site is being created or replaced.
- Every removal is one you explicitly selected.

After an approved apply, the worktree should contain the selected skill directories under `.agents/skills/` and `.agents/ai-assets.lock.json`. Claude projections are created only when selected. The agent should report the workspace path and actual checks. Start the chosen harness in that reported worktree, then reload its resources before using the installed skills. Reloading the untouched primary checkout does not expose changes that remain only in a separate worktree.

Pi also requires a project-trust decision before loading project `.agents/skills`. Review unfamiliar skills, supporting files, and other project resources before approving the native trust prompt. The helper does not grant trust or edit trust settings. In non-interactive/RPC mode, the normal ask policy skips unapproved project resources; a reviewed one-process `--approve` decision or an existing native decision is required. Do not add blanket approval merely to make discovery pass.

The changes remain in that isolated worktree for review. They are not automatically committed or merged into the project's primary checkout. Installing guidance does not itself install the project's documentation toolchain or create instruction-template routes. That separate work remains under issue #68.

### Check a reported installation

Set `WORKTREE` to the absolute worktree path reported by the agent, then run this from any directory:

```sh
node "$MANAGER/scripts/sync-my-skills.mjs" status --root "$WORKTREE"
```

Recorded installed files should report `state: clean`. A modified or missing result needs investigation; do not reset local files to obtain a clean report. The status covers recorded files, not a claim that unrelated project content was tested.

## Update or remove an old skill

Run `/sync-my-skills` again in the project. Normal runs refresh the curated catalog first, then compare source and installed state, show earlier choices, and ask about the remaining entries again. A compatible new catalog does not replace manager code. If its schema or source-owner policy is unsupported, approve a separate manager update rather than bypassing the stop.

To update the personal manager itself, repeat the reviewed installation, parser setup, and command setup with the new version. Project synchronization never performs that personal code update. A local export is not a remote update channel; use a new export or the integrated repository source.

An unchanged approved adaptation can be reused. Changed source, adaptation instructions, or target requirements require a new review. The LLM may apply a different edit when upstream wording changes, but it must explain consequential changes and obtain approval before replacement.

For a known old installation such as `coding-ts`, review its replacement and local contents. Retain it unless you want that exact installation removed. Selecting a replacement alone does not authorize removal. A changed removal directory or stale plan must cause a stop and a new approval.

Unknown custom skills remain untouched. The old `sync-agent-assets` installation is an explicit deprecation, not a second supported manager. Existing version-1 manager locks can migrate under a reviewed plan; previously managed root documents stay unchanged.

## Other harnesses and setup limits

Choose `--agent opencode` or `--agent claude-code` during personal installation when needed. For command registration, pass the chosen subset to `setup`, for example `--harnesses pi,opencode`. Plan and approve that setup separately from project synchronization.

The standard destinations are:

| Harness | Personal command or skill location |
|---|---|
| Pi | `~/.pi/agent/prompts/sync-my-skills.md` |
| OpenCode | `~/.config/opencode/commands/sync-my-skills.md` |
| Claude Code | A relative `~/.claude/skills/sync-my-skills` link to the canonical package. |

Claude links require filesystem support for symbolic links. Matching existing destinations are reused; conflicts stop. Setup does not install the package or dependencies. `--home` and `--manager-root` support explicit locations and disposable tests, but do not override every harness-specific environment variable. Confirm custom resource registration separately.

No model or provider is selected by these command files. The normal project workflow uses only the curated catalog; researching new entries is a separate request.

## Recover from a stopped operation

| Result | Next action |
|---|---|
| The export or installer cannot find `sync-my-skills`. | Check that the selected source revision contains the converted manager. Do not use an older main revision that has only the old name. |
| Temporary storage resolves inside a target or source location. | Choose an external temporary directory, including when `TMPDIR` is a symbolic link. Inspection must not write into those locations. |
| Catalog refresh is unavailable or incompatible. | Resolve the network/source version or approve a manager update. Choose `--bundled` explicitly if an older installed snapshot is acceptable. No automatic fallback occurs. |
| The helper cannot load `yaml`. | Request or complete the manager's approved `npm ci --ignore-scripts` setup. Do not install target dependencies merely for detection. |
| Setup or apply reports a stale plan. | Inspect current content and generate a new plan. Do not reuse the old identifier. |
| A personal command already exists with different content. | Keep it and review the conflict before any replacement. |
| A target skill contains local edits. | Review the diff and choose an exact resolution, or leave it unchanged. |
| Source acquisition or a prerequisite is unavailable. | Resolve that requirement or decline the skill. Do not silently substitute another source or version. |
| Apply was interrupted. | Preserve the worktree and stage, inspect what changed, and obtain a new plan. Multi-file apply is not an atomic transaction. |
| Installed project skills are absent from Pi. | Start Pi in the reported worktree and review its project-trust decision. RPC cannot show the native trust prompt; do not treat skipped unapproved resources as a failed file installation. |
| `/sync-my-skills` is not discovered after setup. | Check the selected harness's actual resource locations and reload behavior. Custom configuration roots may need a manual reviewed registration. |

## Maintain the catalog or manager

The [YAML catalog](assets/skill-catalog.yaml) records sources, install commands, exclusions, legal files, prerequisites, and semantic adaptation intent. [The data model](references/data-model.md) explains staging, selection JSON, fingerprints, and lock migration. [SKILL.md](SKILL.md) contains the complete LLM workflow. These references are not prerequisites for the first synchronization.

From the root of a complete source checkout, after approved parser setup:

```sh
npm --prefix .agents/skills/sync-my-skills run check
npm --prefix .agents/skills/sync-my-skills test
npm --prefix .agents/skills/sync-my-skills audit --omit=dev
```

The source tests include repository/catalog coverage checks. Do not expect those source-checkout checks to run from a personal package containing only the manager. Detection does not execute target code or install dependencies; explicit source/runtime setup is a different operation.

Track this work in [#69](https://github.com/dragoscirjan/ai/issues/69). Documentation remains Markdown by owner decision. No site build or deployment is configured by this change.
