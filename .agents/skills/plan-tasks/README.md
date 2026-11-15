# Plan tasks

## Credits

- Matt Pocock's [to-tickets](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/to-tickets/SKILL.md) uses verifiable slices, explicit blocking relationships, review of the breakdown, and expand-contract sequencing for wide refactors.
- Superpowers' [writing-plans](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/writing-plans/SKILL.md) sizes tasks around reviewable deliverables and checks requirement coverage, interfaces, and verification steps.
- Cursor pstack's [sequence-verifiable-units](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/pstack/skills/principle-sequence-verifiable-units/SKILL.md) places checks at task boundaries so failures can be traced to the change that caused them.

## Local choices

Include enough context and completion evidence for another implementer to work without repeating the design discussion. Include inspected file and interface references when useful. Check coverage and dependency cycles. Name a shared integration check when individual migration steps cannot pass alone.

Do not force every task through nonexistent layers, prescribe program bodies, copy fixed plan paths, or impose an execution method. Task order does not authorize workers, commits, or tracker publication. The source links are references, not skill dependencies.
