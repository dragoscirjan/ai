# Coding with rules

`coding-with-rules` is the language-aware entry point for code work. It declares `require: ["coding"]` for the generic workflow, then selects ordinary Markdown references for the task's languages and file extensions.

## How it works

- Read `coding` through the declared requirement, then apply the router in [`SKILL.md`](SKILL.md).
- Load only the relevant documents under [`references/`](references/), with language guidance before extension guidance. For `.tsx`, read `ts.md` then `tsx.md`; do not assume React.
- Use project evidence for ambiguous headers, interpreters, and configuration files. Do not combine contradictory Bash and POSIX rules.
- Use the base workflow and project conventions for unsupported languages, and report the coverage gap. A missing mapped reference is an error.

The 21 reference bodies preserve the former language and extension skills' rules. They have no skill frontmatter and are not advertised as separate skills. The generic [`coding`](../coding/SKILL.md) skill remains independently useful.

`require` is a project convention, not a native harness loader. Project instructions resolve it; external Skills CLI commands do not install it automatically. Managed synchronization installs the router in its core profile and includes `coding` through requirement closure. Complete installation includes every reference, but the model reads only applicable files.

## Use

In Pi:

```text
/skill:coding-with-rules Implement the approved change and run the applicable project checks.
```

For a manual installation, explicitly select both skills:

```sh
npx skills@1.7.4 add dragoscirjan/ai --skill coding --skill coding-with-rules --agent pi --agent opencode --agent claude-code
```

Review the assets and follow the target project's workspace and approval gates before installation. Claude Code uses the relative `.claude/skills/coding-with-rules` projection; no separate reference projections are needed. Reload the harness after changing its installed skill inventory.

## Migrate existing installations

The former `coding-<language>` and `coding-<extension>` skills are removed upstream, not automatically renamed or deleted in target projects.

1. Run `sync-agent-assets` against the new source and review its removed-skill report. In the proposed selection, replace obsolete selected names with `coding-with-rules` and remove obsolete declined names. Reusing an unknown legacy selection is an error; there is no automatic remapping.
2. Approve the target instruction adaptation: route code work through `coding-with-rules` instead of selecting separate language and extension skills.
3. Install the complete router and its `coding` requirement using the approved synchronization workflow. Retain legacy files through explicit `retainedFiles` entries for previously recorded paths until their removal is approved. Do not hand-edit either lockfile.
4. Review retained legacy directories and Claude projections separately. They remain on disk and can remain discoverable; remove them only under an explicit target-approved cleanup plan, then reload the harness. This migration does not authorize that deletion.

This repository removes its old directories and projections in the same change. No synchronization deletion or legacy-name remapping behavior is added. See [issue #56](https://github.com/dragoscirjan/ai/issues/56).
