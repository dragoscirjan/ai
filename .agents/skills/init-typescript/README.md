# TypeScript initialization

`init-typescript` adds a TypeScript toolchain to the foundation created by `init-project`.

It keeps compiler configuration in project-owned `tsconfig` files, installs Node dependencies with pnpm, prefers maintained Tempel validation packages when the project has no existing choice, and connects TypeScript scripts to stable mise tasks.

## Sources

- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [TypeScript `tsconfig` reference](https://www.typescriptlang.org/tsconfig/)
- [Node.js packages](https://nodejs.org/api/packages.html)
- [pnpm `package.json`](https://pnpm.io/package_json)
- [`@tempel/eslint`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/eslint)
- [`@tempel/prettier`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/prettier)
- [`@tempel/vitest`](https://github.com/dragoscirjan/tempel-javascript/tree/main/packages/vitest)
- [Agent Skills: using scripts in skills](https://agentskills.io/skill-creation/using-scripts)

`@tempel/tsconfig` is intentionally excluded because it is not maintained. The initializer creates project-owned compiler configuration instead.

## Dependency contract

Load `init-project`, then `coding`, then `coding-ts`. Stop when one is unavailable; do not install a missing skill automatically.

The target project uses the approved Node 24-or-newer and pnpm toolchain from `init-project`. The bundled initializer requires Bun with `Bun.TOML.parse`, hard-stops when Bun is unavailable, and does not add Bun or another package manager to the target project.

## Invocation

Pi:

```text
/skill:init-typescript
```

OpenCode:

```text
/init-typescript
```

Direct invocation requests a TypeScript initialization plan. The project shape and exact mutation still require review before apply.

## Files

- `SKILL.md` contains the TypeScript initialization workflow.
- `scripts/init.ts` plans and applies the supported TypeScript contract with Bun. It imports the shared Bun and Node-compatible standard-library helpers from the required `init-project` skill.
- `scripts/init.test.ts` runs with `bun test` and tests dry-run, approval, idempotence, task registration, and conflict behavior.
- `README.md` contains supporting references and invocation notes.
