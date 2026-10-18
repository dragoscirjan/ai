---
name: init-typescript
description: Initialize or adopt a TypeScript toolchain on the init-project foundation with project-owned compiler settings, pnpm-managed Tempel validation, tests, builds, and mise task integration. Use when adding TypeScript to a new or existing project.
compatibility: Requires the init-project, coding, and coding-ts skills. Requires the approved Node and pnpm toolchain from init-project; the bundled helper requires Node 20 or newer.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# TypeScript initialization

Add TypeScript to the repository-wide foundation from `init-project`. Keep compiler settings project-owned and use the TypeScript coding guidance for language decisions.

## Load the dependencies

Locate the advertised `init-project`, `coding`, and `coding-ts` skills by exact name and path. Read their `SKILL.md` files in that order if they are not already loaded.

If any dependency is unavailable, stop and ask the human to install or expose it. Do not install a missing skill, copy its instructions here, or infer it from memory.

## Inspect the intended project

Confirm that the `init-project` foundation exists or run its planning workflow first. Inspect `package.json`, pnpm files, `mise.toml`, all `tsconfig` files, module declarations, runtime targets, source and output directories, package exports, tests, build tools, CI, and existing lint or format configuration.

Determine from project evidence or ask only when it changes the generated contract:

- application or library
- Node, browser, another runtime, or multiple targets
- ESM, CommonJS, or a deliberate dual-package design
- emitted JavaScript, declarations only, or `noEmit`
- source, test, generated, and output paths
- test runner and coverage policy

Do not infer those choices from a filename alone. Do not convert a working JavaScript project, module system, bundler, or test runner without approval.

## Present the TypeScript plan

Before mutation, add the TypeScript-specific changes to the approved project plan:

- manifest dependencies and scripts
- project-owned `tsconfig` files and their target contracts
- ESLint, Prettier, and test configuration changes
- TypeScript mise tasks and aggregate-task changes
- files or directories that initialization will create
- commands that will install dependencies, generate files, build, or test

Approval granted to `init-project` covers only the shared foundation. Present the complete TypeScript plan and wait for separate explicit approval before writing configuration, changing manifests, or installing dependencies. Stop on conflicts and show the exact proposed reconciliation.

## Run the bundled initializer

Use the tested helper in [`scripts/init.mjs`](scripts/init.mjs) when its closed project-shape options match the requested TypeScript project. Run commands from this skill directory and pass the absolute target root.

Inspect its interface and generate a non-mutating JSON plan:

```text
node scripts/init.mjs --help
node scripts/init.mjs --root /absolute/project --runtime node --module esm --kind app --node-types 24.19.2
```

After the human approves the complete TypeScript plan, apply it. Add `--install` only when dependency installation and lockfile updates are also approved:

```text
node scripts/init.mjs --root /absolute/project --runtime node --module esm --kind app --node-types 24.19.2 --apply --confirm --install
```

With `--install`, the helper re-trusts the approved `mise.toml` after adding TypeScript tasks; include that user-level trust-store change in the approval. The helper rejects unknown project shapes, incompatible existing scripts, and different configuration files. Resolve those cases through a revised plan instead of forcing the template.

## Add manifest-owned dependencies

Use pnpm and `package.json` for TypeScript dependencies. Reuse existing compatible packages and versions.

When the project has no configured equivalent, propose:

- [`typescript`](https://www.typescriptlang.org/) for compilation and type checking
- [`eslint`](https://eslint.org/) with [`@tempel/eslint`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/eslint)
- [`prettier`](https://prettier.io/) with [`@tempel/prettier`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/prettier)
- [`vitest`](https://vitest.dev/) with [`@tempel/vitest`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/vitest) when the project has not selected another test runner
- runtime type packages such as `@types/node` only for applicable targets

Use the current documented Tempel APIs and satisfy their declared peer dependencies. Do not add [`@tempel/tsconfig`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/tsconfig); it is not maintained. Do not install both Vitest and Jest merely to offer choices.

Use `pnpm add --save-dev` or an equivalent structured pnpm operation after approval so `package.json` and `pnpm-lock.yaml` change together. Add missing dependencies only; do not run a broad update.

## Create project-owned configuration

Create or extend the minimum `tsconfig` structure required by the selected targets. Preserve existing compiler settings unless the approved plan changes them.

Set strictness, module behavior, resolution, libraries, declaration output, source maps, incremental state, includes, excludes, and output paths from the actual runtime and publishing contract. Prefer `noEmit` when another approved tool owns emission. Do not publish generated files or source maps unintentionally.

Configure Tempel packages through their current documented APIs. Keep local overrides explicit and minimal. Preserve existing ignore rules and generated-file boundaries.

## Add scripts and mise tasks

Use `package.json` scripts for TypeScript leaf commands. Use mise for stable orchestration. Do not make package scripts and mise tasks call each other recursively.

Use these script semantics when applicable:

- `lint`: ESLint check
- `lint:fix`: ESLint approved fixes
- `format`: Prettier check
- `format:fix`: Prettier write
- `typecheck`: TypeScript compile check without unintended output
- `test`: non-watch test run
- `test:watch`: optional interactive test mode
- `build`: the selected application or library build

Add namespaced mise implementations such as `typecheck:typescript`, `test:typescript`, and `build:typescript`, then append them to the corresponding public tasks from `init-project`. Reuse the project-wide lint, format, duplicate, and audit tasks when they already cover TypeScript. Extend their scope only when required.

Do not add universal coverage, duplication, or severity thresholds. Use project-defined values only.

## Use helpers without hiding changes

Prefer the bundled helper for supported projects. Any replacement or additional Node helper must follow the `init-project` helper-script contract, print or return the exact plan before apply, preserve unrelated manifest fields, and stop on conflicting scripts or versions.

Do not hand-edit `pnpm-lock.yaml` or write a helper that constructs it.

## Verify initialization

After approved changes:

1. Synchronize mise and pnpm dependencies through the project tasks.
2. Confirm the selected Node and TypeScript versions satisfy every Tempel peer and engine requirement.
3. Run formatting check, lint, type checking, focused tests, the broader configured tests, build, duplicate detection, and pnpm audit as applicable.
4. Inspect emitted files, declarations, package exports, source maps, coverage output, and ignored paths.
5. Run the aggregate `mise run validate` task.
6. Review the complete diff and generated lockfile changes.

Report every gate as passed, failed, not run, or unsupported. Never claim a missing test, build, coverage, or runtime target passed.
