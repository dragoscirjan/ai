---
name: init-project
description: Initialize or adopt shared project tooling with mise, Node, pnpm, Tempel validation, Husky hooks, manifest-owned dependencies, and stable quality commands. Use before a language initializer or when creating the repository-wide development foundation.
compatibility: Requires mise, Git, and Bun with Bun.TOML.parse. Hard-stops before initialization when Bun is unavailable. Requires Node 24 or newer for the target project and installs it, pnpm, and approved dependencies only after human approval.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Project initialization

Create or adopt the repository-wide tooling foundation. Keep language-specific setup in an `init-{language}` skill.

## Respect the repository first

Read the repository instructions and contribution policy before planning a mutation. Use the required isolated workspace workflow when the repository requires one.

Inspect Git state, `mise.toml`, `mise.lock`, `package.json`, pnpm files, existing task runners, hooks, validation configuration, CI, and supported platforms. Preserve an existing equivalent tool or command. Do not convert package managers, replace hooks, change versions, or overwrite configuration without explicit approval.

If `mise.toml` or `package.json` already has an incompatible value, report the conflict and propose the exact reconciliation. Do not guess.

## Present one initialization plan

Before changing files or installing anything, present:

- files to create or modify
- selected Node and pnpm versions and their source
- manifest dependencies and package-manager overrides to add
- package and mise scripts to add or change
- proposed contents for every file that the initializer will create or update; redact pre-existing sensitive values without hiding the proposed changes
- Husky hooks to create or change
- existing conflicts or migrations
- commands that will write files, install tools, or update lockfiles

Wait for approval of that plan. Approval to initialize does not authorize unrelated upgrades or automatic fixes.

## Run the bundled initializer

Use the tested helper in [`scripts/init.ts`](scripts/init.ts) when the requested project fits its contract. Run commands from this skill directory and pass the absolute target repository root. The helper uses Bun's built-in TOML parser; Bun is only the initializer runtime and is not added to the target project's toolchain.

Before any invocation, require Bun and hard-stop if it is unavailable:

```sh
command -v bun >/dev/null 2>&1 || { echo "Bun is required to run init-project." >&2; exit 1; }
```

Inspect its interface first:

```text
bun scripts/init.ts --help
```

Generate a non-mutating JSON plan:

```text
bun scripts/init.ts --root /absolute/project --node 24 --pnpm 10.33.0
```

After the human approves that exact plan, apply it. Add `--install` only when the approval includes tool installation and lockfile updates:

```text
bun scripts/init.ts --root /absolute/project --node 24 --pnpm 10.33.0 --apply --confirm --install
```

With `--install`, the helper also trusts the generated `mise.toml`; include that user-level mise trust-store change in the approval. The bundled package versions are exact and tested together. If the project needs different versions or the script reports a conflict, revise the plan and resolve the conflict explicitly; do not bypass its stop or overwrite the existing state. Treat JSON on stdout as result data and stderr as diagnostics. The JSON plan includes final proposed contents for every changed file and marks any sensitive pre-existing values that were redacted; inspect those contents before approval.

## Keep dependency ownership clear

Use mise for executable tools that do not belong in a project dependency manifest. Use `package.json` and pnpm for Node dependencies.

The baseline normally has:

- Node and pnpm in `mise.toml`
- exact tool resolutions in `mise.lock`
- a `packageManager` declaration in `package.json`
- Node dependencies and scripts in `package.json`
- exact Node dependency resolutions in `pnpm-lock.yaml`

Do not put Husky, jscpd, Commitlint, ESLint, Prettier, or Tempel packages in mise. Do not use mise as a second package manifest.

For a tooling-only Node manifest, set `private` to `true`. Preserve an existing publishable package contract and ask before changing `private`, package identity, workspaces, exports, or release metadata.

## Establish the baseline

Require Node 24 or newer for every initialized target. If the project selects an older Node version, stop and request a supported-version decision; do not lower the baseline. For a new project with no version policy, propose Node 24 or a newer maintained line and a compatible maintained pnpm release; do not silently select floating `latest` versions.

Configure `mise.toml` with lockfile support, Node, pnpm, and stable project entry points. Keep task bodies in the language manifest when that ecosystem has a script facility. Let mise orchestrate those scripts.

Use these public command semantics:

- `lint`: check without modifying files
- `lint:fix`: apply approved lint fixes
- `format`: check formatting without modifying files
- `format:fix`: write formatting changes
- `code-duplicate`: check duplicate code
- `audit`: audit manifest-owned dependencies
- `typecheck`: run configured static type checks
- `test`: run configured tests
- `build`: build configured outputs
- `quality`: run the applicable non-mutating gates
- `validate`: compatibility alias for `quality`
- `deps:sync`: install pinned mise tools and locked manifest dependencies

Create namespaced implementation tasks such as `lint:project` and make the public tasks depend on their applicable implementations. A language initializer appends its own namespaced tasks without replacing existing ones. A task with no implementation must report that it is not configured; it must not pretend that a quality category passed.

For the default Node tooling control plane, propose these manifest dependencies when no equivalent project choice exists:

- [Husky](https://typicode.github.io/husky/) for Git hooks
- [jscpd](https://jscpd.dev/) for duplicate detection
- [`@commitlint/cli`](https://commitlint.js.org/) and [`@tempel/commitlint`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/commitlint) for Conventional Commit validation
- [`eslint`](https://eslint.org/) and [`@tempel/eslint`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/eslint) for repository configuration linting
- [`prettier`](https://prettier.io/) and [`@tempel/prettier`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/prettier) for supported configuration and documentation formatting

Use the current documented Tempel APIs rather than copying configuration from memory. Do not add `@tempel/tsconfig`; it is not maintained.

Apply only project-defined ignore paths and numeric thresholds. Do not invent duplication, coverage, severity, or complexity thresholds.

## Configure Husky

Install Husky through pnpm, run its documented initialization command, and inspect every generated edit before keeping it. Keep hook commands small and delegate to stable project tasks.

Unless the project chooses another policy, propose:

- `pre-commit`: the fast non-mutating formatting and lint checks
- `commit-msg`: Commitlint against the supplied message file
- `pre-push`: the broader `mise run validate` gate

Preserve existing hooks and hook managers. Do not install a second manager or discard custom hooks without approval. Quote hook arguments and keep secrets out of hooks and logs.

## Use helper scripts safely

Prefer the bundled Bun helper for its supported contract. Add or generate another Bun or Python helper only when the approved project needs behavior that the bundled script does not support and a structured script is safer than manual text replacement.

Every helper must:

- default to inspection or print the exact planned changes before apply
- require an explicit apply action after approval
- be idempotent
- use argument arrays or equivalent safe process APIs instead of shell interpolation
- reject paths outside the selected project root
- preserve unrelated manifest fields and scripts
- stop on conflicting values
- avoid broad dependency upgrades
- propagate command failures
- never read, print, or persist credentials

Use the owning package manager for dependency changes so it updates the manifest and lockfile together. Do not hand-edit lockfiles.

## Apply and verify

After approval:

1. Add or merge the mise tool declarations and task contract.
2. Install the selected mise tools and write the mise lockfile when the project uses one.
3. Add or merge the Node manifest fields, dependencies, and scripts with pnpm.
4. Configure Tempel-backed validation through its current documented API.
5. Initialize or update Husky hooks without replacing unrelated hooks.
6. Run `deps:sync`, then each configured non-mutating task.
7. Review generated files, lockfile changes, hook executability, and the complete diff.

Report every gate as passed, failed, not run, or unsupported. Never claim an empty, missing, or unavailable implementation passed.
