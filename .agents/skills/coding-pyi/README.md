# Python stub coding

`coding-pyi` adds `.pyi`-specific declaration and interface-parity guidance. It is independent of other skill instructions.

## Scope

The skill focuses on stub-specific concerns:

- declarative stub syntax without runtime behavior
- runtime interface parity
- overloads, generics, exports, defaults, version conditions, and platform conditions
- type-checking examples and compatible stub-parity checks

## Sources

- [Python typing specification](https://typing.python.org/en/latest/spec/)
- [Writing and Maintaining Stub Files](https://typing.python.org/en/latest/guides/writing_stubs.html)

## Invocation

Pi:

```text
/skill:coding-pyi Update this Python stub and verify runtime parity.
```

OpenCode:

```text
/coding-pyi Update this Python stub and verify runtime parity.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents scope and composition.

See [issue 23](https://github.com/dragoscirjan/ai/issues/23) for the implementation requirements.
