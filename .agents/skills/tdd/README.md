# TDD provenance

This directory contains an adapted copy of Matt Pocock's `tdd` Agent Skill. It uses portable Markdown instructions without provider-specific agent configuration.

## Source

- Repository: [mattpocock/skills](https://github.com/mattpocock/skills)
- Skill directory: [skills/engineering/tdd](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd)
- Pinned revision: [`4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d)
- Upstream commit date: 2026-10-31
- Imported on: 2026-11-09
- Tracking issue: [#61](https://github.com/dragoscirjan/ai/issues/61)

| File | Upstream blob SHA | Adapted SHA-256 |
| --- | --- | --- |
| `SKILL.md` | `01eadaa34e7c9a63a67d6dc3cce1cc81b0e49985` | `3f2f94cc1ac28251c508ea7235c3ecdfb5f33883acf4feaf5cb4ea39d0de6593` |
| `tests.md` | `7ab86479f925a1f9e8ba680af33cb3b12e015381` | `277b3d18db8cce80e0cf7a48ca60851028a87a1d6f92339544170af6ebe225db` |
| `mocking.md` | `71cbfee674d93244ce81d1830b930ca9a69200bd` | `38005fd45d778d7e3948b5499c309cb7c2ebe76c070d3998983807bf0afd3279` |
| `LICENSE` | `f1dd2c09108dde1a5f56097cee8461b3ea834499` | `0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5` |

The upstream [MIT notice](LICENSE) is retained byte-for-byte. The Markdown files are adapted, not byte-identical copies.

## Local adaptations

- Omit upstream `agents/openai.yaml` (blob `651b838a7663e027b1b8884491e867f26bb9a021`). There is no replacement provider configuration, model selection, or provider-specific tool requirement.
- Replace the mandatory `Skill` tool call to the upstream `codebase-design` skill with self-contained guidance for agreeing module responsibilities, public interfaces, and test seams. This skill does not require another skill to run.
- Use sentence-case headings and normalize Markdown layout. Keep the reference examples and testing guidance unchanged.
- Retain the upstream red → green workflow, including its decision to defer refactoring until review. The `code-review` mention is an informational later-stage reference, not a required skill or an instruction to launch reviewers.
- Add this provenance document. Repository-level discovery and synchronization entries are maintained outside this directory.

The TypeScript examples illustrate testing principles; they do not require TypeScript, Jest, or a particular LLM. Use the target project's language, test framework, architecture guidance, and applicable safety gates.

## Checking for upgrades

1. Inspect the upstream skill directory and license at a specific commit without executing imported code.
2. Compare all three Markdown files against the pinned revision above, including changes to links and skill references.
3. Keep provider configuration excluded and reapply the documented portability adaptations.
4. Refresh the MIT notice if upstream changes it.
5. Record the new revision, upstream blob SHAs, local SHA-256 values, dates, and any additional approved adaptations.
6. Validate frontmatter, supporting links, catalog coverage, and harness discovery. Distinguish static discovery checks from live harness verification.
