# Sources and local choices

## Sources reviewed

- Matt Pocock's [to-tickets](https://github.com/mattpocock/skills/blob/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/to-tickets/SKILL.md) uses verifiable slices, explicit blocking relationships, review of the breakdown, and expand-contract sequencing for wide refactors.
- Superpowers' [writing-plans](https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/writing-plans/SKILL.md) sizes tasks around reviewable deliverables and checks requirement coverage, interfaces, and verification steps.
- Cursor pstack's [sequence-verifiable-units](https://github.com/cursor/plugins/blob/2eaf46574b25cdf7ef8c849837099b866b7438ce/pstack/skills/principle-sequence-verifiable-units/SKILL.md) places checks at task boundaries so failures can be traced to the change that caused them.

## Local choices

Include enough context and completion evidence for another implementer to work without repeating the design discussion. Include inspected file and interface references when useful. Check coverage and dependency cycles. Name a shared integration check when individual migration steps cannot pass alone.

Do not force every task through nonexistent layers, prescribe program bodies, copy fixed plan paths, or impose an execution method. Task order does not authorize workers, commits, or tracker publication. The source links are references, not skill dependencies.

## License notices

The adapted source material is available under the MIT license. The source copyright notices and permission text follow.

```text
MIT License

Copyright (c) 2026 Matt Pocock
Copyright (c) 2025 Jesse Vincent
Copyright (c) 2026 Lauren Tan

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
