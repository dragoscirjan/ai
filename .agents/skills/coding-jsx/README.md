# JSX coding

`coding-jsx` adds `.jsx` transform, rendering, security, and accessibility guidance to [`coding-js`](../coding-js/SKILL.md) and the generic [`coding`](../coding/SKILL.md) workflow.

The skill does not assume React. It follows the JSX runtime, framework, compiler, renderer, and test utilities configured by the project.

## Scope

- configured JSX transforms and import sources
- framework-specific lifecycle and reactivity
- safe interpolation and raw-markup boundaries
- semantic and accessible rendered interfaces
- rendered-behavior tests

Use the [WCAG overview](https://www.w3.org/WAI/standards-guidelines/wcag/) when JSX targets web user interfaces.

## Dependencies

Load `coding`, `coding-js`, and `coding-jsx` in that order. All are sibling skills. Stop when a dependency is unavailable; do not install it automatically.

## Invocation

- Pi: `/skill:coding-jsx`
- OpenCode: `/coding-jsx`

See [issue 17](https://github.com/dragoscirjan/ai/issues/17) for the implementation requirements.
