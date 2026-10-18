# Python stub coding

`coding-pyi` adds `.pyi`-specific declaration and interface-parity guidance. Apply [`coding`](../coding/SKILL.md), then [`coding-py`](../coding-py/SKILL.md), then this wrapper.

## Scope

The wrapper covers only stub-specific concerns:

- declarative stub syntax without runtime behavior
- runtime interface parity
- overloads, generics, exports, defaults, version conditions, and platform conditions
- type-checking examples and compatible stub-parity checks

It inherits Python design, security, testing, dependency, and jscpd guidance from `coding-py` instead of duplicating it.

## Sources

- [Python typing specification](https://typing.python.org/en/latest/spec/)
- [Writing and Maintaining Stub Files](https://typing.python.org/en/latest/guides/writing_stubs.html)

## Dependency contract

`coding-pyi` requires `coding` and `coding-py`. The agent resolves both through advertised skill names and paths, loads them in that order, and stops when either is unavailable. The skill does not rely on a harness-specific Skill tool.

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
