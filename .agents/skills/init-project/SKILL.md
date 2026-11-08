---
name: init-project
description: Initialize or adopt the shared project foundation, TypeScript tooling, or Godot GDScript tooling through on-demand setup references and bundled helpers. Use for explicitly requested initialization, not ordinary coding or automatic setup during installation.
compatibility: Requires Git, mise, and Bun with Bun.TOML.parse. Initialized targets require an approved Node 24-or-newer/pnpm control plane; GDScript also needs an explicitly selected compatible Godot toolchain. Installation and lockfile updates require approval.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Project initialization

Loading instructions does not authorize initialization. Read applicable project instructions and contribution policy before planning; satisfy project approval and workspace gates before mutation. Stop on unavailable mandatory instructions or tools. Bun runs the helpers only and is not added to target toolchains.

## Select the requested phase

| Requested setup | Definition | Helper from this directory |
|---|---|---|
| Shared foundation | [Project foundation](references/project.md) | `scripts/init.ts` |
| TypeScript | [TypeScript rules](references/typescript.md) | `scripts/typescript/init.ts` |
| Godot GDScript | [GDScript rules](references/gdscript.md) | `scripts/gdscript/init.ts` |

Read only applicable definitions, following linked prerequisites first and each document once per task. Stop on missing references or cycles. Unsupported languages or project shapes require a new approved plan, not another language's template.

Foundation approval does not authorize language setup. Language helpers require the approved foundation to exist; if missing, stop for separately approved foundation setup. Do not run foundation changes automatically because a language document references its definitions. Preserve other languages in mixed projects.

## Inspect, plan, and approve

Inspect Git state, manifests/locks, mise tasks, hooks, validation, CI, runtimes, and platform constraints. Preserve equivalent tools, package managers, versions, existing hooks, publishable-package contracts, and unrelated settings.

Show the complete phase plan before mutation: final proposed file contents, selected versions and sources, dependencies/overrides, scripts/tasks, hooks, conflicts, install commands, and lockfile changes. Redact sensitive existing values without hiding proposed edits. Wait for explicit approval; language setup needs its own approval after foundation setup. Upgrades, automatic fixes, and executable addons are not implied.

Run the selected helper's `--help` from this directory and pass an absolute target root. The default JSON plan is non-mutating; inspect every proposed file. After approval, repeat selected arguments with `--apply --confirm`. Add `--install` only when installation, lockfiles, and user-level mise trust-store changes are approved. Treat stdout as result data and stderr as diagnostics. Resolve conflicts and unsupported shapes through a revised plan, never forced templates.

## Shared safeguards and verification

Use the owning package manager for manifest/lock changes; never hand-edit lockfiles. Project-configured tools take precedence. Use only approved project ignore paths. Do not invent numeric thresholds. Unconfigured quality categories must not pretend to pass.

Bundled helpers are the default for supported contracts. Any approved replacement must remain plan-first, confirmation-gated, idempotent, root-confined, argument-array based, conflict-detecting, and failure-propagating; preserve unrelated fields and avoid broad upgrades. Never read, log, or persist credentials.

After approved application, run dependency synchronization and applicable language/aggregate checks, then inspect generated configuration, hook executability, outputs, lockfiles, and the complete diff. Report each gate as passed, failed, not run, or unsupported; missing implementations and unchecked targets remain gaps.
