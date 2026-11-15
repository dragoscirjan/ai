# Sync my skills

A single personal `/sync-my-skills` command investigates different projects and synchronizes only approved skills. It does not initialize a coding foundation or change target instruction documents.

The [YAML catalog](assets/skill-catalog.yaml) describes authored, upstream, and adapted sources, commands, filtering, prerequisites, legal files, and adaptation intent. [SKILL.md](SKILL.md) owns the LLM workflow; [the data model](references/data-model.md) defines its helper contracts.

## Personal setup

Requirements: Node.js 22.20+, Git, npm/npx, and the pinned `yaml` dependency. Project apply supports isolated Git worktrees, not Jujutsu targets. The target's approved isolation procedure may have additional tooling requirements.

After this version is integrated upstream, explicitly approve installing the personal manager for the harnesses you want. For example, for Pi:

```sh
npx -y skills@1.7.4 add dragoscirjan/ai --skill sync-my-skills --global --agent pi --yes
```

Use `--agent opencode` or `--agent claude-code` when desired; do not force all three. During development, use a reviewed clean package export instead of a checkout containing `node_modules`: some directory installers copy ignored files too. The normal repository-source installation contains only committed package files. Claude projections require filesystem support for symbolic links.

The canonical personal package is normally `~/.agents/skills/sync-my-skills`. Verify the actual installation path before running setup:

```sh
MANAGER="$HOME/.agents/skills/sync-my-skills"
npm ci --ignore-scripts --prefix "$MANAGER"
node "$MANAGER/scripts/sync-my-skills.mjs" setup --harnesses pi
```

Dependency setup is an explicit approved operation, never part of project detection. The lock pins parser integrity; lifecycle scripts are disabled.

Review the emitted personal setup plan. Only then repeat the setup command with:

```sh
node "$MANAGER/scripts/sync-my-skills.mjs" setup --harnesses pi \
  --apply --confirm --plan-id <approved-setup-plan-id>
```

For multiple chosen harnesses, use a comma-separated `--harnesses` value. Setup refuses conflicting personal commands or skill destinations rather than overwriting them. It creates only:

- Pi: `~/.pi/agent/prompts/sync-my-skills.md`.
- OpenCode: `~/.config/opencode/commands/sync-my-skills.md`.
- Claude Code: a relative `~/.claude/skills/sync-my-skills` link to the installed manager. If Skills CLI already made the correct link, no change is needed.

It does not copy/install the manager package or its dependencies. `--home` and `--manager-root` support explicit custom locations and disposable tests. Templates do not select a model or provider. Reload Pi with `/reload`; check the other harnesses' command discovery after setup. Live harness behavior must be verified separately from static file checks.

## Use

In the chosen project:

```text
/sync-my-skills
```

Optional arguments can identify a project or focus. The LLM:

1. Reads project authority and investigates its actual purpose.
2. Proposes catalog skills with evidence.
3. Offers every remaining active project entry, including previously declined or incompatible entries with an explanation.
4. Asks which exact deprecated installations to retain/remove.
5. Confirms harnesses, skill closure, and missing requirements.
6. Stages selected source content and any semantic adaptation.
7. Presents one exact plan and waits for approval.
8. Applies only in an isolated worktree, checks results, and records portable provenance.

Installing an initializer does not run it. A decline does not uninstall an existing skill. Unknown/custom skills remain untouched. No root document, target code, credential, or target dependency is needed merely for detection.

## Source and adaptation behavior

- **Authored:** the maintained local directory, or that directory fetched from the owner repository.
- **Upstream:** a pinned public GitHub skill subtree plus required legal files. Only selected file contents are downloaded, though the GitHub tree API returns repository-wide metadata.
- **Adapted:** a maintained local baseline with upstream provenance and semantic adaptation intent. Review only when source/rules/target requirements change; otherwise reuse the unchanged recorded result.

The helper does not execute catalog installation commands or call an LLM API. The running agent reasons about sources, choices, and adaptations. It may propose a different adaptation when upstream text changes, instead of forcing an old text replacement. Catalog commands remain available for an explicitly approved alternate staging mechanism.

OpenAI metadata such as `agents/openai.yaml` is excluded. Updating a selected installation also plans removal of existing unwanted metadata; the user sees and approves those exact actions. Conventional legal files and explicitly mapped notices cannot be changed by adaptation.

## Existing projects

This is a conversion of `sync-agent-assets`, not a second compatibility skill. Old project installations are explicit deprecation candidates. The historical language/extension `coding-*` names are mapped individually; a custom similarly named skill is not automatically deprecated.

Existing version-1 `.agents/ai-assets.lock.json` files can migrate through a reviewed plan. Their root instruction records become historical metadata only; the actual documents remain unchanged. Skills CLI's `skills-lock.json` is never rewritten by this helper.

## Development checks

From this skill directory, after approved parser setup:

```sh
npm run check
npm test
npm audit --omit=dev
```

Also run the source repository's applicable validation and diff checks. Tests use disposable repositories, staged sources, mocked public GitHub responses, and temporary personal home directories. They do not configure live personal harnesses or execute downloaded skill code.

Tracking: [#69](https://github.com/dragoscirjan/ai/issues/69), consolidating #70. Instruction templates remain separate under [#68](https://github.com/dragoscirjan/ai/issues/68).
