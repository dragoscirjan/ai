---
name: coding-bash
description: Write, refactor, review, or test Bash-specific shell with version-compatible arrays, tests, options, process handling, pipeline status, and introspection. Use whenever a script or shell fragment intentionally requires Bash rather than portable POSIX sh.
compatibility: Requires the coding and coding-sh skills plus the Bash versions, operating systems, utilities, and test tools selected by the project.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Bash coding

Apply `coding`, then `coding-sh`, then this Bash-specific guidance.

## Load dependencies

Locate the advertised `coding` and `coding-sh` skills by exact name and path. Read their `SKILL.md` files in that order unless they are already loaded.

If either dependency is unavailable, stop and ask the human to install or expose it. Do not install it automatically, duplicate its instructions, or rely on a harness-specific Skill tool.

## Confirm the Bash contract

Inspect the shebang, invocation, minimum Bash version, operating systems, shell options, sourced-versus-executed behavior, formatter and lint settings, tests, and CI. Use the [GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html) for version-specific semantics and the [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) where it is compatible with project conventions.

Do not add Bash features to a script that must remain portable. If Bash is required, make that interpreter contract explicit through the project's shebang and invocation conventions.

## Use Bash features deliberately

- Use indexed or associative arrays to preserve collections and argument boundaries. Quote array expansions and distinguish `"${array[@]}"` from `"${array[*]}"`.
- Use `[[ ... ]]` for Bash conditionals and pattern matching, and use arithmetic contexts for numeric work. Keep regular-expression and glob operands intentional.
- Use process substitution, `mapfile` or `readarray`, namerefs, extended globs, and newer parameter expansions only when the minimum Bash version supports them.
- Use `BASH_SOURCE`, `FUNCNAME`, `PIPESTATUS`, and caller information only when the script's sourced and executed modes are defined.
- Treat `shopt`, `set -o`, traps, and global shell state as part of the caller contract. Restore changed state when a sourced helper must not leak it.
- Account for subshells in pipelines, command substitutions, and process substitutions. Do not assume their failures or state changes automatically reach the parent shell.
- Use `pipefail` only when the project requires its semantics and tests the resulting status handling. It does not make `errexit` behavior simple or universal.

## Validate Bash behavior

Run inherited `coding-sh` gates in Bash mode. Use the project's test framework first; when none is configured, ask before installing [Bats-core](https://bats-core.readthedocs.io/) for behavior tests. Use `bash -n` with the project's minimum Bash version for syntax checking.

Test sourced and executed modes, option changes, arrays with empty elements, pipeline failures, process substitution, traps, signals, jobs or coprocesses when used, and minimum-version compatibility.

Report every applicable gate as passed, failed, not run, or unsupported. Inherit jscpd, quoting, security, cleanup, and other shell-wide requirements from `coding-sh`; do not duplicate or replace them here.
