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

## Copy skills into a plugin or custom directory

Use `--skills-dir` when you want portable skill folders in an exact directory rather than normal agent installations. The owning project directory must already exist. For an existing Claude plugin, replace `my-plugin` with its root:

```sh
npx -y github:dragoscirjan/ai#<tag-or-commit> \
  --target ./my-plugin --skills-dir skills --skill coding-with-rules --agent claude-code --dry-run
```

The preview targets this layout and includes the required `coding` skill:

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json                 unchanged, if present
└── skills/
    ├── coding/
    │   ├── SKILL.md
    │   └── LICENSE
    └── coding-with-rules/
        ├── SKILL.md
        ├── references/
        └── LICENSE
```

This matches [Claude's documented plugin skill layout](https://code.claude.com/docs/en/plugins/components). Do not put skills under `.claude-plugin/`; that directory contains plugin metadata. For another custom directory, choose its exact path and configure its consumer separately. This script never edits plugin manifests, loads or registers plugins, changes trust, or executes installed helpers.

Relative `--skills-dir` paths resolve under `--target`, not the invocation directory. An absolute path must also be a subdirectory of `--target`. Paths outside that project, its root itself, Git metadata, symlink traversal, and overlaps with protected instruction documents are rejected. Point `--target` at the owning project rather than bypassing its scope. A missing output directory is created only after confirmation and successful source verification.

Keep `--agent claude-code` to check the selected skills' catalogued Claude compatibility. In this mode, agent selection does not create harness-specific directories. Even personal catalog entries explicitly selected with `--scope personal` are copied only into this output directory, never installed globally.

Review the dry run, then repeat without `--dry-run` to confirm or use `--yes` for a separately approved noninteractive run. All selected sources and legal files are acquired in a disposable workspace and verified before any output skill folder changes. Acquisition follows the selected harness's native layout, including Claude's `.claude/skills`; only verified flat skill folders are published. Installation records stay in that temporary workspace; the plugin receives no normal `.agents`/`.claude` directories, new manager locks, or CLI lock changes.

Unselected folders and project/plugin metadata remain unchanged. Existing selected folders require `--overwrite`; that approval replaces the complete selected folder, including obsolete files. Replacement is per skill, not an all-or-nothing transaction for the entire selection. A failed replacement restores the original when possible. If an unexpected concurrent write prevents restoration, the error identifies a preserved backup for inspection; do not delete that backup blindly.

## Confirm and verify

Review the preview. Repeat the command without `--dry-run` to receive an interactive confirmation. For an already approved noninteractive run, add `--yes`:

```sh
npx -y github:dragoscirjan/ai#<tag-or-commit> --skill coding-with-rules --agent pi --target . --yes
```

The script runs the catalogued `npx -y skills@1.7.4 add` commands with explicit agent selection. It acquires required legal files before starting installations, verifies skill metadata and prerequisites, and removes catalogued unwanted metadata such as `agents/openai.yaml`. It never executes installed helpers or initializers.

Normal installations keep a verified canonical folder at `.agents/skills/<name>` under the project, or under your home for personal scope. Selected Claude destinations and personal OpenCode config destinations use exact relative symlink projections to that folder. Native Skills CLI 1.7.4 writes Pi/OpenCode assets to the canonical directory, but Claude writes its own directory. The wrapper verifies those actual native outputs before normalizing the final layout; it does not mistake an older canonical copy for fresh Claude output.

The CLI verifies selected destinations and rejects unsafe symlink traversal. A successful run lists verified skills. It does not modify `AGENTS.md`, referenced instruction documents, personal command registration, or legacy manager locks.

For normal agent installations, the external Skills CLI owns its own installation records. Custom-directory acquisition records exist only in the disposable workspace. There is no new custom manager-owned lock, persistent apply-plan ID, or staging protocol.

## Relative Markdown links

Source skills use category directories, but installed skills use flat names. Sync rebases Markdown links, images, and reference definitions against the original source paths and final installed layout. A reference to a declared dependency resolves against that dependency's catalogued source and installed location.

Operational skill references in portable packages may target only self and declared required skills. Skill overview READMEs describe intent, real dependencies, and verified factual origin or inspiration. They may include short usage examples and standalone install instructions using the pinned acquisition tool, without depending on the sync CLI. Attribution does not add an installation dependency. Verification rejects operational undeclared references, optional or reverse recommendations, collection/sync-tool guidance, and overview content outside that contract rather than adding dependencies to justify them. Same-skill links remain unchanged. Source-attribution and technical-reference links can use source-ref GitHub URLs, with raw file URLs for fallback images. Queries and fragments are preserved. The link routine does not add dependencies or install referenced skills.

Only destination URLs change. Prose, labels, frontmatter, code examples, and required legal files stay unchanged. This parser-based routine does not repair already-invalid source links or raw HTML attributes. It runs on freshly acquired files before custom output is published; it needs no LLM. Normal installs can still have partial writes if later verification fails.

## Update selected skills

Existing selected destinations block installation by default, including unmanaged or locally edited copies. Inspect them first. Pass `--overwrite` only if you approve replacing the displayed selected skills, then preview again before confirming. Unselected/custom skill directories remain outside the operation.

A destination without its own `SKILL.md` that contains child skill folders is a collection, not one installed skill. The CLI refuses to replace it, even with `--overwrite`. Choose a separate destination project or output directory to preserve the authored sources.

A failed command or verification stops subsequent installations. Already completed writes are not rolled back automatically. The error names the stopped skill and completed skills. Inspect partial output before retrying; do not delete legacy locks or bypass conflicts to make a retry pass.

## Unsupported semantic adaptations

The current catalog contains no unprepared remote adaptations. `code-review`, `tdd`, and `wait-what` have reviewed local variants, with pinned upstream provenance and original/project licenses. Their portable instructions are committed source files, not generated during synchronization. `wait-what` prefers the project glossary and includes a generic fallback in its own folder. `grill-me` and `writing-for-agents` use unchanged pinned upstream instructions, with required supporting files. The upstream `grill-me` body calls the Skill tool for `grilling`; the catalog keeps `grilling` in its installation closure but does not add a project-specific `requires` field or rewrite the upstream call. A compatible skill-invocation mechanism is needed, and live harness invocation remains unverified. The script filters `agents/openai.yaml`; it does not remove unrelated OpenAPI documents.

Sync needs no LLM or model API credentials. It copies prepared content, includes declared skill prerequisites, preserves required support/legal files, and applies deterministic exclusions. Review and publish source upgrades separately; a future remote entry that still needs semantic changes remains blocked until a maintained variant is available. Do not disable that guard or relabel unreviewed content just to make installation succeed. Missing runtime tools are reported as requirements, not installed by this script.

For a reviewed CLI commit or tag, pass the same value through `--ref` to select that revision's authored and maintained skill files. This is required for newly published source paths that are not yet on the catalog's default `main` ref. It also makes repeated runs select the same maintained source bytes.

## Install an individual skill directly

After reviewing its source, you can use the external Skills CLI without the wrapper. For example:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/utility/isolated-workspace --skill isolated-workspace
```

This acquires only the named skill. Raw Skills CLI commands do not automatically install the project's declared instruction requirements or apply its catalog filtering and legal-file rules. Missing required skills stop invocation until you explicitly arrange their setup. [Find a skill](/skills/) and check its requirements first.

## Review AGENTS.md and its dependencies

Install the separate user-invoked skill only when wanted:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/sync-my-agents --skill sync-my-agents
```

Use a published ref containing that skill. The command above installs into the project. The wrapper also includes `sync-my-agents` in the Agentic work checklist by default. To install personally, use explicit `--skill sync-my-agents --scope personal --agent pi` with the wrapper, or add `--global` to the direct command. Personal scope is never inferred from a category selection. Installing the skill does not invoke it, run setup, or authorize instruction edits.

Invoke `sync-my-agents` and identify the project and requested instruction work. It follows relevant document references, inspects evidence, clarifies material unknowns, and presents exact diffs. Approve those diffs separately before editing. It preserves existing policy and custom instructions and does not impose a template bundle.

Dependencies here mean instruction documents, not skill installation prerequisites. Missing required skills stop the affected phase; `sync-my-agents` never installs them. A review that finds no necessary change leaves documents untouched.

## Migrate from the combined manager

The source `sync-my-skills` skill, custom engine, command stubs, and manager-specific schemas are retired. Existing installations, command registrations, and `.agents/ai-assets.lock.json` files in other projects remain unchanged. Review any exact removal separately under that project's safeguards. Do not invoke the retired command expecting it to run this CLI.

Instruction templates remain reusable assets, but they are not a mandatory instruction bundle for the new skill. Merging, publishing, tool setup, trust changes, and initializers remain separate permissions.
