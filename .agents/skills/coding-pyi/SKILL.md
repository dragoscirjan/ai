---
name: coding-pyi
description: Write, review, or test Python .pyi stub files that accurately describe runtime interfaces, overloads, exports, versions, and platform conditions without adding runtime behavior. Use whenever a .pyi file is changed.
compatibility: Requires the coding and coding-py skills plus the type checker and stub-validation tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Python stub coding

Apply `coding`, then `coding-py`, then this extension-specific guidance.

## Load dependencies

Locate the advertised `coding` and `coding-py` skills by exact name and path. Read their `SKILL.md` files in that order unless they are already loaded.

If either dependency is unavailable, stop and ask the human to install or expose it. Do not install it automatically, duplicate its instructions, or rely on a harness-specific Skill tool.

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

Report each applicable gate as passed, failed, not run, or unsupported. Inherit jscpd and other language-wide gates from `coding-py`; do not duplicate or replace them here.
