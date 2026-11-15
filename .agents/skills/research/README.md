# Research

## Credits

- Matt Pocock's [research](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/research/SKILL.md) follows claims to primary sources and cites them in one findings document.
- Cursor pstack's [figure-it-out](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/figure-it-out/SKILL.md) tests claims against actual results and treats inconclusive evidence as inconclusive.
- Vercel's [find-skills](https://github.com/vercel-labs/skills/blob/b716f9dc2ba36b6aa8f0080615e5a3a6caeac63b/skills/find-skills/SKILL.md) searches for existing skills and checks candidates before recommending them. This repository offers discovery tooling, not a general research workflow.

- Superpowers' [brainstorming](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/brainstorming/SKILL.md) covers software and non-software ideas, reuses supplied context, and asks questions only when relevant information is missing.

- Superpowers' [verification-before-completion](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/verification-before-completion/SKILL.md) requires evidence before making claims and checks the evidence against the claimed result.
- Cursor pstack's [prove-it-works](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/principle-prove-it-works/SKILL.md) checks actual results rather than proxies or self-reports.

The first three source texts are unchanged from the earlier review; their links now pin the revisions checked for this refactor.

## Local choices

Start from a human question or idea. Existing-project investigation is one use, not a prerequisite. Curiosity is sufficient; no repository, implementation decision, or initiative is required.

Declare `requires: ["grilling"]` for the interview instructions and installation closure. The [YAML catalog](../sync-my-skills/assets/skill-catalog.yaml) identifies the upstream source; require an installed copy and stop for approved setup when missing. Use the interview only to clarify the question, scope, or expected result. Do not interview the user for research answers or reopen settled context. `grill-me` is the user-facing wrapper, not an additional dependency.

Choose evidence that fits the topic. Never invent facts or supporting material. Tie each factual finding to an inspected source and provide a link, brief attributed passage, or exact code/data excerpt. Check that the evidence supports the claim. Label inferences and illustrative examples, retain contrary evidence, and say what you could not verify. Keep recommendations separate from agreed decisions.

Use project output instructions when available. Otherwise ask where and how to deliver the findings. Do not copy mandatory background agents, fixed note locations, installation commands, popularity thresholds, or an automatic handoff to development planning.

The external source links are references, not additional skill dependencies.
