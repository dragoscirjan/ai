# Coding

`coding` is the generic base skill for code changes in any language. It combines project-first design, contextual engineering principles, risk-based security, behavior-focused testing, and explicit quality-gate reporting.

The skill avoids clean-code dogma. KISS, YAGNI, DRY, SOLID, design patterns, and functional techniques are useful only when they make the current code easier to understand, change, test, or secure.

## Sources

The security guidance uses these references:

- [OWASP Developer Guide](https://devguide.owasp.org/)
- [OWASP Developer Guide secure coding checklist](https://devguide.owasp.org/en/04-design/02-web-app-checklist/)
- [CWE Top 25 Most Dangerous Software Weaknesses](https://cwe.mitre.org/top25/)

The duplicate-code fallback is [jscpd](https://jscpd.dev/), which supports more than 200 languages. Existing project tooling still takes precedence.

## Independent guidance

Use this skill for the shared engineering workflow, security baseline, tests, quality gates, and result reporting. Follow the target project's conventions and approval rules. Missing required project instructions or tools stop the affected phase for approved setup.

## Quality gates

The generic skill defines gate categories and reporting. Language references select project-first fallback tools for those categories.

Every language reference must account for:

- formatting
- compilation or type checking when applicable
- linting or static analysis
- focused and broader tests
- jscpd as the fallback duplicate detector
- security analysis
- dependency or package auditing

A language reference may mark a category unsupported when its ecosystem has no mature option. It must explain that result and must not claim the gate passed.

Numeric thresholds come from project configuration. The skill family does not define universal coverage, duplication, or complexity numbers.

## Invocation

Pi exposes the skill through its [`/skill:name` command](https://pi.dev/docs/latest/skills):

```text
/skill:coding Implement the approved change and run the applicable project gates.
```

OpenCode exposes this skill as `/coding` because its frontmatter sets `metadata.opencode/slash` to `"true"`; see the [OpenCode skill documentation](https://opencode.ai/docs/skills):

```text
/coding Implement the approved change and run the applicable project gates.
```

## Files

- [`SKILL.md`](SKILL.md) contains the coding workflow.
- `README.md` explains the design, sources, and composition contract.

Keep the directory name and the `name` field in `SKILL.md` set to `coding` for portable Agent Skills discovery.

See [issue 14](https://github.com/dragoscirjan/ai/issues/14) for the family architecture and [issue 15](https://github.com/dragoscirjan/ai/issues/15) for this implementation phase.
