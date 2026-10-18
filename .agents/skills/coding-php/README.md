# PHP coding

`coding-php` adds PHP-specific guidance to the generic [`coding`](../coding/SKILL.md) workflow. It applies to PHP source, templates, Composer packages, framework code, and PHP build or test work.

## Sources

- [Official PHP Manual](https://www.php.net/manual/en/)
- [PHP-FIG PER Coding Style](https://www.php-fig.org/per/coding-style/)
- [PSR-12](https://www.php-fig.org/psr/psr-12/) only when project configuration or compatibility requires it

The project's PHP version, extensions, Composer platform, framework, formatter, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- `php -l`
- [PHPUnit](https://phpunit.de/documentation.html)
- [PHP-CS-Fixer](https://cs.symfony.com/) in check or dry-run mode
- [PHPStan](https://phpstan.org/user-guide/getting-started) at the project's configured level
- `composer validate` when package metadata changes
- `composer audit`
- [jscpd](https://jscpd.dev/) for duplicate detection

Existing project configuration takes precedence. The agent must not install or reconfigure PHP, extensions, Composer dependencies, or tools without human approval.

## Dependency contract

`coding-php` requires `coding`. The agent resolves it through the active harness's advertised skill names and paths, loads it first, and stops when it is unavailable. The skill does not rely on a harness-specific Skill tool.

## Invocation

Pi:

```text
/skill:coding-php Update this PHP package and run the configured gates.
```

OpenCode:

```text
/coding-php Update this PHP package and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 23](https://github.com/dragoscirjan/ai/issues/23) for the implementation requirements.
