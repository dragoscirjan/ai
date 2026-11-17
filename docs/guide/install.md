# Install with review

Install the personal manager once, then let it inspect a trusted project and propose a reviewed selection. Do not copy all skills into every project.

## Before you start

You need a working agent harness, Node.js 22.20 or newer, Git with worktree support, and npm/npx for the manager installation. The target project must have at least one Git commit. The catalogued workspace helper also needs Bun before project writes.

Installation downloads code and changes personal or project files. Review the source, destinations, and applicable approvals first. No credentials are required to inspect the public collection. Custom harness configuration directories need their own reviewed setup.

## 1. Install the personal manager

The following example selects Pi and the integrated repository source. It is a personal installation, not a project synchronization. The repository is still named `dragoscirjan/ai`; a planned rename is not an available source URL.

```sh
npx -y skills@1.7.4 add dragoscirjan/ai \
  --skill sync-my-skills --global --agent pi --yes
```

Expect exit code 0 and the canonical package under `~/.agents/skills/sync-my-skills`. For OpenCode or Claude Code, select `--agent opencode` or `--agent claude-code` instead. Review the [full manager guide](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/sync-my-skills/README.md) for the committed clean-export alternative and platform limits.

Install the package's pinned parser without lifecycle scripts:

```sh
MANAGER="$HOME/.agents/skills/sync-my-skills"
npm ci --ignore-scripts --prefix "$MANAGER"
node "$MANAGER/scripts/sync-my-skills.mjs" --help
```

The help must include `inspect`, `prepare`, `review`, `review-instructions`, `plan`, `apply`, `status`, and `setup`. If the package or `yaml` import is missing, resolve that setup before project inspection. Do not install target-project dependencies merely to detect its needs.

## 2. Plan command registration

Run this read-only planning command from a trusted directory:

```sh
node "$MANAGER/scripts/sync-my-skills.mjs" setup --harnesses pi
```

Review `actions`, exact destinations, command content, and `planId`. Only after approving that plan, replace the placeholder below with its current identifier:

```sh
node "$MANAGER/scripts/sync-my-skills.mjs" setup --harnesses pi \
  --apply --confirm --plan-id APPROVED_SETUP_PLAN_ID
```

Expect `mode: setup-applied` and `reloadRequired: true`. Reload Pi with `/reload`. OpenCode and Claude Code use their own registration and reload behavior; select the corresponding `--harnesses` value and verify actual discovery. Existing conflicting commands are preserved, not overwritten to make setup pass.

## 3. Inspect a project and choose both scopes

Start the selected harness in the trusted target project and run its registered `sync-my-skills` entry point. In the Pi example:

```text
/sync-my-skills
```

The agent should inspect first, recommend a project-specific selection, and ask about every remaining active skill. It must assess optional instruction adoption separately. Declining either scope preserves its existing files; it does not override policy already active in the project.

Normal runs refresh and pin a compatible catalog snapshot. `--bundled` is an explicit offline or review choice, not a silent fallback or manager-code update.

## 4. Review the exact project change

Before project mutation, approve the required isolated workspace. Review source acquisition, instruction requirements, semantic adaptations, legal files, target conflicts, and the final byte-bound plan. Approve only the exact current plan before apply.

A missing requirement stops the affected phase. A stale plan, modified file, unsupported catalog, or unresolved policy conflict requires a new review, not a bypass. New toolchains, websites, personal setup, deprecated removals, commits, and publication keep their own approval boundaries.

## 5. Verify the installation in the reported workspace

The manager's status should report the selected managed files as clean. Start the harness in that workspace and check its resource discovery and project-trust decision. Static files and symlinks are not proof of live model compliance.

Use the [first useful request](/guide/first-use) next. If the registered command or project skills are absent, check resource paths and reload behavior in the [manager recovery guide](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/sync-my-skills/README.md#recover-from-a-stopped-operation) before reinstalling or deleting anything.
