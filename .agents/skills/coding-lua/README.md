# Lua coding

`coding-lua` provides Lua-specific guidance independently. It applies to Lua source, modules, native integration, and Lua or LuaJIT build and test work.

## Sources

- The reference manual matching the project's runtime; the [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/manual.html) is linked only as the current upstream Lua reference.
- [LuaRocks Lua Style Guide](https://github.com/luarocks/lua-style-guide)

The project's Lua or LuaJIT version, host environment, module loader, native boundaries, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- [Busted](https://lunarmodules.github.io/busted/)
- [StyLua](https://github.com/JohnnyMorganz/StyLua)
- [Luacheck](https://github.com/lunarmodules/luacheck)
- syntax checking with a compiler or interpreter compatible with the selected runtime
- [jscpd](https://jscpd.dev/) for duplicate detection

Lua does not have one mature universal dependency-vulnerability audit. The agent reports that category as unsupported when the project has no suitable configured tool.

Existing project configuration takes precedence. The agent must not install or reconfigure runtimes, rocks, native dependencies, or tools without human approval.

## Invocation

Pi:

```text
/skill:coding-lua Update this Lua module and run the configured gates.
```

OpenCode:

```text
/coding-lua Update this Lua module and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 23](https://github.com/dragoscirjan/ai/issues/23) for the implementation requirements.
