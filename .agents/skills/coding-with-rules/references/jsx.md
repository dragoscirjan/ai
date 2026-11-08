# JSX coding

## Follow the configured JSX runtime

Inspect the project's compiler, bundler, JSX import source, framework, rendering target, test utilities, and accessibility rules. JSX transformation semantics are implementation-specific; do not assume React, a browser, or a virtual DOM.

- Use the element, fragment, attribute, and event conventions of the configured runtime.
- Preserve component and property contracts exposed by the project.
- Keep rendering expressions understandable. Move complex transformation and state logic into named functions when that improves testability.
- Preserve framework lifecycle, ownership, and reactivity rules. Do not import patterns from another JSX framework.
- Keep components or render functions pure when the framework expects purity. Put effects at the framework's explicit effect boundaries.
- Treat interpolated values as untrusted when they cross a trust boundary. Use the runtime's normal contextual escaping for rendered text.
- Validate or allowlist URL schemes and destinations, style values, and spread property names and values before rendering them. Normal JSX escaping does not make these sinks safe.
- Treat raw markup separately. Use raw-markup or escaping-bypass APIs only for a demonstrated need and only after context-appropriate sanitization.
- When JSX renders a user interface, use semantic elements, labels, keyboard access, focus behavior, and project accessibility checks consistent with [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/).

Run project-configured JavaScript checks. Test observable rendered behavior and accessibility with the project's framework-aware utilities; do not test only serialized implementation structure.
