# Initialization with rules

`init-with-rules` adds language-specific toolchains to an approved [`init-project`](../init-project/SKILL.md) foundation. It replaces the separate `init-typescript` and `init-gdscript` skills.

## Dependencies and approval

- Instruction requirement: `require: ["init-project"]`.
- Shared-code dependency: `init-project/scripts/lib.ts`, imported by both language helpers.
- [TypeScript](references/typescript.md) and [GDScript](references/gdscript.md) documents explicitly link the foundation prerequisite. They are regular Markdown files, not skills or symlinks.
- Loading instructions does not authorize running foundation or language setup. Foundation and language initialization retain separate approvals; installing skills does not initialize a project.

## Use

```text
/skill:init-with-rules
```

The router selects only the requested language document. Run its helper from this directory with an absolute target root:

```text
bun scripts/typescript/init.ts --help
bun scripts/gdscript/init.ts --help
```

Plans are non-mutating. Approved application requires `--apply --confirm`; `--install` needs separate consent for tool/dependency installation, lockfiles, and mise trust-store changes. Bun runs these helpers but is not added to the target toolchain. See [`SKILL.md`](SKILL.md) for the shared procedure.

For a manual installation, select both assets because the external Skills CLI does not infer these dependencies:

```sh
npx skills@1.7.4 add dragoscirjan/ai --skill init-project --skill init-with-rules --agent pi --agent opencode --agent claude-code
```

Managed synchronization resolves both code and instruction dependencies and includes complete helper/test/reference directories. Initializers remain approval-bound choices, not automatic core installation. Claude projections are exact relative links; reload the harness after installation.

## Migration

In the proposed synchronization selection, replace obsolete `init-typescript`/`init-gdscript` names with `init-with-rules`, including obsolete declined entries. Review and approve target instruction changes. Retain previously recorded legacy files through explicit retention entries until their removal is approved; old directories/projections may remain discoverable. Do not hand-edit lockfiles or infer deletion authority. No automatic remapping or downstream cleanup is added.

Direct helper paths move to `scripts/<language>/init.ts`. Result JSON now identifies `skill: "init-with-rules"` and a `language` field. Generated project configuration and installation behavior are unchanged.

Run foundation and both language suites with `bun test` using explicit `./.agents/...` paths. See [issue #59](https://github.com/dragoscirjan/ai/issues/59).
