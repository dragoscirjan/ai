# MTS coding

`coding-mts` adds `.mts` TypeScript ESM semantics to [`coding-ts`](../coding-ts/SKILL.md) and the generic [`coding`](../coding/SKILL.md) workflow.

## Scope

- TypeScript ESM classification and `.mjs` output
- `module` and `moduleResolution` behavior
- runtime import specifiers
- type-only imports and exports
- `import.meta`, top-level await, and CommonJS interoperability
- `.d.mts` declarations and package exports

Reference: [TypeScript modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html).

## Dependencies

Load `coding`, `coding-ts`, and `coding-mts` in that order. All are sibling skills. Stop when a dependency is unavailable; do not install it automatically.

## Invocation

- Pi: `/skill:coding-mts`
- OpenCode: `/coding-mts`

See [issue 17](https://github.com/dragoscirjan/ai/issues/17) for the implementation requirements.
