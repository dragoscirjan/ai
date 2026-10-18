---
name: coding-zig
description: Write, refactor, review, or test Zig with explicit allocation and ownership, checked low-level operations, complete cleanup and error paths, compiler-version compatibility, and project-first quality gates. Use for .zig files and Zig build or package work.
compatibility: Requires the coding skill and the Zig compiler, targets, build configuration, and analysis tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Zig coding

Apply the generic `coding` workflow, then apply the Zig-specific rules in this skill.

## Load the dependency

Locate the advertised `coding` skill by exact name and path. If it is not already loaded, read its `SKILL.md` before continuing.

If `coding` is unavailable, stop and ask the human to install or expose it. Do not install it automatically, copy its instructions into this skill, or assume its contents from memory.

## Follow the project toolchain and guidance

Inspect `build.zig`, `build.zig.zon`, compiler-version declarations, dependency hashes, targets, optimization and safety modes, generated sources, formatter settings, tests, documentation, and CI before editing. Zig evolves quickly; use the documentation that matches the project's compiler version. Do not update the compiler, dependencies, package metadata, or build graph unless the approved task requires it.

Use the [official Zig language reference](https://ziglang.org/documentation/master/) and its [style guide](https://ziglang.org/documentation/master/#Style-Guide) as current upstream guidance, but adapt syntax and APIs to the project's selected compiler version. Use the [official build-system guide](https://ziglang.org/learn/build-system/) when changing build logic. Safe, internally consistent project conventions take precedence.

## Write idiomatic Zig

- Make allocation and ownership explicit. Pass allocators through the interfaces that need them and document who frees returned memory.
- Pair acquired resources with `defer` or `errdefer` at the point where ownership becomes established. Verify cleanup order and success-path ownership transfer.
- Use slices, optionals, error unions, and tagged unions to represent valid states. Do not replace recoverable errors with panics or `unreachable` without a proven invariant.
- Keep error sets and public contracts deliberate. Add context at boundaries without discarding the original failure.
- Prefer small functions with explicit inputs and outputs. Isolate I/O, global state, clocks, randomness, and platform APIs.
- Keep `comptime` work deterministic and bounded. Do not move runtime complexity to compile time without a demonstrated benefit.
- Preserve public APIs, exported ABI, data layout, package metadata, and observable behavior unless the approved task changes them.

## Enforce Zig safety boundaries

- Validate lengths, indexes, casts, alignments, sentinel assumptions, and arithmetic before memory access, allocation, or pointer movement.
- Initialize storage before reading it. Keep the lifetime and provenance of pointers and slices explicit, especially across reallocations and foreign calls.
- Minimize and isolate pointer casts, manual layout manipulation, unchecked arithmetic, and disabled runtime-safety checks. State the invariant that makes each use valid.
- Handle out-of-memory, partial initialization, I/O failure, and cleanup paths deliberately; do not assume allocation succeeds.
- Validate untrusted input at parsing, serialization, filesystem, network, subprocess, environment, and C ABI boundaries.
- Pass subprocess arguments separately and keep untrusted data out of shell command strings. Validate path traversal and symlink behavior when security depends on paths.
- Use project-approved synchronization and atomics for shared state. Make thread-safety and allocator-sharing contracts explicit.
- Keep secrets out of logs, panic messages, generated artifacts, and debug output.

## Test and run Zig gates

Use the project's commands and configured tools first. When the project has no configured choice, ask before installing or configuring these fallbacks:

- `zig fmt --check` for formatting
- `zig build` for the project-selected target and optimization mode
- `zig test` for directly testable source files, or the project's `zig build test` step when the build graph owns test configuration
- [jscpd](https://jscpd.dev/) as the duplicate detector when the project has no configured alternative

Treat compiler diagnostics and runtime safety checks as required inputs, not substitutes for tests. Zig does not have one mature universal dependency-audit or separate static-analysis fallback. Report those categories as unsupported when the project has no configured suitable tool; do not claim that compilation or tests satisfy them.

Test observable behavior, error and panic paths, allocation failure where supported, boundary values, cleanup, target-specific behavior, concurrency where relevant, and C interoperability. Use fuzzing, sanitizers, or other analysis only when the selected toolchain and project support them or the human approves adding them.

Apply only project-defined thresholds. Report every applicable gate as passed, failed, not run, or unsupported. Never describe an untested target, optimization or safety mode, audit category, or unsupported platform as passed.
