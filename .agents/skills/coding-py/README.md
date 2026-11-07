# Python coding

`coding-py` provides Python-specific guidance independently. It applies to `.py` files, packages, Python environments, and build or test work.

## Sources

- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [PEP 8](https://peps.python.org/pep-0008/)

The project's supported Python versions, configured formatter, environment, dependency workflow, framework, and safe local conventions take precedence.

## Fallback quality tools

When the project has no configured choice, the skill recommends:

- [pytest](https://docs.pytest.org/)
- [Ruff](https://docs.astral.sh/ruff/)
- [Pyright](https://microsoft.github.io/pyright/)
- [Bandit](https://bandit.readthedocs.io/)
- [pip-audit](https://pypi.org/project/pip-audit/)
- [Pylint](https://pylint.readthedocs.io/) for project-relevant checks not covered by the selected lint setup
- [jscpd](https://jscpd.dev/) for duplicate detection

Existing project configuration takes precedence. The agent must not install or reconfigure interpreters, environments, dependencies, or tools without human approval.

## Invocation

Pi:

```text
/skill:coding-py Update this Python package and run the configured gates.
```

OpenCode:

```text
/coding-py Update this Python package and run the configured gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the agent instructions.
- `README.md` documents sources, tools, and composition.

See [issue 23](https://github.com/dragoscirjan/ai/issues/23) for the implementation requirements.
