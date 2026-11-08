---
name: coding-pyi
description: Write, review, or test Python .pyi stub files that accurately describe runtime interfaces, overloads, exports, versions, and platform conditions without adding runtime behavior. Use whenever a .pyi file is changed.
compatibility: Requires the type checker and stub-validation tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Python stub coding

## Describe the runtime interface

Follow the [typing specification](https://typing.python.org/en/latest/spec/) and the official [stub-writing guide](https://typing.python.org/en/latest/guides/writing_stubs.html), together with the project's supported Python versions and type checker.

- Keep stubs declarative. Do not add runtime implementations, side effects, or executable work beyond conditions permitted for stub files.
- Match runtime module names, exports, decorators, signatures, positional-only and keyword-only parameters, defaults, attributes, inheritance, and exceptions that are part of the typed contract.
- Use overloads only for real call-shape relationships. Prefer precise generics, protocols, and narrow unions over broad `Any` or overlapping overloads.
- Represent runtime defaults with `...` when their value is not part of the type contract.
- Add version and platform conditions only when the runtime interface actually differs. Use syntax and typing features supported by the project's minimum Python and type-checker versions.
- Preserve intentional re-exports and private names according to the package's public API policy.
- Keep the stub and implementation synchronized. Do not make a runtime behavior claim that the implementation or supported extension module does not satisfy.

## Validate stubs

Run the project's configured formatter, type checker, stub linter, and interface-parity checks first. When no parity checker is configured, use `stubtest` only if it is compatible with the selected type checker and package and the human approves any required installation or configuration.

Test representative accepted and rejected type-checking examples when the project has typing tests. Do not treat a clean type-checker result as proof of runtime parity.

Use project duplicate detection, or jscpd when available, and report each applicable check as passed, failed, not run, or unsupported. Do not install missing tools without approval.
