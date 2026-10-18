# GDScript coding

`coding-gdscript` adds Godot GDScript guidance to the generic [`coding`](../coding/SKILL.md) workflow. It applies to `.gd` files and related scenes, resources, addons, native integration, and project behavior.

## Sources

Use official documentation matching the project's exact Godot version. Current stable references are:

- [GDScript reference](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html)
- [GDScript style guide](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html)
- [Static typing in GDScript](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html)

The project's Godot version, renderer, export targets, architecture, addons, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- parser, import, and headless project-load checks with the exact supported Godot version
- a compatible test framework such as [GdUnit4](https://github.com/MikeSchulze/gdUnit4) or [GUT](https://github.com/bitwes/Gut)
- [`gdformat` and `gdlint`](https://github.com/Scony/godot-gdscript-toolkit) only when compatible with the selected GDScript version
- [jscpd](https://jscpd.dev/) for duplicate detection

Godot addons do not have one mature universal dependency-vulnerability audit. The agent reports that category as unsupported when the project has no suitable configured tool.

Existing project configuration takes precedence. The agent must not install or reconfigure Godot, addons, native extensions, test frameworks, or analysis tools without human approval.

## Dependency contract

`coding-gdscript` requires `coding`. The agent resolves it through the active harness's advertised skill names and paths, loads it first, and stops when it is unavailable. The skill does not rely on a harness-specific Skill tool.

## Invocation

Pi:

```text
/skill:coding-gdscript Update this Godot gameplay system and run the configured gates.
```

OpenCode:

```text
/coding-gdscript Update this Godot gameplay system and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 25](https://github.com/dragoscirjan/ai/issues/25) for the implementation requirements.
