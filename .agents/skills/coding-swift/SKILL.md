---
name: coding-swift
description: Write, refactor, review, or test Swift with version-compatible APIs, explicit value and reference semantics, safe structured concurrency, controlled interop and unsafe boundaries, platform-aware builds, and project-first quality gates. Use for .swift files, Swift packages, Xcode projects, and Swift build or test work.
compatibility: Requires the coding skill and the Swift toolchain, SDKs, deployment platforms, package or Xcode configuration, and analysis tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Swift coding

Apply the generic `coding` workflow, then apply the Swift-specific rules in this skill.

## Load the dependency

Locate the advertised `coding` skill by exact name and path. If it is not already loaded, read its `SKILL.md` before continuing.

If `coding` is unavailable, stop and ask the human to install or expose it. Do not install it automatically, copy its instructions into this skill, or assume its contents from memory.

## Follow project and Swift guidance

Inspect `Package.swift`, `Package.resolved`, the `swift-tools-version`, Swift and language-mode settings, Xcode projects and workspaces, schemes, build settings, deployment targets, SDKs, conditional compilation, generated sources, formatter and lint configuration, tests, documentation, and CI before editing. Do not update the toolchain, dependencies, resolved versions, deployment targets, generated files, or project settings unless the approved task requires it.

Use [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/), the [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/), and [Swift Package Manager documentation](https://docs.swift.org/package-manager/) as external guidance. Use platform-vendor documentation for framework behavior. Safe, internally consistent project conventions take precedence.

## Write idiomatic Swift

- Target the Swift language mode, toolchain, SDKs, and deployment platforms declared by the project. Guard newer APIs with the project's availability policy.
- Prefer structs and enums for independent values. Use classes and actors when identity, shared lifetime, framework inheritance, or isolation requires them.
- Model absence with optionals and handle it explicitly. Avoid force unwraps, force casts, and implicitly unwrapped optionals unless a locally proven invariant makes failure impossible.
- Follow the project's error policy. Preserve causes and context, keep throwing and nonthrowing contracts deliberate, and do not convert recoverable failures into traps.
- Design protocols and generics around demonstrated contracts. Choose concrete, opaque, or existential types deliberately rather than hiding behavior behind unnecessary abstraction.
- Keep access control as narrow as practical. Follow the API Design Guidelines for public names, call-site clarity, documentation, and semantic behavior.
- Make closure capture and ownership explicit. Break retain cycles and use `unowned` only when lifetime dominance is guaranteed.
- Preserve public API, ABI and library-evolution expectations, package products, Codable formats, persisted data, and supported platforms unless the approved task changes them.

## Use Swift concurrency safely

- Prefer structured concurrency. Give every task an owner, cancellation path, and bounded lifetime; avoid detached tasks unless isolation from the parent is intentional.
- Propagate cancellation and deadlines across async boundaries. Do not block cooperative executors with synchronous waits or long CPU work without an explicit executor boundary.
- Respect actor and global-actor isolation, including UI main-actor requirements. Do not bypass isolation merely to silence diagnostics.
- Treat `Sendable` as a semantic safety contract. Document and review every `@unchecked Sendable` conformance against all reachable mutable state.
- Resume checked continuations exactly once on every path and preserve cancellation when bridging callback APIs.
- Test race-sensitive and reentrant behavior instead of relying on scheduling order or sleeps.

## Enforce Swift security boundaries

- Treat decoded data, URLs, filesystem paths, environment values, notifications, pasteboard or platform-service data, and foreign-language values as untrusted at entry points.
- Validate decoded Codable values after structural decoding. Bound collection sizes, recursion, decompression, retries, and concurrent work for attacker-controlled input.
- Pass subprocess arguments separately through project-approved process APIs. Keep untrusted values out of shell command strings.
- Validate path containment, symbolic links, redirects, outbound-request destinations, and transport security when those boundaries affect safety.
- Keep unsafe pointers within their documented lifetime and alignment. Isolate C, Objective-C, C++, and unmanaged-memory interop behind a reviewed safe interface.
- Store secrets through project-approved platform facilities. Keep credentials and personal data out of source, logs, crash reports, test fixtures, packages, and client-readable resources.

## Test and run Swift gates

Use the project's commands, schemes, destinations, and configured tools first. When the project has no configured choice, ask before installing or configuring these fallbacks:

- `swift build` and `swift test` for Swift Package Manager projects
- project-defined `xcodebuild` schemes, configurations, and destinations for Xcode-owned builds and tests
- [Swift Testing](https://developer.apple.com/documentation/testing) or XCTest according to the project and supported toolchain
- [swift-format](https://github.com/swiftlang/swift-format) for formatting
- [SwiftLint](https://github.com/realm/SwiftLint) for configured lint and analysis rules
- compiler warnings and concurrency checks at the project's configured strictness
- [jscpd](https://jscpd.dev/) as the duplicate detector when the project has no configured alternative

Test observable behavior, errors, cancellation, actor isolation, memory ownership, serialization compatibility, supported platforms, conditional compilation, interop, and security regressions. Do not treat one simulator, architecture, or package build as proof for every declared target.

Swift has no mature universal dependency-vulnerability audit command that applies to every package and project type. Report that category as unsupported when the project has no suitable configured service or tool; do not claim that resolution, compilation, or tests satisfy it.

Apply only project-defined thresholds. Report every applicable gate as passed, failed, not run, or unsupported.
