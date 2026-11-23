# Maintain this site

Run modifying commands from the verified task branch and working directory of the source repository. Choose the current checkout or a separate workspace under the project's task policy. Read the repository's [contribution policy](https://github.com/dragoscirjan/ai/blob/main/CONTRIBUTING.md) before changes and [validation policy](https://github.com/dragoscirjan/ai/blob/main/VALIDATION.md) before checks or publication.

::: warning Local security mitigation
The pinned `picomatch@4.0.7` has a local patch and an owner-approved audit exception for `GHSA-fc5q-39xc-vjpf`. The audit still reports this advisory as ignored, not fixed upstream. See [the mitigation and its regression checks](/maintenance/publication#maintain-the-picomatch-mitigation). Keep the full audit and publication gate intact. Investigate and fix other audit failures rather than adding exceptions.
:::

## Install the project dependencies

You need mise and Git. Review `mise.toml`, `mise.lock`, `package.json`, and `pnpm-lock.yaml` before trusting or installing this checkout. Mise manages Node 24 LTS, pnpm 10.33.0, and Bun 1.4.4. The tracked mise lock owns exact resolved runtime versions; pnpm owns JavaScript dependencies.

VitePress stays at 1.6.4. An owner-approved `vitepress>vite: 6.4.5` pnpm override addresses the older Vite/esbuild development-toolchain advisories. Compatibility checks passed. The separate Picomatch advisory uses the local mitigation described above. This is not an upstream support claim. Keep the override scoped, audit after updates, and rerun both base-path builds plus dev/preview and browser checks before changing it.

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

## Theme and syntax highlighting

The site uses [Catppuccin for VitePress](https://github.com/catppuccin/vitepress) with Latte in light mode, Mocha in dark mode, and a mauve accent. The color-mode switch controls both the site palette and code highlighting.

`docs/.vitepress/theme/index.mjs` imports the official `mocha/mauve.css` stylesheet, which includes Latte. Keep font, layout, image, and reduced-motion rules in `custom.css`; do not restore the old gold palette over the theme. The matching Shiki themes are configured in `docs/.vitepress/config.mjs`.

The theme is pinned to `@catppuccin/vitepress@0.1.4`. TypeScript `5.9.3` is pinned because the theme declares it as a peer dependency. The site configuration remains JavaScript. Frozen setup installs both through the existing lockfile. Dependency changes still require approval, audit, and site checks.

The dependency notice download preserves the theme's MIT license and TypeScript's Apache-2.0 license. Archify HTML and SVG files retain their renderer-owned themes; the VitePress palette does not rewrite those artifacts.

## Change content at its source

| Content                                                                         | Edit here                                                                                                            |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Names, sources, selection defaults, prerequisites, runtime notes, legal records | `.agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml`, through its applicable skill-change process. |
| Reader-oriented groups                                                          | `scripts/docs/data.mjs`                                                                                              |
| Per-skill guidance and sample prompts                                           | `scripts/docs/skill-notes.mjs`                                                                                       |
| Primary workflow titles and related procedure IDs; focused recipe data          | `scripts/docs/workflows.mjs`                                                                                         |
| Five end-to-end workflow guides and supporting tools                            | The authored `docs/workflows/` pages listed below                                                                    |
| Diagram layout and source citations                                             | `scripts/docs/diagram-specs.mjs`                                                                                     |
| Start, installation, first-use, and maintenance procedures                      | Their Markdown files under `docs/`                                                                                   |
| Navigation and theme                                                            | `docs/.vitepress/`                                                                                                   |

The generator owns `docs/skills/`, `docs/groups/`, the workflow index and focused recipe pages, and the catalog/relationship reference pages. Do not hand-edit those generated pages or treat them as another inventory.

The five primary guides are authored Markdown: `docs/workflows/plan-a-project.md`, `implement-a-task.md`, `debug-a-problem.md`, `document-a-project.md`, and `debloat-a-project.md`. The authored `docs/workflows/supporting-tools.md` covers safeguards and additional workflows. Edit these pages directly; generation preserves them. Their Archify diagrams are generated from `scripts/docs/workflow-guide-diagrams.mjs` through the same native gates as the focused recipes. The guides retain a folded text alternative. See [diagram regeneration](/maintenance/diagrams) before changing diagram definitions.

Keep the focused recipe URLs and their checked-in diagrams available for existing links. The primary navigation leads to the five guides instead of listing every recipe. After changing generator sources:

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

Rebuild with the hosted base, then run the same two commands with `DOCS_BASE=/projects/ai-skills/`. They check desktop/mobile containment, page images, local search, real interactive-diagram navigation, and legal downloads. They also use the visible color-mode switch to verify Latte/Mocha colors, matching code themes, and preference persistence. Inspect the captures before claiming visual review.

Also inspect the diagrams, review external links, and run `git diff --check`. Formatting and linting cover the new site/tooling, not unrelated skills or templates. Machine-owned lockfiles, native diagrams, legal text, and generated pages are not reformatted as authored prose. Mise parses the TOML configuration; no TOML formatter plugin is installed.

Record passed, failed, unavailable, and intentionally unrun checks separately. Agent walkthroughs and screenshots do not replace actual human usability testing. Required blocked checks need an owner decision before the change is complete.

## Keep scope boundaries intact

Do not edit skill bodies, instructions, templates, sibling repositories, secrets, or publishing policy as a side effect of a site update. Follow the applicable approval route when one of those changes is genuinely needed. The [publisher](/maintenance/publication) builds on every push to `main`, or on a manual run of `main`, and opens a separate destination PR when the generated output differs from destination `main`. It closes superseded managed proposals even when no new PR is needed. It never merges or deploys. Manual runs on other branches build artifacts without publishing.
