# Systematic debugging

A project-maintained skill for evidence-first debugging: investigate the failure, compare working behavior, test one hypothesis, then fix and verify.

[SKILL.md](SKILL.md) contains the workflow. Optional references cover root-cause tracing, asynchronous failures, and test pollution. Implementation, validation, workspace safety, and delegation follow the project's existing skills and policy.

## Inspiration and adaptation

Adapted by Dragos Cirjan, inspired by Jesse Vincent's [systematic-debugging skill in obra/superpowers](https://github.com/obra/superpowers/tree/22f0b463e7a5e579904dd6211a520321035526f7/skills/systematic-debugging), pinned at commit `22f0b463e7a5e579904dd6211a520321035526f7`.

This version adds project-specific handoffs, risk-based boundary checks, and reassessment after repeated failed fixes. It does not import the upstream executable scripts or project-specific TypeScript utilities.
