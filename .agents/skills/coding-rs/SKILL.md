---
name: coding-rs
description: Write, refactor, review, or test Rust with explicit ownership, stable invariants, bounded unsafe code, compatible public APIs, supply-chain checks, and project-first quality gates. Use for .rs files, Cargo manifests, and Rust build or test work.
compatibility: Requires the coding skill and the Rust toolchain, targets, build configuration, and analysis tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Rust coding

Apply the generic `coding` workflow, then apply the Rust-specific rules in this skill.

## Load the dependency

Locate the advertised `coding` skill by exact name and path. If it is not already loaded, read its `SKILL.md` before continuing.

If `coding` is unavailable, stop and ask the human to install or expose it. Do not install it automatically, copy its instructions into this skill, or assume its contents from memory.

## Follow the project toolchain and guidance

Inspect `Cargo.toml`, `Cargo.lock`, workspace configuration, `rust-toolchain` files, edition, minimum supported Rust version, features, targets, build scripts, formatter and lint configuration, tests, documentation, and CI before editing. Do not update the toolchain, lockfile, dependencies, or minimum supported Rust version unless the approved task requires it.

Use the [official Rust Style Guide](https://doc.rust-lang.org/style-guide/), [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/), and [Cargo Book](https://doc.rust-lang.org/cargo/) as external guidance. Use [The Rustonomicon](https://doc.rust-lang.org/nomicon/) when reviewing unsafe or foreign-function boundaries. Safe, internally consistent project conventions take precedence.

## Write idiomatic Rust

- Model ownership, borrowing, mutability, and lifetime relationships directly. Do not add cloning, reference counting, interior mutability, or `'static` bounds merely to silence the compiler.
- Prefer clear types and small functions. Use iterators, pattern matching, traits, and generics when they clarify behavior rather than hide control flow.
- Preserve distinctions between absent values and failures. Use project-consistent error types, add actionable context, and reserve panics for violated invariants or the project's documented policy.
- Handle every `Result`, cancellation path, partial operation, and cleanup obligation deliberately. Do not use `unwrap`, `expect`, or unreachable assertions on externally influenced paths without a proven invariant.
- Keep feature flags additive and coherent where possible. Test relevant feature combinations without blindly enabling mutually exclusive features.
- Preserve public API behavior, trait contracts, semver expectations, serialization formats, and minimum supported Rust version unless the approved task changes them.
- Follow the project's `Cargo.lock` policy; application, library, and workspace policies can differ.

## Enforce Rust safety boundaries

- Prefer safe Rust. Keep unavoidable `unsafe` operations in the smallest practical scope behind a safe abstraction.
- State each unsafe block's preconditions and safety invariant. Verify pointer validity, alignment, initialization, aliasing, provenance, layout, and lifetime assumptions at every unsafe boundary.
- Review unsafe trait implementations, especially `Send` and `Sync`, against all reachable state and mutation paths.
- Validate untrusted input at parsing, deserialization, filesystem, network, subprocess, environment, and foreign-function boundaries.
- Pass subprocess arguments separately. Keep untrusted data out of shell command strings and validate path traversal and symlink behavior when security depends on paths.
- Use scoped ownership and project-approved synchronization for concurrency. Avoid holding locks across blocking or asynchronous suspension points unless the design requires it.
- Review dependencies, feature activation, build scripts, procedural macros, and native code as part of the trusted computing base.
- Keep secrets out of logs, panic messages, generated artifacts, and debug output.

## Test and run Rust gates

Use the project's commands and configured tools first. When the project has no configured choice, ask before installing or configuring these fallbacks:

- `cargo fmt --check` with [rustfmt](https://github.com/rust-lang/rustfmt)
- `cargo check` for the project-selected targets and feature sets
- `cargo test` for focused and broader tests
- `cargo clippy` with the project's lint policy and [Clippy configuration](https://doc.rust-lang.org/clippy/)
- [`cargo audit`](https://rustsec.org/) for RustSec advisories
- [`cargo deny`](https://embarkstudios.github.io/cargo-deny/) for project-approved advisory, license, source, and dependency policies
- [jscpd](https://jscpd.dev/) as the duplicate detector when the project has no configured alternative

Test observable behavior, error and panic paths, ownership transitions, boundary values, relevant feature combinations, concurrency, serialization compatibility, and unsafe invariants. Use documentation tests, property tests, fuzzing, interpreters, or sanitizers when the project already supports them or the human approves adding them.

Apply only project-defined thresholds. Report every applicable gate as passed, failed, not run, or unsupported. Never describe a skipped target, feature set, audit, or unsupported platform as passed.
