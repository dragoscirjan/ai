# Install skills and maintain instructions separately

Use the Node.js CLI to install skills. Use `sync-my-agents` only when you explicitly want instruction-document changes. Neither operation requires or automatically launches the other.

## Run the Node.js CLI

You need Node.js 24, npm/npx, Git, and a trusted destination project. Read that project's instructions and follow its branch/workspace rules before approving writes. GitHub-based `npx` downloads the executable and its declared runtime dependencies into npm's cache; it does not publish an npm package.

Replace `<tag-or-commit>` with a reviewed GitHub ref that contains the new CLI. Unpublished local changes are not available through GitHub.

```sh
npx -y github:dragoscirjan/ai#<tag-or-commit> --help
npx -y github:dragoscirjan/ai#<tag-or-commit> list
```

The root package's single `bin` entry invokes `scripts/skills/sync.mjs`. It reads `catalog/skill-catalog.yaml`; it is not a skill or a personal agent command. A checkout with approved runtime dependencies can run `node scripts/skills/sync.mjs` with the same arguments.

## Preview a selection

From the destination project's root, preview an explicit selection:

```sh
npx -y github:dragoscirjan/ai#<tag-or-commit> --skill coding-with-rules --agent pi --target . --dry-run
```

The preview lists `coding` before `coding-with-rules`, because it is a required skill. It shows exact installation argument arrays, destinations, legal-file changes, filtering, and any blockers. A preview performs no source downloads or target writes after the executable itself has been acquired.

Use `--category coding` instead of `--skill` to review that category's project-scoped members. Repeat `--category`, `--skill`, or `--agent`, or provide comma-separated values. Supported agents are `pi`, `opencode`, and `claude-code`. In an interactive terminal, choose categories, then individual skills within each selected category, then agents. Each category's skill checklist starts with all eligible skills checked. Use the arrow keys to move, Space to toggle one choice, A to select or clear all, and Enter to accept. You can clear a category completely to skip it. Clearing every category cancels without installing anything. Category and agent selection still require at least one choice.

Required prerequisites cannot be omitted while keeping a skill that needs them. The preview identifies any required skills added back, even if you unchecked them. Explicit `--skill` selections are also retained. Deselecting an installed skill never removes it.

`--yes`, `--json`, and noninteractive category runs bypass these skill checklists and retain the existing all-members behavior. Use explicit `--skill` flags for exact scripted subsets. The final confirmation defaults to no; Ctrl+C cancels a prompt cleanly with exit code 130, before installation. Noninteractive runs must provide their selections explicitly.

Use `--ref <ref>` to choose this repository's skill-source revision separately from the CLI revision. Without it, authored skill commands follow the catalog's configured ref. Upstream sources retain their catalogued immutable pins. Pinning the CLI alone does not pin a mutable authored-skill ref.

## Confirm and verify

Review the preview. Repeat the command without `--dry-run` to receive an interactive confirmation. For an already approved noninteractive run, add `--yes`:

```sh
npx -y github:dragoscirjan/ai#<tag-or-commit> --skill coding-with-rules --agent pi --target . --yes
```

The script runs the catalogued `npx -y skills@1.7.4 add` commands with explicit agent selection. It acquires required legal files before starting installations, verifies skill metadata and prerequisites, and removes catalogued unwanted metadata such as `agents/openai.yaml`. It never executes installed helpers or initializers.

Project skills use `.agents/skills/<name>/`. Selected Claude Code installations may use relative `.claude/skills/<name>` projections. The CLI verifies selected destinations and rejects unsafe symlink traversal. A successful run lists verified skills. It does not modify `AGENTS.md`, referenced instruction documents, personal command registration, or legacy manager locks.

The external Skills CLI owns its own installation records. There is no new custom manager-owned lock, persistent apply-plan ID, or staging protocol.

## Update selected skills

Existing selected destinations block installation by default, including unmanaged or locally edited copies. Inspect them first. Pass `--overwrite` only if you approve replacing the displayed selected skills, then preview again before confirming. Unselected/custom skill directories remain outside the operation.

A failed command or verification stops subsequent installations. Already completed writes are not rolled back automatically. The error names the stopped skill and completed skills. Inspect partial output before retrying; do not delete legacy locks or bypass conflicts to make a retry pass.

## Unsupported semantic adaptations

Some catalog entries are pinned upstream inputs that require semantic adaptation and review. The deterministic CLI cannot perform that work. It reports these entries as blocked before any installation rather than silently omitting them or substituting upstream behavior. `list` identifies them, and a dry run reports all blockers.

Deselect blocked entries in the category checklists, choose supported individual skills with `--skill`, or obtain a separately reviewed maintained adaptation and an approved catalog update. Do not remove adaptation requirements just to make a category install succeed. Missing runtime tools are reported as requirements, not installed by this script.

## Install an individual skill directly

After reviewing its source, you can use the external Skills CLI without the wrapper. For example:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/utility/isolated-workspace --skill isolated-workspace
```

This acquires only the named skill. Raw Skills CLI commands do not automatically install the project's declared instruction requirements or apply its catalog filtering and legal-file rules. Missing required skills stop invocation until you explicitly arrange their setup. [Find a skill](/skills/) and check its requirements first.

## Review AGENTS.md and its dependencies

Install the separate user-invoked skill only when wanted:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/sync-my-agents --skill sync-my-agents --global
```

Use a published ref containing that skill. Alternatively, the wrapper can install this personal skill with explicit `--skill sync-my-agents --scope personal --agent pi`. Personal scope is separate from project scope and is never inferred from a category selection.

Invoke `sync-my-agents` and identify the project and requested instruction work. It follows relevant document references, inspects evidence, clarifies material unknowns, and presents exact diffs. Approve those diffs separately before editing. It preserves existing policy and custom instructions and does not impose a template bundle.

Dependencies here mean instruction documents, not skill installation prerequisites. Missing required skills stop the affected phase; `sync-my-agents` never installs them. A review that finds no necessary change leaves documents untouched.

## Migrate from the combined manager

The source `sync-my-skills` skill, custom engine, command stubs, and manager-specific schemas are retired. Existing installations, command registrations, and `.agents/ai-assets.lock.json` files in other projects remain unchanged. Review any exact removal separately under that project's safeguards. Do not invoke the retired command expecting it to run this CLI.

Instruction templates remain reusable assets, but they are not a mandatory instruction bundle for the new skill. Merging, publishing, tool setup, trust changes, and initializers remain separate permissions.
