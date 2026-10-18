---
name: coding-jsx
description: Write, refactor, review, or test .jsx JavaScript with project-defined JSX transforms, safe rendering, accessible user interfaces, and framework-specific conventions without assuming React. Use whenever a .jsx file is changed.
compatibility: Requires the coding and coding-js skills and the JSX transform and runtime selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# JSX coding

Apply `coding`, then `coding-js`, then this extension-specific guidance.

## Load dependencies

Locate the advertised `coding` and `coding-js` skills by exact name and path. Read their `SKILL.md` files in that order unless they are already loaded.

If either dependency is unavailable, stop and ask the human to install or expose it. Do not install it automatically, duplicate its instructions, or rely on a harness-specific Skill tool.

## Follow the configured JSX runtime

Inspect the project's compiler, bundler, JSX import source, framework, rendering target, test utilities, and accessibility rules. JSX transformation semantics are implementation-specific; do not assume React, a browser, or a virtual DOM.

- Use the element, fragment, attribute, and event conventions of the configured runtime.
- Preserve component and property contracts exposed by the project.
- Keep rendering expressions understandable. Move complex transformation and state logic into named functions when that improves testability.
- Preserve framework lifecycle, ownership, and reactivity rules. Do not import patterns from another JSX framework.
- Keep components or render functions pure when the framework expects purity. Put effects at the framework's explicit effect boundaries.
- Treat interpolated values, URLs, style values, and spread properties as untrusted when they cross a trust boundary.
- Rely on the runtime's normal escaping. Use raw markup or bypass APIs only for a demonstrated need and only after context-appropriate sanitization.
- When JSX renders a user interface, use semantic elements, labels, keyboard access, focus behavior, and project accessibility checks consistent with [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/).

Run the inherited JavaScript gates. Test observable rendered behavior and accessibility with the project's framework-aware utilities; do not test only serialized implementation structure.
