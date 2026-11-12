# Sources and local choices

## Sources reviewed

- Matt Pocock's [retro](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/retro/SKILL.md) audits the agent environment, including navigation, check commands and their wiring, standards, ineffective instructions, tool cost, and missing information.
- Cursor pstack's [reflect](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/pstack/skills/reflect/SKILL.md) looks for durable lessons in the active conversation and keeps proposed edits separate from approval.
- Cursor pstack's [encode-lessons-in-structure](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/pstack/skills/principle-encode-lessons-in-structure/SKILL.md) prefers enforceable checks over repeated instructions.
- Cursor's [workflow-from-chats](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/cursor-team-kit/skills/workflow-from-chats/SKILL.md) distinguishes explicit corrections from weak or contradicted preference evidence.
- Cursor's [continual-learning](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/continual-learning/skills/continual-learning/SKILL.md) was examined but requires a particular updater agent and edits agent memory. It is not this skill's workflow.

## Local choices

Restore the concrete environment audit while retaining broader process findings. Inspect existing checks before proposing new ones. Recommend automation for mechanical violations and written guidance for judgment calls. Name the evidence, cause, change, destination, and verification for each proposal.

Do not adopt reviewer-only coding standards, mandatory model-specific reviewers, automatic backlog filing, automatic instruction edits, or access to unrelated transcripts. Project approval and instruction-maintenance gates remain in force. The source links are references, not skill dependencies.

## License notices

The adapted source material is available under the MIT license. The source copyright notices and permission text follow.

```text
MIT License

Copyright (c) 2026 Matt Pocock
Copyright (c) 2026 Lauren Tan
Copyright (c) 2026 Cursor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
