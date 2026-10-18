# Zig coding

`coding-zig` adds Zig-specific guidance to the generic [`coding`](../coding/SKILL.md) workflow. It applies to `.zig` files, `build.zig`, `build.zig.zon`, and Zig build or package work.

## Sources

- [Official Zig language reference](https://ziglang.org/documentation/master/)
- [Official Zig style guide](https://ziglang.org/documentation/master/#Style-Guide)
- [Official Zig build-system guide](https://ziglang.org/learn/build-system/)

The `master` documentation describes current upstream Zig and can differ from released compilers. The project's compiler version, matching documentation, targets, safety modes, build configuration, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- `zig fmt --check`
- `zig build`
- `zig test`, or the project's `zig build test` step
- [jscpd](https://jscpd.dev/) for duplicate detection

Zig does not have one mature universal dependency-audit or separate static-analysis fallback. The agent reports those categories as unsupported when the project has no suitable configured tool. It does not treat compilation or tests as equivalent gates.

Existing project configuration takes precedence. The agent must not install or reconfigure Zig, dependencies, or tools without human approval.

## Dependency contract

`coding-zig` requires `coding`. The agent resolves it through the active harness's advertised skill names and paths, loads it first, and stops when it is unavailable. The skill does not rely on a harness-specific Skill tool.

## Invocation

Pi:

```text
/skill:coding-zig Update this Zig package and run the configured gates.
```

OpenCode:

```text
/coding-zig Update this Zig package and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 21](https://github.com/dragoscirjan/ai/issues/21) for the implementation requirements.
