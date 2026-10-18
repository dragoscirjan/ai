---
name: coding-go
description: Write, refactor, review, or test Go with explicit errors and contexts, bounded goroutine lifetimes, clear package APIs, compatible modules and targets, supply-chain checks, and project-first quality gates. Use for .go files, modules, workspaces, generators, and Go build or test work.
compatibility: Requires the coding skill and the Go toolchain, modules, targets, generators, and analysis tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Go coding

Apply the generic `coding` workflow, then apply the Go-specific rules in this skill.

## Load the dependency

Locate the advertised `coding` skill by exact name and path. If it is not already loaded, read its `SKILL.md` before continuing.

If `coding` is unavailable, stop and ask the human to install or expose it. Do not install it automatically, copy its instructions into this skill, or assume its contents from memory.

## Follow project and Go guidance

Inspect `go.mod`, `go.sum`, `go.work`, `toolchain` and Go version directives, build tags, supported targets, generators, formatting and analysis configuration, tests, documentation, and CI before editing. Do not update the toolchain, module graph, checksums, generated files, or minimum Go version unless the approved task requires it.

Use current [official Go documentation](https://go.dev/doc/) and the [Google Go Style Guide](https://google.github.io/styleguide/go/) as external guidance. [Effective Go](https://go.dev/doc/effective_go) remains useful but explicitly does not cover the complete modern Go ecosystem. Safe, internally consistent project conventions take precedence.

## Write idiomatic Go

- Target the Go and toolchain versions declared by the project. Respect build constraints, platform-specific files, cgo policy, and generated-code ownership.
- Keep packages cohesive and APIs small. Define interfaces where they are consumed when that reduces coupling; do not introduce interfaces only for hypothetical substitution.
- Design useful zero values where practical. Make ownership, mutation, aliasing, and nil behavior explicit for slices, maps, pointers, channels, and function values.
- Return errors with actionable context and preserve identity with wrapping when callers use `errors.Is` or `errors.As`. Do not log and return the same failure without a deliberate ownership boundary.
- Accept `context.Context` at operation boundaries, propagate it, and honor cancellation and deadlines. Do not store a context unless the API contract specifically requires it.
- Give every goroutine an owner, termination condition, and cancellation path. Define who closes channels; receivers must not close channels they do not own.
- Use synchronization that makes invariants clear. Do not rely on scheduling, sleeps, or map behavior for correctness.
- Preserve exported API behavior, wire formats, command flags, error contracts, and module compatibility unless the approved task changes them.

## Enforce Go security boundaries

- Treat decoded data, requests, environment values, filesystem paths, templates, database values, module data, and foreign-function results as untrusted at entry points.
- Bound request bodies, decoding, decompression, recursion, allocation, retries, and concurrency for attacker-controlled workloads.
- Parameterize database queries. Use context-appropriate escaping and safe standard-library templates for generated output.
- Pass subprocess arguments separately with `exec.Command` or its context-aware equivalent. Keep untrusted values out of shell command strings.
- Validate path containment, archive entries, symlinks, redirects, and outbound-request destinations when security depends on them.
- Configure HTTP clients and servers with project-appropriate timeouts, limits, TLS settings, and shutdown behavior.
- Keep credentials and personal data out of source, logs, errors, traces, test snapshots, binaries, and generated artifacts.
- Review direct and transitive modules, replacements, generators, cgo libraries, and tool dependencies as part of the trusted computing base.

## Test and run Go gates

Use the project's commands and configured tools first. When the project has no configured choice, ask before installing or configuring these fallbacks:

- [gofmt](https://pkg.go.dev/cmd/gofmt) for formatting
- `go test` for focused and broader tests, with the race detector, fuzzing, coverage, build tags, and target matrix only where the project supports them
- `go vet` for standard analysis
- [Staticcheck](https://staticcheck.dev/) for additional static analysis
- [govulncheck](https://go.dev/security/vuln/) for Go vulnerability analysis
- `go mod verify` for downloaded module-content verification
- [jscpd](https://jscpd.dev/) as the duplicate detector when the project has no configured alternative; honor a project-selected Go-specific detector such as `dupl`

Do not run mutating module or generator commands such as `go mod tidy`, dependency upgrades, or `go generate` unless the task requires their outputs. Inspect generated changes before keeping them.

Test observable behavior, error and cancellation paths, nil and zero values, goroutine termination, race-sensitive logic, supported build tags and targets, serialization compatibility, and security regressions.

Apply only project-defined thresholds. Report every applicable gate as passed, failed, not run, or unsupported. Never describe an unchecked target, build-tag set, module graph, race condition, or unavailable audit as passed.
