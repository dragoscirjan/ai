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
- [Agent Skills: using scripts in skills](https://agentskills.io/skill-creation/using-scripts)

## Dependency contract

Load `init-project`, then `coding`, then `coding-gdscript`. Stop when one is unavailable; do not install a missing skill automatically.

The target project uses the Node 24-or-newer and pnpm control plane from `init-project`. The bundled initializer requires Bun with `Bun.TOML.parse`, hard-stops when Bun is unavailable, and does not add Bun to the target project. The generated project-local parser helper remains Node-based. Godot, Python, and uv are mise tools when selected. Python tooling dependencies belong in `pyproject.toml` and `uv.lock`.

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
- `scripts/init.mjs` plans and applies the baseline GDScript tooling contract with Bun without choosing an executable test addon. It imports the shared Bun and Node-compatible standard-library helpers from the required `init-project` skill and generates a project-local per-file Node parser helper.
- `scripts/init.test.js` runs with `bun test` and tests dry-run, approval, idempotence, uv synchronization, Godot-root validation, and conflict behavior.
- `README.md` contains supporting references and invocation notes.
