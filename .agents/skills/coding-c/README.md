# C coding

`coding-c` adds C-specific guidance to the generic [`coding`](../coding/SKILL.md) workflow. It applies to `.c` files and to `.h` files that the project's build and usage context identify as C.

## Source

- [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard) is the primary external secure-coding reference.

The project's selected C standard, target constraints, build configuration, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- [CMocka](https://cmocka.org/), with [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) when the project uses CMake
- [clang-format](https://clang.llvm.org/docs/ClangFormat.html)
- compiler warnings at the project's configured level
- [clang-tidy](https://clang.llvm.org/extra/clang-tidy/)
- [Cppcheck](https://cppcheck.sourceforge.io/)
- [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) and [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html), plus other relevant project-supported sanitizers
- [jscpd](https://jscpd.dev/) for duplicate detection
- a dependency audit only when the project's dependency format has a mature supported audit path

Existing project configuration takes precedence. The agent must not install or reconfigure these tools without human approval. Tool support must match the selected C dialect and target.

## Dependency contract

`coding-c` requires `coding`. The agent resolves it through the active harness's advertised skill names and paths, loads it first, and stops when it is unavailable. The skill does not rely on a harness-specific Skill tool.

C and C++ remain independent. This skill does not load `coding-cpp`.

## Invocation

Pi:

```text
/skill:coding-c Update this C module and run the configured gates.
```

OpenCode:

```text
/coding-c Update this C module and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 19](https://github.com/dragoscirjan/ai/issues/19) for the implementation requirements.
