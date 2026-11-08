---
name: init-project
description: Initialize or adopt the shared mise, Node, pnpm, Tempel, and Husky project foundation. Use alone for repository-wide setup or as the shared foundation for init-with-rules.
compatibility: Requires mise, Git, and Bun with Bun.TOML.parse. Hard-stops when Bun is unavailable. Target projects require Node 24 or newer; tool installation and lockfile updates need explicit approval.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Project initialization

Plan or adopt the shared tooling foundation. Loading these instructions as a prerequisite does not request foundation changes or authorize installation. Language setup belongs to `init-with-rules` and requires separate approval.

## Inspect and approve

Read project instructions and contribution policy; satisfy its workspace and mutation gates. Require Git, mise, and Bun; stop if a prerequisite is unavailable. Bun runs the helper only and is not added to the target toolchain.

Inspect existing manifests, locks, mise tasks, hooks, validation, CI, platforms, and Git state. Preserve equivalent tools, package managers, versions, publishable-package contracts, and custom hooks. Stop on conflicts; propose exact reconciliation rather than overwrite.

Before mutation, show the complete plan: changed files and final contents, selected versions and their sources, dependencies/overrides, scripts/tasks, hooks, conflicts, installation commands, and lockfile changes. Redact sensitive existing values without hiding proposed edits. Wait for explicit approval. Upgrades, fixes, and language setup are not implied.

## Use the tested helper

Run from this skill directory with an absolute target root:

```text
bun scripts/init.ts --help
bun scripts/init.ts --root /absolute/project --node 24 --pnpm 10.33.0
```

The default is a non-mutating JSON plan. Review every proposed file. After approval, repeat the selected arguments with `--apply --confirm`. Add `--install` only with installation and lockfile approval; it also changes the user-level mise trust store. Treat stdout as result data and stderr as diagnostics. Resolve unsupported shapes or conflicts through a revised plan, never forced templates.

## Foundation contract

- Require Node 24 or newer. Propose a maintained compatible Node/pnpm pair, not floating `latest`; do not lower the baseline.
- Mise owns executable tools and `mise.lock`. `package.json`, pnpm, and `pnpm-lock.yaml` own Node dependencies. Never hand-edit lockfiles or put Node packages in mise.
- Tooling-only manifests are private; changing an existing package's identity, publication, workspaces, exports, or release metadata needs approval.
- Default manifest tooling: Husky, jscpd, `@commitlint/cli` + `@tempel/commitlint`, ESLint + `@tempel/eslint`, and Prettier + `@tempel/prettier`. Reuse compatible project choices and the helper's tested pins. Use documented Tempel APIs; `@tempel/tsconfig` is unmaintained.
- Keep leaf commands in their owning manifest; mise orchestrates namespaced tasks without recursion. Language additions append implementations without replacing real checks. Reconcile failing placeholders explicitly; unconfigured categories must not pretend to pass.
- Checking tasks (`lint`, `format`, `code-duplicate`, `audit`, `typecheck`, `test`) must not rewrite source. `build` produces approved output artifacts. `quality` runs applicable gates; `validate` aliases it. Explicit `lint:fix`/`format:fix` tasks may write source. `deps:sync` installs pinned tools and locked dependencies.
- Proposed Husky policy: fast formatting/lint checks at pre-commit, Commitlint with the quoted message-file argument at commit-msg, and `mise run validate` at pre-push. Preserve existing managers and hooks.
- Ignore paths and numeric thresholds come only from project configuration.

## Verify and report

After approved application, inspect generated configuration, hooks and executability, lockfiles, and the full diff. Run `deps:sync` and applicable non-mutating tasks. Report each gate as passed, failed, not run, or unsupported; missing implementations never pass.

Use bundled helpers for supported contracts. Any approved replacement must remain plan-first, confirmation-gated, idempotent, root-confined, argument-array based, conflict-detecting, and failure-propagating; preserve unrelated fields and avoid broad upgrades. Never read, log, or persist credentials.
