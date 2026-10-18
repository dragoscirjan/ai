# Go coding

`coding-go` adds Go-specific guidance to the generic [`coding`](../coding/SKILL.md) workflow. It applies to `.go` files, modules, workspaces, generators, and Go build or test work.

## Sources

- [Official Go documentation](https://go.dev/doc/)
- [Google Go Style Guide](https://google.github.io/styleguide/go/)
- [Effective Go](https://go.dev/doc/effective_go) as a useful supplementary source that does not cover the complete modern Go ecosystem

The project's Go and toolchain versions, module policy, targets, build tags, generators, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- [gofmt](https://pkg.go.dev/cmd/gofmt)
- `go test`
- `go vet`
- [Staticcheck](https://staticcheck.dev/)
- [govulncheck](https://go.dev/security/vuln/)
- `go mod verify`
- [jscpd](https://jscpd.dev/) for duplicate detection; a project-configured Go-specific detector such as `dupl` still takes precedence

Existing project configuration takes precedence. The agent must not install or reconfigure Go, modules, tools, generators, or policies without human approval. Mutating commands such as `go mod tidy` and `go generate` run only when the approved task requires their outputs.

## Dependency contract

`coding-go` requires `coding`. The agent resolves it through the active harness's advertised skill names and paths, loads it first, and stops when it is unavailable. The skill does not rely on a harness-specific Skill tool.

## Invocation

Pi:

```text
/skill:coding-go Update this Go package and run the configured gates.
```

OpenCode:

```text
/coding-go Update this Go package and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 25](https://github.com/dragoscirjan/ai/issues/25) for the implementation requirements.
