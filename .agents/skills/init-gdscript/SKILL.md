---
name: init-gdscript
description: Initialize or adopt a Godot GDScript toolchain on the init-project foundation with pinned engine tooling, gdtoolkit validation, optional compatible tests, and mise task integration. Use when adding GDScript to a new or existing Godot project.
compatibility: Requires the init-project, coding, and coding-gdscript skills, the Node 24-or-newer target control plane, a selected Godot version, and Bun with Bun.TOML.parse to run the bundled helper. Hard-stops when Bun is unavailable.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# GDScript initialization

Add Godot and GDScript tooling to the repository-wide foundation from `init-project`. Keep every generated command compatible with the project's exact Godot version.

## Load the dependencies

Locate the advertised `init-project`, `coding`, and `coding-gdscript` skills by exact name and path. Read their `SKILL.md` files in that order if they are not already loaded.

If any dependency is unavailable, stop and ask the human to install or expose it. Do not install a missing skill, duplicate its instructions, or infer it from memory.

## Inspect the Godot contract

Confirm that the `init-project` foundation exists or run its planning workflow first. Inspect `project.godot`, engine metadata, renderer, export presets, target platforms, source and addon paths, native extensions, autoloads, existing Python tooling, tests, CI, and import policy.

Determine from project evidence or ask when unresolved:

- exact supported Godot release and distribution
- renderer and export targets
- application or reusable addon
- source, test, generated, imported, vendored, and addon paths
- GdUnit4, GUT, another test framework, or no framework yet
- whether gdtoolkit supports the selected GDScript version
- whether CI can run Godot headlessly

Do not initialize over a project that targets an incompatible Godot major. Do not import, rewrite, or upgrade scenes and resources merely to inspect them.

## Present the GDScript plan

Before mutation, add the GDScript-specific changes to the approved project plan:

- mise tools and selected versions
- Python tooling manifest changes when gdtoolkit is selected
- package and mise scripts
- Godot project, addon, test, and export changes
- downloaded addons or archives with version and integrity source
- commands that install tools, import assets, run the editor, or update lockfiles

Treat Godot addons, editor plugins, and native extensions as executable code. Approval granted to `init-project` covers only the shared foundation. Present the complete GDScript plan and wait for separate explicit approval before writing configuration, changing manifests, installing tools, downloading addons, or enabling executable content.

## Run the bundled initializer

Use the tested helper in [`scripts/init.mjs`](scripts/init.mjs) for the baseline Godot, Python, uv, gdtoolkit, and task setup. Run commands from this skill directory and pass the absolute Godot project root. Bun runs the initializer only; it is not added to the target project's toolchain or generated GDScript parser helper.

Before any invocation, require Bun and hard-stop if it is unavailable:

```sh
command -v bun >/dev/null 2>&1 || { echo "Bun is required to run init-gdscript." >&2; exit 1; }
```

Inspect its interface and generate a non-mutating JSON plan:

```text
bun scripts/init.mjs --help
bun scripts/init.mjs --root /absolute/game --godot 4.7.2-stable --python 3.13.13 --uv 0.11.25 --source game
```

After the human approves the complete GDScript plan, apply it. Add `--install` only when mise and uv changes are also approved:

```text
bun scripts/init.mjs --root /absolute/game --godot 4.7.2-stable --python 3.13.13 --uv 0.11.25 --source game --apply --confirm --install
```

With `--install`, the helper re-trusts the approved `mise.toml` after adding GDScript tools and tasks; include that user-level trust-store change in the approval. The helper intentionally does not choose or download a test addon. Configure GdUnit4, GUT, or another executable addon only through the separately approved framework plan below.

## Put each dependency in the right place

Use mise for standalone executable toolchains that have no project manifest entry:

- the exact selected [`godot`](https://mise.jdx.dev/registry.html) release when the mise registry supports the required platform and distribution
- Python and [`uv`](https://docs.astral.sh/uv/) when Python-based GDScript tooling is selected

Use a Python project manifest and uv lockfile for Python dependencies. When no Python manifest exists and gdtoolkit is approved, propose a minimal tooling-only `pyproject.toml` and add [`gdtoolkit`](https://github.com/Scony/godot-gdscript-toolkit) as a development dependency with uv. Do not put gdtoolkit in mise when the project can lock it in `pyproject.toml` and `uv.lock`.

Godot test addons do not have one universal package manifest. When the project selects [GdUnit4](https://github.com/godot-gdunit-labs/gdUnit4), [GUT](https://github.com/bitwes/Gut), or another addon, pin a compatible release or commit and use its documented installation method. Verify downloaded archives against an authoritative checksum or recorded digest when practical. Never track an unpinned branch as the reproducible install source.

Preserve existing addon managers and vendoring policy. Do not install a second mechanism without approval.

## Add scripts and mise tasks

Use project scripts and mise tasks together without recursion. A project that already uses the shared `package.json` may expose convenience scripts there; mise remains the stable cross-language entry point.

Add namespaced implementations as applicable:

- `deps:sync:gdscript`: run `uv sync --locked` and append it to the public `deps:sync` dependencies
- `lint:gdscript`: run `gdlint` on first-party GDScript
- `lint:fix:gdscript`: add only when an approved tool offers a safe, inspectable fix
- `format:gdscript`: run `gdformat --check`
- `format:fix:gdscript`: run `gdformat` in write mode
- `typecheck:gdscript`: run the selected Godot parser or headless project-load check
- `test:gdscript`: run the selected test framework non-interactively
- `build:gdscript`: validate or build configured export presets
- `code-duplicate:gdscript`: extend the project jscpd scope to first-party `.gd` files when the shared duplicate task does not already cover them

Append these implementations to the public tasks created by `init-project`. Preserve all existing language tasks and command semantics. Keep `lint`, `format`, `typecheck`, `test`, `build`, and `code-duplicate` non-mutating; only explicit `:fix` tasks may write source files.

Exclude `.godot`, imported assets, generated files, vendored addons, caches, and build outputs according to the actual project layout. Do not exclude first-party code merely to make a gate pass.

Apply only project-defined thresholds. Do not invent duplication or coverage percentages.

## Handle unsupported audit coverage honestly

Keep the project-wide pnpm audit for Node-hosted tooling. Audit any additional manifest-owned tooling with its owning ecosystem when a suitable project-configured command exists.

Godot and GDScript addons do not have one mature universal dependency-vulnerability audit. Report addon audit coverage as unsupported when no suitable configured tool exists. Do not claim that linting, parser checks, pinned versions, or tests constitute a vulnerability audit.

## Use helpers without hiding changes

Prefer the bundled helper for its supported baseline. Any replacement or additional Bun or Python initializer helper must follow the `init-project` helper-script contract. The generated project-local Godot parser helper remains Node-based because Node belongs to the target control plane.

For downloaded addons, a helper must pin the source, verify the expected archive or content digest when available, extract only into the approved destination, reject path traversal, and avoid executing downloaded code during installation. Keep credentials out of download URLs, environment output, and generated files.

Do not hand-edit `uv.lock`, `pnpm-lock.yaml`, or mise lock data.

## Verify initialization

After approved changes:

1. Synchronize mise, pnpm, uv, and approved addon dependencies through their owning tools.
2. Confirm the actual Godot executable version matches the project contract.
3. Run gdformat check and gdlint only when gdtoolkit declares compatibility with that GDScript version.
4. Run a headless parser, import, or project-load check with isolated writable editor state where CI or the environment requires it.
5. Run the configured GDScript tests and export validation when present.
6. Run duplicate detection and every other applicable aggregate gate.
7. Run `mise run validate` and review the complete diff, generated metadata, ignored paths, and lockfile changes.

Report each gate as passed, failed, not run, or unsupported. Never claim that an unavailable test framework, export target, graphical path, platform SDK, or addon audit passed.
