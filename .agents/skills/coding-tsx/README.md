# TSX coding

`coding-tsx` adds `.tsx` typing, transform, rendering, security, and accessibility guidance to [`coding-ts`](../coding-ts/SKILL.md) and the generic [`coding`](../coding/SKILL.md) workflow.

The skill does not assume React. It follows the TypeScript JSX mode, import source, framework, renderer, and test utilities configured by the project.

## Scope

- JSX element and property typing
- exported component contracts
- runtime validation at rendering boundaries
- framework-specific lifecycle and effects
- safe rendering and raw-markup boundaries
- semantic and accessible user interfaces
- rendered-behavior tests

References:

- [TypeScript JSX documentation](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [WCAG overview](https://www.w3.org/WAI/standards-guidelines/wcag/)

## Dependencies

Load `coding`, `coding-ts`, and `coding-tsx` in that order. All are sibling skills. Stop when a dependency is unavailable; do not install it automatically.

## Invocation

- Pi: `/skill:coding-tsx`
- OpenCode: `/coding-tsx`

See [issue 17](https://github.com/dragoscirjan/ai/issues/17) for the implementation requirements.
