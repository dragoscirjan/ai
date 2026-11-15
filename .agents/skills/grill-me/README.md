# Grill Me provenance

This entry point adapts Matt Pocock's `grill-me` Agent Skill. It retains the upstream invocation setting and delegates the interview through the project's declared-requirement convention.

## Source

- Repository: [mattpocock/skills](https://github.com/mattpocock/skills)
- Skill directory: [skills/productivity/grill-me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me)
- Pinned revision: [`fcf0071560d32913c9d4f820e0d7ca467c881619`](https://github.com/mattpocock/skills/commit/fcf0071560d32913c9d4f820e0d7ca467c881619)
- Upstream commit date: 2026-08-15
- Copied on: 2026-10-15

| File | Upstream blob SHA | Imported snapshot SHA-256 |
| --- | --- | --- |
| `SKILL.md` | `3947ff9c4ad980d14fc07fccbf659d47c114e81d` | `caaf8b8de1684f96e26b28f3c29189db5c89cce4b73e1c93d86164f66ef88637` |
| `LICENSE` | `f1dd2c09108dde1a5f56097cee8461b3ea834499` | `0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5` |

The skill is licensed under the upstream [MIT license](https://github.com/mattpocock/skills/blob/main/LICENSE). The notice is retained in [`LICENSE`](LICENSE).

## Local adaptation

`SKILL.md` adds `requires: ["grilling"]` and replaces the harness-specific Skill-tool call with a short interview entry instruction. The base project routing loads the requirement first. `grilling` is now an upstream-only entry in the [YAML catalog](../sync-my-skills/assets/skill-catalog.yaml); it must be installed through approved setup before use. A source record is not an installed requirement. Optional `agents/openai.yaml` is deliberately not retained. This file is not byte-identical to the imported snapshot above; the other listed files are unchanged.

## Checking for upgrades

The [YAML catalog](../sync-my-skills/assets/skill-catalog.yaml) is the authoritative synchronization source and adaptation recipe. The import data above records historical provenance, not a second installation inventory.

Use `/sync-my-skills` to stage the selected immutable source and maintained local baseline. Inspect upstream differences, preserve the interview prerequisite and portable entry behavior, and review any semantic adaptation before installation. Do not restore OpenAI metadata or silently switch the recorded source revision. Preserve the MIT notice and distinguish unchanged source files from local adaptations.
