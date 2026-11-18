# Maintain this site

Run commands from an approved isolated checkout of the source repository. Read the repository's [contribution policy](https://github.com/dragoscirjan/ai/blob/main/CONTRIBUTING.md) before changes and [validation policy](https://github.com/dragoscirjan/ai/blob/main/VALIDATION.md) before checks or publication.

::: warning Draft: dependency audit is blocked
The final audit reports [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), a high-severity regular-expression denial-of-service issue in `picomatch@4.0.7` through Vite. The advisory has no known patched version as checked on 2026-11-17. The site remains a blocked draft: keep the full audit and publication gate intact, and do not treat the Vite override as an accepted zero-advisory baseline. No advisory suppression or dependency fallback is configured.
:::

## Install the project dependencies

You need mise and Git. Review `mise.toml`, `mise.lock`, `package.json`, and `pnpm-lock.yaml` before trusting or installing this checkout. Mise manages Node 24 LTS, pnpm 10.33.0, and Bun 1.4.4. The tracked mise lock owns exact resolved runtime versions; pnpm owns JavaScript dependencies.

VitePress stays at 1.6.4. An owner-approved `vitepress>vite: 6.4.5` pnpm override addresses the older Vite/esbuild development-toolchain advisories. Compatibility checks passed, but acceptance remains blocked by the separate Picomatch advisory above. This is not an upstream support claim. Keep the override scoped, audit after updates, and rerun both base-path builds plus dev/preview and browser checks before changing it.

For a terminal session confined to this reviewed project, keep trust state project-scoped rather than modifying global trust configuration:

```sh
export MISE_STATE_DIR="$PWD/.docs-artifacts/mise-state"
export MISE_TRUSTED_CONFIG_PATHS="$PWD"
mise run deps:sync
```

This downloads missing approved tools and installs frozen dependencies. Do not add startup-file exports or broadly trust a parent directory. Unset these variables when leaving the project:

```sh
unset MISE_STATE_DIR MISE_TRUSTED_CONFIG_PATHS
```

If the lock and manifests disagree, stop and review the intended dependency change. Do not remove the frozen-lockfile check or update packages merely to make a build pass.

## Serve and build

With the same project-scoped terminal environment:

```sh
mise run docs:serve
```

Open the local URL printed by VitePress. The server binds to `127.0.0.1`. Independent development and builds use `/` by default.

```sh
mise run docs
mise run docs:preview
```

Expect a successful production build in `docs/.vitepress/dist/` and a working local preview. A normal build generates the learning pages, checks their sources and diagram hashes, and uses checked-in HTML/SVG diagrams. It does not download Archify, start its renderer, register agent skills, or deploy anything.

For the hosted-path check, use the same base for both commands:

```sh
DOCS_BASE=/projects/ai-skills/ mise run docs
DOCS_BASE=/projects/ai-skills/ mise run docs:preview
```

`DOCS_BASE` accepts `/` or slash-delimited path segments made from letters, digits, underscores, and hyphens. It must end in `/`. URLs, traversal, empty segments, query strings, fragments, and encoded separators are rejected. Its implementation is beside the configuration in `scripts/docs/data.mjs` and `docs/.vitepress/config.mjs`.

## Change content at its source

| Content                                                                         | Edit here                                                                                                            |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Names, sources, selection defaults, prerequisites, runtime notes, legal records | `.agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml`, through its applicable skill-change process. |
| Reader-oriented groups                                                          | `scripts/docs/data.mjs`                                                                                              |
| Per-skill guidance and sample prompts                                           | `scripts/docs/skill-notes.mjs`                                                                                       |
| Supported recipes, steps, optional branches, stopping points                    | `scripts/docs/workflows.mjs`                                                                                         |
| Diagram layout and source citations                                             | `scripts/docs/diagram-specs.mjs`                                                                                     |
| Start, installation, first-use, and maintenance procedures                      | Their Markdown files under `docs/`                                                                                   |
| Navigation and theme                                                            | `docs/.vitepress/`                                                                                                   |

The generator owns `docs/skills/`, `docs/groups/`, `docs/workflows/`, and the catalog/relationship reference pages. Do not hand-edit those generated pages or treat them as another inventory. After changing their sources:

```sh
mise exec -- node scripts/docs/generate.mjs
mise run docs:check
```

A new catalog entry needs reader notes, exactly one group, and appropriate workflow coverage. A changed requirement needs the real frontmatter and catalog to agree; do not alter metadata simply to fit a diagram. See [diagram regeneration](/maintenance/diagrams) when recipe or relationship diagrams change.

## Validate the change

```sh
mise run format:check
mise run lint:check
mise run docs:check
mise run test
mise run docs
mise exec -- pnpm audit
```

Use the private Chromium walkthrough after building; it starts and stops only its own local server and writes captures under ignored `.docs-artifacts/browser/`:

```sh
mise exec -- node scripts/docs/browser-check.mjs preview
mise exec -- node scripts/docs/browser-check.mjs dev
```

Rebuild with the hosted base, then run the same two commands with `DOCS_BASE=/projects/ai-skills/`. They check desktop/mobile containment, page images, local search, navigation, and legal downloads. Inspect the captures before claiming visual review.

Also inspect the diagrams, review external links, and run `git diff --check`. Formatting and linting cover the new site/tooling, not unrelated skills or templates. Machine-owned lockfiles, native diagrams, legal text, and generated pages are not reformatted as authored prose. Mise parses the TOML configuration; no TOML formatter plugin is installed.

Record passed, failed, unavailable, and intentionally unrun checks separately. Agent walkthroughs and screenshots do not replace actual human usability testing. Required blocked checks need an owner decision before the change is complete.

## Keep scope boundaries intact

Do not edit skill bodies, instructions, templates, sibling repositories, secrets, or publishing policy as a side effect of a site update. Follow the applicable approval route when one of those changes is genuinely needed. The [publisher](/maintenance/publication) builds and opens a separate destination PR on every push to `main`, or on a manual rerun of `main`. It never merges or deploys. Manual runs on other branches build artifacts without publishing.
