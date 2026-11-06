# Systematic debugging

A project-maintained skill for evidence-first debugging: investigate the failure, compare working behavior, test one hypothesis, then fix and verify.

[SKILL.md](SKILL.md) contains the workflow. Optional references cover root-cause tracing, asynchronous failures, and test pollution. Implementation, validation, workspace safety, and delegation follow the project's existing skills and policy.

## Adaptation and authorship

Adapted by Dragos Cirjan from Jesse Vincent's [systematic-debugging skill in obra/superpowers](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7/skills/systematic-debugging), pinned at commit `22f0b463e7a5e579904dd6211a520321035526f7`.

This version adds project-specific handoffs, risk-based boundary checks, and reassessment after repeated failed fixes. It does not import the upstream executable scripts or project-specific TypeScript utilities.

Project adaptation: copyright (c) 2026 Dragos Cirjan, licensed under MIT. The following upstream notice is retained for the adapted material; it does not attribute our additions to the upstream author.

## Upstream MIT notice

```text
MIT License

Copyright (c) 2025 Jesse Vincent

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
