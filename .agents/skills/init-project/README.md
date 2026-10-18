# Project initialization

`init-project` creates or adopts the repository-wide tooling foundation before a language initializer runs.

It uses mise for executable toolchains, `package.json` and pnpm for Node dependencies, maintained Tempel packages for shared validation, and Husky for Git hooks. It defines stable `mise run` entry points that language initializers extend.

## Sources

- [mise configuration](https://mise.jdx.dev/configuration.html)
- [mise tasks](https://mise.jdx.dev/tasks/)
- [pnpm `package.json`](https://pnpm.io/package_json)
- [Husky setup](https://typicode.github.io/husky/get-started.html)
- [Tempel JavaScript Development Toolkit](https://github.com/dragoscirjan/tempel-javascript)
- [Commitlint](https://commitlint.js.org/)
- [jscpd](https://jscpd.dev/)
- [Agent Skills: using scripts in skills](https://agentskills.io/skill-creation/using-scripts)
- [Bun TOML parser](https://bun.com/docs/runtime/toml)

## Dependency contract

The skill has no skill dependency. It requires mise, Git, and Bun with `Bun.TOML.parse`. Bun is required only to run the initializer; the helper hard-stops when Bun is unavailable and does not add Bun to the target project. The initialized target requires Node 24 or newer. The helper installs tools and manifest dependencies only after an exact plan receives human approval.

Language initializers depend on `init-project`; `init-project` does not depend on them.

## Invocation

Pi:

```text
/skill:init-project
```

OpenCode:

```text
/init-project
```

Direct invocation requests an initialization plan. It does not authorize unreviewed overwrites, package-manager migration, dependency upgrades, or automatic fixes.

## Files

- `SKILL.md` contains the initialization workflow and safety contract.
- `scripts/init.mjs` plans and applies the supported initialization contract.
- `scripts/lib.mjs` provides shared safe manifest, Bun TOML, process, and output helpers to the initializer family.
- `scripts/init.test.js` runs with `bun test` and tests the Bun prerequisite, TOML handling, dry-run, approval, idempotence, permissions, and conflict behavior.
- `README.md` contains supporting references and invocation notes.
