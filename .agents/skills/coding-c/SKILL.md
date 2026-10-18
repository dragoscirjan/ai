---
name: coding-c
description: Write, refactor, review, or test C source and headers with explicit ownership, checked memory and integer operations, defined behavior, target portability, and project-first quality gates. Use for .c files and for .h files that project and build context identify as C.
compatibility: Requires the coding skill and the C compiler, build system, target, and analysis tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# C coding

Apply the generic `coding` workflow, then apply the C-specific rules in this skill.

## Load the dependency

Locate the advertised `coding` skill by exact name and path. If it is not already loaded, read its `SKILL.md` before continuing.

If `coding` is unavailable, stop and ask the human to install or expose it. Do not install it automatically, copy its instructions into this skill, or assume its contents from memory.

## Confirm C context

Apply this skill to `.c` files. For `.h` files, inspect includers, build configuration, compiler invocations, and public API requirements instead of inferring the language from the extension alone. If a header is shared with C++, preserve the project's C-compatible interface and linkage conventions.

Inspect the build system, compiler and linker flags, declared C standard, target ABI, platform support, generated sources, tests, static-analysis configuration, and CI before editing. Preserve cross-compilation and freestanding constraints when present.

Use the [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard) as the primary external secure-coding reference. Project rules and the selected language standard take precedence when they are explicit and safe.

## Write idiomatic C

- Target the C standard and compiler versions declared by the project. Do not silently raise the minimum language or platform version.
- Keep interfaces narrow. Use opaque types when they reduce coupling and preserve ABI boundaries deliberately.
- Make ownership, borrowing, allocation, transfer, and cleanup responsibilities explicit in names, types, contracts, or nearby documentation.
- Prefer small functions with explicit inputs and outputs. Keep state mutation, I/O, clocks, randomness, and hardware access at clear boundaries.
- Use the correct integer types for the domain. Check narrowing, signedness changes, overflow, and size arithmetic before allocation, indexing, or pointer movement.
- Initialize objects before use. Check return values and preserve useful error information at the layer that can handle it.
- Prefer typed functions and constants over function-like macros. Parenthesize unavoidable macro parameters and avoid evaluating a parameter more than once.
- Preserve public headers, symbol visibility, calling conventions, data layout, and behavior unless the approved task changes them.

## Enforce C safety boundaries

- Validate lengths, indexes, counts, pointers, alignment, and termination before memory access. Check allocation-size multiplication before allocating.
- Track object lifetime and provenance. Do not use freed, uninitialized, out-of-bounds, misaligned, or invalidly aliased storage.
- Avoid undefined and implementation-defined behavior unless the target contract requires and documents it. Pay special attention to signed overflow, shifts, integer conversions, variadic arguments, format strings, and overlapping copies.
- Bound string and buffer operations by known capacities. Do not assume external input is terminated or correctly encoded.
- Release resources on every path. Use one clear cleanup strategy when several resources have partial lifetimes.
- Keep untrusted values out of format strings, shell command strings, file paths, and foreign-function calls without context-specific validation.
- Use project-approved atomics and synchronization for shared state. Keep signal handlers within the platform's documented safe subset.

## Test and run C gates

Use the project's commands and configured tools first. When the project has no configured choice, ask before installing or configuring these fallbacks:

- [CMocka](https://cmocka.org/) for unit tests, using the project's build runner and [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) only when the project uses CMake
- [clang-format](https://clang.llvm.org/docs/ClangFormat.html) for formatting
- compiler warnings at the project's configured level
- [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) and [Cppcheck](https://cppcheck.sourceforge.io/) for complementary static analysis where their checks support the selected C dialect and target
- [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) and [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html), plus other project-supported sanitizers when relevant
- [jscpd](https://jscpd.dev/) as the duplicate detector when the project has no configured alternative
- dependency or package auditing only when the project's dependency format has a mature supported audit path

Test success, boundary values, invalid input, partial initialization, allocation and I/O failure, cleanup, and target-specific behavior. Use fuzzing or property testing when the project already supports it or the human approves adding it.

Apply only project-defined thresholds. Report every applicable gate as passed, failed, not run, or unsupported. A tool's lack of support for the selected dialect, target, or dependency format is an unsupported gate, not a pass.
