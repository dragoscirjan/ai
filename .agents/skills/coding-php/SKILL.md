---
name: coding-php
description: Write, refactor, review, or test PHP with version-compatible types and APIs, explicit request and resource boundaries, context-specific web security, Composer supply-chain checks, and project-first quality gates. Use for PHP source, templates, Composer packages, and PHP build or test work.
compatibility: Requires the coding skill and the PHP runtime, extensions, Composer platform, framework, and analysis tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# PHP coding

Apply the generic `coding` workflow, then apply the PHP-specific rules in this skill.

## Load the dependency

Locate the advertised `coding` skill by exact name and path. If it is not already loaded, read its `SKILL.md` before continuing.

If `coding` is unavailable, stop and ask the human to install or expose it. Do not install it automatically, copy its instructions into this skill, or assume its contents from memory.

## Follow project and language guidance

Inspect `composer.json`, `composer.lock`, PHP platform constraints, required extensions, autoloading, framework configuration, formatter and static-analysis settings, tests, templates, database layers, deployment targets, and CI before editing. Do not update dependencies, lockfiles, platform constraints, or generated autoload files unless the approved task requires it.

Use the [official PHP Manual](https://www.php.net/manual/en/) and current [PHP-FIG PER Coding Style](https://www.php-fig.org/per/coding-style/) as external guidance. Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) only when project configuration or compatibility requires it. Safe framework and project conventions take precedence.

## Write idiomatic PHP

- Target the PHP versions and extensions declared by the project. Do not use unsupported syntax, types, attributes, or library APIs.
- Follow the project's `strict_types` policy consistently. Use parameter, property, and return types where they clarify contracts without breaking compatibility.
- Prefer clear value flow, immutable value objects where useful, and explicit dependencies. Keep request state, globals, clocks, randomness, I/O, and service containers at visible boundaries.
- Preserve distinctions among `null`, `false`, empty strings, zero, and missing array keys. Avoid loose comparisons where coercion can change meaning.
- Use exceptions and result conventions consistently with the framework. Preserve causes and release resources or roll back transactions on every failure path.
- Use Composer autoloading and project namespaces. Avoid manual include paths, dynamic class names, and runtime code generation unless the architecture requires them.
- Preserve public APIs, named-argument compatibility, serialized data, routes, templates, database migrations, and package behavior unless the approved task changes them.

## Enforce PHP security boundaries

- Treat superglobals, request bodies, headers, cookies, uploaded files, environment values, database records, and deserialized data as untrusted at entry points.
- Parameterize database queries. Do not build SQL, shell commands, or code from untrusted strings.
- Apply context-specific escaping for HTML text, attributes, JavaScript, CSS, URLs, and headers. Template autoescaping does not make every output context safe.
- Validate redirect and outbound-request destinations to prevent open redirects and server-side request forgery. Reject header injection.
- Validate upload size, media expectations, generated storage names, and path containment. Keep uploaded files outside executable locations.
- Avoid deserializing untrusted PHP objects. Treat `unserialize`, dynamic includes, reflection-driven construction, and user-controlled callbacks as code-execution boundaries.
- Use framework protections for sessions, authentication, authorization, CSRF, and secure cookies. Keep authorization checks at every protected action, not only in the UI.
- Use timing-safe comparison for secrets where applicable, and keep credentials and personal data out of source, logs, errors, caches, and generated artifacts.

## Test and run PHP gates

Use the project's commands and configured tools first. When the project has no configured choice, ask before installing or configuring these fallbacks:

- `php -l` for syntax checking with the project's PHP version
- [PHPUnit](https://phpunit.de/documentation.html) for focused and broader tests
- [PHP-CS-Fixer](https://cs.symfony.com/) in check or dry-run mode for formatting
- [PHPStan](https://phpstan.org/user-guide/getting-started) at the project's configured level for static analysis
- `composer validate` when package metadata changes
- `composer audit` for dependency vulnerability auditing
- [jscpd](https://jscpd.dev/) as the duplicate detector when the project has no configured alternative

Test observable behavior, invalid requests, authorization, encoding contexts, exception and rollback paths, supported PHP versions, database behavior, templates, CLI behavior, and security regressions. Use the project's framework test harness when it owns bootstrapping or isolation.

Apply only project-defined thresholds and static-analysis levels. Report every applicable gate as passed, failed, not run, or unsupported. Never describe an unchecked PHP version, extension set, database, route, or unavailable audit as passed.
