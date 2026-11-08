# ASD-STE100 technical writing

`asd-ste100-technical` guides developer-facing responses, explanations, plans, reviews, documentation, instructions, and error reports. It uses plain language without losing technical meaning.

## Approach

This is a software-focused adaptation, not a claim of ASD-STE100 compliance. It keeps active voice, clear terms, and actionable steps without fixed word lists or sentence limits. Accuracy, uncertainty, exact technical text, and safety warnings take priority over brevity.

[`SKILL.md`](SKILL.md) is the complete, standalone instruction set. This README provides background, not additional required rules. No scripts, dependencies, or harness extensions are needed.

## Use

Load the skill through your harness. In Pi:

```text
/skill:asd-ste100-technical
```

A project can select it through agent instructions. Keep the directory name and frontmatter `name` as `asd-ste100-technical`.

## Sources and related work

The original skill grew from [issue #1](https://github.com/dragoscirjan/ai/issues/1), [ASD-STE100](https://www.asd-ste100.org/), and Pi response guidance. The local [`unslop`](../unslop/SKILL.md) skill inspired its direct format; it remains an optional companion, not a dependency. This skill is original work, not a copy of the vendored `unslop` source.

The shorter version addresses [issue #55](https://github.com/dragoscirjan/ai/issues/55), informed by:

- [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill): ambiguity reduction and meaning-preserving rewrites.
- [Stashbase: ASD-STE100 in Claude](https://stashbase.ai/blog/asd-ste100-claude/): loose STE guidance and the distinction between shorter sentences and shorter answers.
- [samirsawarkar/asd-ste100-skill](https://github.com/samirsawarkar/asd-ste100-skill): structured technical explanations and preserved uncertainty.

These references inform the prose rules; their strict modes, linters, and visual-artifact workflows are not included.
