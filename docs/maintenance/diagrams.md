# Regenerate and review diagrams

Normal site builds use the checked-in diagram outputs. Regeneration is an explicit authoring operation with network, executable-code, browser, and filesystem effects. Follow the project's approval and isolated-workspace rules first.

## Before you start

Complete the [mise setup](/maintenance/) and approve any missing tools. Archify is an upstream-only catalog entry, not a vendored skill or registered live-agent installation. The setup task acquires the catalog-pinned package into an external `ai-skills-docs` tool cache under `XDG_CACHE_HOME` or the standard user cache. It does not change personal agent discovery paths or install a browser.

You need Node.js and an existing Chrome, Chromium, or Edge compatible with Archify. This project's browser helper defaults to `chromium`; set `ARCHIFY_CHROME` to a reviewed executable path when needed. An invalid explicit path fails rather than silently choosing another browser. The helper uses an isolated disposable profile and a private DevTools pipe, not a personal browser profile.

```sh
mise run docs:diagrams:setup
```

Read the installed `SKILL.md` and the references required by the selected diagram type before authoring. The immutable package revision is recorded in the catalog. Setup preserves the complete package and legal files; it does not run downloaded code merely to inspect it. A changed cache or provenance mismatch stops reuse instead of silently replacing it.

## Author and regenerate

The recipe definitions live in `scripts/docs/workflows.mjs`; `scripts/docs/diagram-specs.mjs` builds complete native candidates from those definitions and the actual catalog. Required instruction edges come from catalog prerequisites and are checked against local frontmatter. Never infer an extra dependency from a useful companion or later phase.

```sh
mise run docs:diagrams
```

For a focused repair, pass only known diagram IDs:

```sh
mise exec -- node scripts/docs/archify.mjs render required-dependencies
```

The renderer runs the full native `finalize` contract at showcase quality: validation, delivery, strict artifact checks, and real-browser checks. It then uses the actual Viewer export controls to obtain canonical dual-theme SVGs. A failed gate exits nonzero; it is not normalized to success or a skipped check.

| Artifact                                                      | Location                                               |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| Editable native JSON                                          | `docs/diagrams/<id>.json`                              |
| Published standalone HTML and SVG                             | `docs/public/diagrams/<id>.html` and `<id>.svg`        |
| Source/output hashes and compact gate results                 | `docs/diagrams/manifest.json`                          |
| Original native HTML, delivery receipts, and per-run evidence | `.docs-artifacts/archify/` (ignored, not published)    |
| Downloadable source copies                                    | `docs/public/diagram-sources/` (generated for serving) |
| Preserved Archify software and font notices                   | `docs/public/notices/archify/`                         |

The published HTML is a byte-identical copy of the finalized native artifact, checked against its receipt. SVG exports are communication assets; they do not replace native artifact provenance or perceptual review. Do not minify or hand-edit a verified HTML/SVG without a new regeneration and review.

Native receipts may contain local evidence paths, so they stay in the ignored developer-artifact directory. The checked-in manifest contains portable hashes and source identities, not private machine paths. Build-time public source/manifest copies are derived, not competing editable sources.

## Review what the reader will see

Automated browser checks prove measured containment and runtime checks at the tool's required desktop viewports. They do not prove that a diagram teaches the right thing or that a human can use the site.

Inspect the actual outputs for readable labels, arrow direction, conditional approval edges, no misleading service or dependency claims, and correct stopping points. Compare the diagram with its text steps and the authoritative source. Verify light/dark presentation, static SVG, and the standalone Viewer separately.

For native perceptual captures, follow the installed delivery contract's `visual-check` procedure, preserve its evidence set, and inspect the captures before claiming visual review. Use a fresh evidence directory after any candidate change; old screenshots remain bound to the old artifact bytes.

The native Viewer is desktop-oriented. On a phone, the site provides a static preview and the full text steps; containment does not promise desktop feature parity in the standalone Viewer.

Finish with `mise run docs:check`, both base-path builds, and browser review of the actual site. Report artifact gates, automated browser evidence, agent visual inspection, and actual human testing as separate claims.
