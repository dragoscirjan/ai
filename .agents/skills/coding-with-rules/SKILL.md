---
name: coding-with-rules
description: Design, implement, refactor, review, or test code using the coding workflow plus on-demand language and file-extension rules. Use for source code and related toolchain, build, or test work in any language.
require: ["coding"]
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Coding with rules

Select languages from task files and project, runtime, build, and interpreter evidence—not filenames alone. For toolchain or configuration work, use the associated language's rules. Do not load every reference in a mixed-language repository.

Before designing, changing, reviewing, or testing code, read the applicable references below in listed order, including each document's linked prerequisites first. Read each document only once per task. Stop if a prerequisite is missing or cyclic. For multiple affected languages, apply each relevant set.

References add only language/extension rules and tool defaults. The required `coding` skill owns project inspection, shared security controls, testing workflow, quality-gate ordering, duplicate detection, installation approval, and reporting. Project-configured tools override reference defaults.

| Language or file context | References, in order |
|---|---|
| `.js`, JavaScript | [js](references/js.md) |
| `.mjs` | [js](references/js.md), [mjs](references/mjs.md) |
| `.cjs` | [js](references/js.md), [cjs](references/cjs.md) |
| `.jsx` | [js](references/js.md), [jsx](references/jsx.md) |
| `.ts`, TypeScript | [ts](references/ts.md) |
| `.mts` | [ts](references/ts.md), [mts](references/mts.md) |
| `.cts` | [ts](references/ts.md), [cts](references/cts.md) |
| `.tsx` | [ts](references/ts.md), [tsx](references/tsx.md) |
| `.c`, C headers | [c](references/c.md) |
| C++ source, headers, modules | [cpp](references/cpp.md) |
| `.gd`, Godot GDScript | [gdscript](references/gdscript.md) |
| `.go`, Go | [go](references/go.md) |
| `.lua`, Lua | [lua](references/lua.md) |
| `.php`, PHP | [php](references/php.md) |
| `.py`, Python | [py](references/py.md) |
| `.pyi` | [py](references/py.md), [pyi](references/pyi.md) |
| `.rs`, Rust | [rs](references/rs.md) |
| POSIX shell | [sh](references/sh.md) |
| Bash, including `.sh` with Bash interpreter evidence | [bash](references/bash.md) |
| `.swift`, Swift | [swift](references/swift.md) |
| `.zig`, Zig | [zig](references/zig.md) |

Resolve ambiguous headers and shell dialects from project evidence; ask if unresolved. Use Bash or POSIX guidance as appropriate, not contradictory dialect rules together. Stop on conflicting interpreter evidence or if a mapped reference is missing; do not substitute another language.

For an unsupported language, continue with the base coding workflow and project conventions. State that no language-specific reference exists; do not invent rules.
