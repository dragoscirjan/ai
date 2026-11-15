# Specify

## Credits

- Matt Pocock's [to-spec](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/to-spec/SKILL.md) synthesizes decisions already made, inspects project context, and confirms test boundaries using existing examples.
- Superpowers' [brainstorming](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/brainstorming/SKILL.md) writes enough agreed detail for a builder to proceed and labels choices the agent made.
- Cursor pstack's [architect](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/pstack/skills/architect/SKILL.md) was examined but combines design sketches, model orchestration, and implementation. It is not a replacement for this specification writer.

## Local choices

Read the requirements and available code and tests before writing. Declare `requires: ["grilling"]` and use the interview only for unresolved specification choices. The requirement resolves to the catalogued upstream skill; if it is not installed, stop for approved setup rather than downloading implicitly. Reuse confirmed initiative decisions and look up facts instead of asking the user to do so. This adds clarification before drafting rather than adopting upstream to-spec's no-interview rule. Once choices are settled, record them without inventing new ones.

Preserve agreed values and interface decisions. Describe observable behavior, failures, and boundaries, then check whether a fresh reader would need to guess requirements. Resolve destination and format after clarification, save the specification, verify its content, and report its path or URL. Reuse an existing issue, document, or section when chosen. Report blocked or unverified saves honestly.

Keep the output small. Do not require long user-story lists, one universal test interface, tracker labels, fixed design paths, or an implementation handoff. Save only at an agreed, authorized destination. Reusing initiative's delivery pattern does not make initiative a skill dependency. The external source links are references, not additional skill dependencies.
