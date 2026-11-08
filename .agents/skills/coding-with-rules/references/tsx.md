# TSX coding

## Follow the configured TypeScript JSX runtime

Use the [TypeScript JSX documentation](https://www.typescriptlang.org/docs/handbook/jsx.html). Inspect `jsx`, `jsxImportSource`, framework types, bundler configuration, renderer, and test utilities before editing. Do not assume React.

- Use the element, intrinsic-element, property, children, event, and ref types supplied by the configured JSX runtime.
- Preserve public property and component contracts. Prefer inference internally and explicit types at exported boundaries.
- Keep generic component types as narrow as the real callers require.
- Remember that TypeScript types are erased. Validate untrusted data before rendering or passing it to privileged callbacks.
- Keep rendering logic understandable and move complex pure transformations into named, testable functions.
- Follow the framework's lifecycle, ownership, effect, and reactivity rules. Do not transfer conventions from another JSX framework.
- Use normal contextual escaping for rendered text. Validate or allowlist URL schemes and destinations, style values, and spread property names and values before rendering them; escaping does not make these sinks safe.
- Treat raw markup separately. Use raw-markup or escaping-bypass APIs only for a demonstrated need and after context-appropriate sanitization.
- When TSX renders a user interface, preserve semantic structure, labels, keyboard access, focus behavior, and project accessibility checks consistent with [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/).

Run project-configured TypeScript checks. Test observable rendered behavior, runtime validation, and accessibility with the project's framework-aware utilities; do not test only type relationships or serialized implementation structure.
