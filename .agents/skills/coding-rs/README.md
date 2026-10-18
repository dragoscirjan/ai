# Rust coding

`coding-rs` adds Rust-specific guidance to the generic [`coding`](../coding/SKILL.md) workflow. It applies to `.rs` files, Cargo manifests, workspaces, and Rust build or test work.

## Sources

- [Official Rust Style Guide](https://doc.rust-lang.org/style-guide/)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [The Cargo Book](https://doc.rust-lang.org/cargo/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/) for unsafe and foreign-function boundaries

The project's Rust toolchain, edition, minimum supported Rust version, targets, features, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- `cargo fmt --check` with [rustfmt](https://github.com/rust-lang/rustfmt)
- `cargo check`
- `cargo test`
- `cargo clippy` with [Clippy](https://doc.rust-lang.org/clippy/)
- [`cargo audit`](https://rustsec.org/)
- [`cargo deny`](https://embarkstudios.github.io/cargo-deny/)
- [jscpd](https://jscpd.dev/) for duplicate detection

Existing project configuration takes precedence. The agent must not install or reconfigure tools, components, targets, or policies without human approval. Commands must use the project's target and feature combinations rather than assuming `--all-features` is valid.

## Dependency contract

`coding-rs` requires `coding`. The agent resolves it through the active harness's advertised skill names and paths, loads it first, and stops when it is unavailable. The skill does not rely on a harness-specific Skill tool.

## Invocation

Pi:

```text
/skill:coding-rs Update this Rust crate and run the configured gates.
```

OpenCode:

```text
/coding-rs Update this Rust crate and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 21](https://github.com/dragoscirjan/ai/issues/21) for the implementation requirements.
