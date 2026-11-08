# CTS coding

## Preserve TypeScript CommonJS semantics

Use the [TypeScript modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html) and the project's runtime documentation.

- Treat `.cts` as CommonJS. With TypeScript's Node-aware modes, it emits a `.cjs` file and uses `.d.cts` declarations.
- Preserve the configured `module`, `moduleResolution`, and `verbatimModuleSyntax` behavior. Use only module syntax that those settings permit.
- Keep the public export shape compatible with existing CommonJS consumers.
- Use type-only imports and exports without changing required runtime loading.
- Use dynamic `import()` for ESM interoperability when supported, and handle its asynchronous namespace result explicitly.
- Do not add top-level `await`; CommonJS initialization remains synchronous.
- Preserve package `exports` `require` conditions and avoid parallel ESM and CommonJS instances of stateful code.

Run project-configured TypeScript checks. Verify type checking, emitted or bundled CommonJS behavior, declaration output when published, and execution through the target CommonJS loader.
