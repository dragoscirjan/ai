# MTS coding

## Preserve TypeScript ESM semantics

Use the [TypeScript modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html) and the project's runtime documentation.

- Treat `.mts` as an ECMAScript module. With TypeScript's Node-aware modes, it emits an `.mjs` file and uses `.d.mts` declarations.
- Preserve the configured `module` and `moduleResolution` modes. Do not copy Node.js specifier rules into bundler, browser, Deno, or Bun projects without evidence.
- Write runtime import specifiers for the emitted environment. In Node-aware configurations, this can require the output file extension rather than the source `.mts` extension.
- Use `import type` and `export type` where required by the project's emit and `verbatimModuleSyntax` settings.
- Do not introduce CommonJS globals or synchronous `require` as if they were native ESM features.
- Use `import.meta` for module metadata when supported by the target.
- Make CommonJS interoperability explicit and preserve package conditional exports.
- Use top-level `await` only when module evaluation order and startup behavior permit it.

Run project-configured TypeScript checks. Verify type checking, emitted or bundled module behavior, declaration output when published, and execution through the target ESM loader.
