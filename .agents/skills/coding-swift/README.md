# Swift coding

`coding-swift` adds Swift-specific guidance to the generic [`coding`](../coding/SKILL.md) workflow. It applies to `.swift` files, Swift packages, Xcode projects, platform integration, and Swift build or test work.

## Sources

- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Swift Package Manager documentation](https://docs.swift.org/package-manager/)

The project's Swift language mode, toolchain, SDKs, deployment platforms, package or Xcode configuration, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- `swift build` and `swift test` for Swift Package Manager projects
- project-defined `xcodebuild` schemes and destinations for Xcode projects
- [Swift Testing](https://developer.apple.com/documentation/testing) or XCTest according to the selected toolchain and project
- [swift-format](https://github.com/swiftlang/swift-format)
- [SwiftLint](https://github.com/realm/SwiftLint)
- compiler warnings and concurrency checks at the project's configured strictness
- [jscpd](https://jscpd.dev/) for duplicate detection

Swift has no mature universal dependency-vulnerability audit command. The agent reports that category as unsupported when the project has no suitable service or tool.

Existing project configuration takes precedence. The agent must not install or reconfigure Swift, SDKs, dependencies, Xcode settings, formatters, linters, or tests without human approval. It does not mutate `Package.resolved` or generated project files unless the approved task requires it.

## Dependency contract

`coding-swift` requires `coding`. The agent resolves it through the active harness's advertised skill names and paths, loads it first, and stops when it is unavailable. The skill does not rely on a harness-specific Skill tool.

## Invocation

Pi:

```text
/skill:coding-swift Update this Swift package and run the configured gates.
```

OpenCode:

```text
/coding-swift Update this Swift package and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 27](https://github.com/dragoscirjan/ai/issues/27) for the implementation requirements.
