---
name: coding-gdscript
description: Write, refactor, review, or test Godot GDScript with engine-version compatibility, explicit scene and resource ownership, safe lifecycle and async behavior, validated game and network data, and project-first quality gates. Use for .gd files and related Godot scene, resource, addon, or project integration work.
compatibility: Requires the coding skill and the Godot engine, renderer, export targets, addons, native extensions, and analysis tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# GDScript coding

Apply the generic `coding` workflow, then apply the GDScript-specific rules in this skill.

## Load the dependency

Locate the advertised `coding` skill by exact name and path. If it is not already loaded, read its `SKILL.md` before continuing.

If `coding` is unavailable, stop and ask the human to install or expose it. Do not install it automatically, copy its instructions into this skill, or assume its contents from memory.

## Follow the Godot project contract

Inspect `project.godot`, the pinned Godot version, renderer and export targets, scene and resource files, autoloads, input actions, addons, native extensions, static-typing policy, formatter and lint settings, tests, import state, and CI before editing. Godot releases can change GDScript syntax and engine APIs; use documentation matching the project's exact supported version.

Use the stable official [GDScript reference](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html), [GDScript style guide](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html), and [static typing guidance](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html) as upstream references when they match the selected engine. Project architecture and version-specific documentation take precedence.

## Write idiomatic GDScript

- Follow the project's typed or dynamic policy. Use static types where they improve contracts and editor feedback without hiding engine-version incompatibility behind broad `Variant` values or unsafe casts.
- Keep scene-tree ownership clear. Know which node creates, adds, removes, queues, and frees each object, and do not retain stale node references after lifecycle changes.
- Use signals for event boundaries when they reduce coupling. Connect and disconnect them according to node lifetime and avoid duplicate connections.
- Use `_process` for frame work and `_physics_process` for fixed-step physics. Apply the appropriate delta and keep per-frame allocation and tree lookup out of hot paths unless profiling justifies it.
- Initialize scene-dependent references at the correct lifecycle point. Treat exported values, autoload state, shared resources, and duplicated resources according to their actual ownership semantics.
- Handle `await`, timers, tweens, deferred calls, and asynchronous signals with cancellation and object-lifetime changes in mind. Verify that captured instances remain valid before use.
- Keep gameplay rules in testable functions or components when practical, and keep rendering, input, audio, persistence, and network side effects at visible boundaries.
- Preserve scene paths, signal contracts, serialized properties, save formats, input actions, and exported behavior unless the approved task changes them.

## Enforce game and engine security boundaries

- Treat save files, configuration, mod data, imported assets, command-line arguments, network packets, RPC arguments, and platform-service data as untrusted at entry points.
- Make multiplayer authority explicit and validate every state-changing RPC on the authoritative peer. Do not trust client-reported identity, position, inventory, timing, or permissions.
- Validate dynamic resource paths and filesystem access. Restrict writes to intended locations and account for path traversal and symlink behavior on supported platforms.
- Do not evaluate untrusted text as GDScript, expressions, shaders, or dynamic calls. Treat addons, editor plugins, resource scripts, and native extensions as executable trusted code.
- Bound parsing, decompression, spawned nodes, queued work, physics objects, and network messages to prevent resource exhaustion.
- Keep secrets and personal data out of exported resources, project settings, logs, crash reports, save files, and client builds.

## Test and run GDScript gates

Use the project's Godot executable, commands, test framework, and configured tools first. When the project has no configured choice, ask before installing or configuring these fallbacks:

- parser, import, and headless project-load checks with the exact supported Godot version
- a test framework verified compatible with the selected Godot version, such as [GdUnit4](https://github.com/MikeSchulze/gdUnit4) or [GUT](https://github.com/bitwes/Gut)
- [`gdformat` and `gdlint`](https://github.com/Scony/godot-gdscript-toolkit) only when gdtoolkit supports the project's GDScript version and configured style
- [jscpd](https://jscpd.dev/) as the duplicate detector when the project has no configured alternative

Test gameplay rules, scene lifecycle, signal connections, invalid data, save compatibility, async cancellation, authoritative multiplayer paths, supported input modes, headless behavior, and export-target-specific logic. Use profiling evidence for performance changes.

GDScript and Godot addons do not have one mature universal dependency-vulnerability audit. Report that category as unsupported when the project has no suitable configured tool; do not claim that parser, linter, or tests satisfy it.

Apply only project-defined thresholds. Report every applicable gate as passed, failed, not run, or unsupported.
