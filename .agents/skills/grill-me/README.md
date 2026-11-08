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
| `agents/openai.yaml` | `4d6fb0c746c5d21364dce5d0cf8c51eab9712e7b` | `c061e39c3e0f9d865fb1b97556d485704af2a8a58f4b8221a8917a5c2074a32b` |
| `LICENSE` | `f1dd2c09108dde1a5f56097cee8461b3ea834499` | `0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5` |

The skill is licensed under the upstream [MIT license](https://github.com/mattpocock/skills/blob/main/LICENSE). The notice is retained in [`LICENSE`](LICENSE).

## Local adaptation

`SKILL.md` adds `require: ["grilling"]` and replaces the harness-specific Skill-tool call with a short interview entry instruction. The base project routing loads the requirement first. This file is not byte-identical to the imported snapshot above; the other listed files are unchanged.

## Checking for upgrades

Use the upstream skill directory as the canonical upgrade source:

https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me

Choose an exact upstream commit first and record it as `UPSTREAM_REF`; do not download from a moving branch. Download the snapshot and compare it before adapting or replacing files:

```sh
UPSTREAM_REF=fcf0071560d32913c9d4f820e0d7ca467c881619 # replace with the chosen exact commit
mkdir -p /tmp/grill-me/agents
curl -fsSL \
  "https://raw.githubusercontent.com/mattpocock/skills/$UPSTREAM_REF/skills/productivity/grill-me/SKILL.md" \
  -o /tmp/grill-me/SKILL.md
curl -fsSL \
  "https://raw.githubusercontent.com/mattpocock/skills/$UPSTREAM_REF/skills/productivity/grill-me/agents/openai.yaml" \
  -o /tmp/grill-me/agents/openai.yaml

diff -u .agents/skills/grill-me/SKILL.md /tmp/grill-me/SKILL.md
diff -u .agents/skills/grill-me/agents/openai.yaml /tmp/grill-me/agents/openai.yaml
```

If an upgrade is accepted:

1. Verify the untouched downloaded `SKILL.md` and other snapshot files against the chosen commit's recorded blob/digest before reapplying the local adaptation. Replace only reviewed files; do not record a revision resolved after downloading.
2. If the license changed, fetch and verify it from the same chosen commit, not a moving branch.
3. Update the revision, date, blob SHAs, SHA-256 values, and copy date in this README.
4. Verify unchanged upstream files against the recorded revision, and review/reapply the documented local adaptation to `SKILL.md`.
5. Validate skill discovery in each supported harness.

Keep local edits out of upstream files. If a local change is unavoidable, document the patch here and stop describing the affected file as byte-identical to upstream.
