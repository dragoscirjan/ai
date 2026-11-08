# Project initialization

`init-project` provides the shared mise/Node/pnpm foundation and its approval workflow. [`init-with-rules`](../init-with-rules/SKILL.md) adds language-specific setup through plain reference files and dedicated helpers.

## Contract

- Independent skill: no instruction dependencies.
- Runtime: Git, mise, and Bun with `Bun.TOML.parse`. Bun is not added to initialized projects.
- Target control plane: Node 24 or newer and an approved compatible pnpm version.
- Plan first; apply only with confirmation. Installation, lockfiles, and user-level mise trust changes require explicit consent.
- Foundation approval does not authorize language setup. Preserve existing tooling, hooks, and package ownership.

## Use

```text
/skill:init-project
```

Run the helper from this directory:

```text
bun scripts/init.ts --help
bun scripts/init.ts --root /absolute/project --node 24 --pnpm 10.33.0
```

Review the JSON plan before repeating approved arguments with `--apply --confirm`; add `--install` only when approved. See [`SKILL.md`](SKILL.md) for the complete shared workflow.

## Files

- [`scripts/init.ts`](scripts/init.ts): foundation planning/application.
- [`scripts/lib.ts`](scripts/lib.ts): shared safe manifest, TOML, process, and output helpers.
- [`scripts/init.test.ts`](scripts/init.test.ts): Bun prerequisites, dry-run, approval, idempotence, permissions, and conflicts.

The language helpers import this library. Managed installations declare both code dependencies and instruction requirements; external Skills CLI installations must select both skills explicitly.

## Sources

[mise configuration](https://mise.jdx.dev/configuration.html), [mise tasks](https://mise.jdx.dev/tasks/), [pnpm manifests](https://pnpm.io/package_json), [Husky](https://typicode.github.io/husky/get-started.html), [Tempel toolkit](https://github.com/dragoscirjan/tempel-javascript), [Commitlint](https://commitlint.js.org/), [jscpd](https://jscpd.dev/), [skill scripts](https://agentskills.io/skill-creation/using-scripts), [Bun TOML](https://bun.com/docs/runtime/toml).
