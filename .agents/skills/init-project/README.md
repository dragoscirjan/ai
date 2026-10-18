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

## Dependency contract

The skill has no skill dependency. It requires mise, and it requires Git when Husky hooks are requested. It installs tools and manifest dependencies only after an exact plan receives human approval.

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
- `README.md` contains supporting references and invocation notes.
