# GDScript initialization

`init-gdscript` adds a Godot and GDScript toolchain to the foundation created by `init-project`.

It pins the selected Godot executable through mise when supported, keeps Python-based tooling in a uv-managed project manifest, integrates formatting, linting, headless validation, tests, exports, and duplicate detection with mise, and reports unsupported addon auditing honestly.

## Sources

- [Godot command-line tutorial](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html)
- [GDScript reference](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html)
- [Godot GDScript Toolkit](https://github.com/Scony/godot-gdscript-toolkit)
- [GdUnit4](https://github.com/godot-gdunit-labs/gdUnit4)
- [GUT](https://github.com/bitwes/Gut)
- [mise registry](https://mise.jdx.dev/registry.html)
- [uv projects](https://docs.astral.sh/uv/concepts/projects/)
- [jscpd](https://jscpd.dev/)

## Dependency contract

Load `init-project`, then `coding`, then `coding-gdscript`. Stop when one is unavailable; do not install a missing skill automatically.

The initializer uses the Node and pnpm control plane from `init-project`. Godot, Python, and uv are mise tools when selected. Python tooling dependencies belong in `pyproject.toml` and `uv.lock`.

## Invocation

Pi:

```text
/skill:init-gdscript
```

OpenCode:

```text
/init-gdscript
```

Direct invocation requests a GDScript initialization plan. Selecting the Godot release, renderer, targets, test framework, and addon source still requires project evidence or human confirmation.

## Files

- `SKILL.md` contains the GDScript initialization workflow.
- `README.md` contains supporting references and invocation notes.
