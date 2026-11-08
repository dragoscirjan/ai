---
name: init-with-rules
description: Initialize or adopt TypeScript or Godot GDScript tooling using the shared init-project foundation and on-demand language setup references. Use for explicitly requested language initialization, not ordinary coding or automatic setup during skill installation.
require: ["init-project"]
compatibility: Requires sibling init-project helper code, Bun with Bun.TOML.parse, and an approved Node 24-or-newer/pnpm foundation. GDScript setup also requires an explicitly selected compatible Godot toolchain.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Initialization with rules

Loading instructions does not authorize initialization. Read applicable project instructions and contribution policy before planning; satisfy project approval and workspace gates before mutation. Stop on missing mandatory instructions or tools.

Use only the requested language reference. Read its linked foundation prerequisite first, once per task; stop on missing references or dependencies. The approved mise/Node/pnpm foundation and public quality tasks must already exist. If absent, stop for separately approved foundation setup; do not run it automatically.

| Requested setup | Reference | Helper from this skill directory |
|---|---|---|
| TypeScript | [TypeScript initialization rules](references/typescript.md) | `scripts/typescript/init.ts` |
| Godot GDScript | [GDScript initialization rules](references/gdscript.md) | `scripts/gdscript/init.ts` |

Unsupported languages require a new approved plan, not another language's template. For mixed projects, preserve existing language tasks and plan each requested addition.

## Plan, approve, apply

Foundation approval does not authorize language setup. Present the complete language plan and wait for separate explicit approval: final file contents, project shape, versions, dependencies, scripts/tasks, conflicts, lockfiles, and every mutating command. Preserve existing equivalents; unsupported shapes and conflicting values require reconciliation, never forced overwrites.

Require Bun and `../init-project/scripts/lib.ts` before invoking a helper. Run from this directory, pass the absolute target root, inspect `--help`, then generate the default non-mutating JSON plan. After approval, repeat the selected arguments with `--apply --confirm`. Add `--install` only when dependency/tool installation, lockfile updates, and user-level mise trust changes are approved.

The shared foundation owns package-manager boundaries, generic helper safeguards, and quality-task semantics. References contain only language-specific decisions, configuration, helper usage, and verification. Do not hand-edit lockfiles, broadly upgrade dependencies, invent numeric thresholds, or treat a missing check as passed.

After approved application, run applicable language and aggregate checks, inspect generated files and the full diff, and report passed/failed/not-run/unsupported results with coverage gaps.
