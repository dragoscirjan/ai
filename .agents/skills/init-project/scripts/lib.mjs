import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, relative, resolve, sep } from "node:path";

export const EXIT = Object.freeze({
  OK: 0,
  USAGE: 2,
  CONFLICT: 3,
  ENVIRONMENT: 4,
  COMMAND: 5,
  IO: 6,
});

export class InitError extends Error {
  constructor(message, code = EXIT.IO, details = undefined) {
    super(message);
    this.name = "InitError";
    this.code = code;
    this.details = details;
  }
}

export function requireBun() {
  if (typeof Bun === "undefined" || typeof Bun.TOML?.parse !== "function") {
    throw new InitError(
      "Bun with Bun.TOML.parse is required to run this initializer; install Bun and invoke the script with bun",
      EXIT.ENVIRONMENT,
    );
  }
}

function parseTomlValue(rawValue, location) {
  requireBun();
  try {
    return Bun.TOML.parse(`value = ${rawValue}`).value;
  } catch (error) {
    throw new InitError(`Invalid TOML value at ${location}: ${error.message}`, EXIT.CONFLICT);
  }
}

function validateToml(text) {
  requireBun();
  try {
    Bun.TOML.parse(text);
  } catch (error) {
    throw new InitError(`Invalid TOML document: ${error.message}`, EXIT.CONFLICT);
  }
}

function finalizeToml(text, location) {
  requireBun();
  try {
    Bun.TOML.parse(text);
  } catch (error) {
    throw new InitError(
      `Conflict while updating ${location}: generated TOML is invalid: ${error.message}`,
      EXIT.CONFLICT,
    );
  }
  return text;
}

export function parseArgs(argv, definitions) {
  const values = {};
  for (const [name, definition] of Object.entries(definitions)) {
    if (Object.hasOwn(definition, "default")) values[name] = definition.default;
    else if (definition.type === "boolean") values[name] = false;
  }

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      throw new InitError(`Unexpected positional argument: ${token}`, EXIT.USAGE);
    }
    const name = token.slice(2);
    const definition = definitions[name];
    if (!definition) throw new InitError(`Unknown option: ${token}`, EXIT.USAGE);
    if (definition.type === "boolean") {
      values[name] = true;
      continue;
    }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new InitError(`Option ${token} requires a value`, EXIT.USAGE);
    }
    index += 1;
    if (definition.choices && !definition.choices.includes(value)) {
      throw new InitError(
        `Option ${token} must be one of: ${definition.choices.join(", ")}`,
        EXIT.USAGE,
      );
    }
    values[name] = value;
  }

  if (!values.help) {
    for (const [name, definition] of Object.entries(definitions)) {
      if (definition.required && !values[name]) {
        throw new InitError(`Missing required option: --${name}`, EXIT.USAGE);
      }
    }
    if (values.apply && values["dry-run"]) {
      throw new InitError("Use either --dry-run or --apply, not both", EXIT.USAGE);
    }
    if (values.apply && !values.confirm) {
      throw new InitError("--apply requires --confirm after the plan is approved", EXIT.USAGE);
    }
    if (values.install && !values.apply) {
      throw new InitError("--install requires --apply --confirm", EXIT.USAGE);
    }
    if (values.confirm && !values.apply) {
      throw new InitError("--confirm is valid only with --apply", EXIT.USAGE);
    }
  }

  return values;
}

export function validateVersion(value, option) {
  if (!/^[0-9][0-9A-Za-z.+-]*$/.test(value)) {
    throw new InitError(`${option} must be a pinned version or major without spaces`, EXIT.USAGE);
  }
  return value;
}

export function validateRelativePath(value, option) {
  if (
    !value ||
    isAbsolute(value) ||
    value.split(/[\\/]/).includes("..") ||
    !/^[A-Za-z0-9._/\\-]+$/.test(value)
  ) {
    throw new InitError(`${option} must be a safe project-relative path`, EXIT.USAGE);
  }
  return value.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/$/, "") || ".";
}

export function resolveRoot(input) {
  const root = resolve(input);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new InitError(`Project root is not a directory: ${root}`, EXIT.ENVIRONMENT);
  }
  return realpathSync(root);
}

function assertContained(root, target) {
  const rel = relative(root, target);
  if (rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel))) return;
  throw new InitError(`Path escapes the project root: ${target}`, EXIT.USAGE);
}

function nearestExistingParent(target) {
  let current = target;
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) return current;
    current = parent;
  }
  return current;
}

function redactPlannedValue(value, key = "") {
  if (/(?:token|secret|password|credential|private.?key|auth)/i.test(key)) {
    return { value: "<redacted>", redacted: true };
  }
  if (Array.isArray(value)) {
    let redacted = false;
    const result = value.map((item) => {
      const nested = redactPlannedValue(item);
      redacted ||= nested.redacted;
      return nested.value;
    });
    return { value: result, redacted };
  }
  if (value && typeof value === "object") {
    let redacted = false;
    const result = {};
    for (const [entry, item] of Object.entries(value)) {
      const nested = redactPlannedValue(item, entry);
      redacted ||= nested.redacted;
      result[entry] = nested.value;
    }
    return { value: result, redacted };
  }
  return { value, redacted: false };
}

function redactPlannedContent(relativePath, content) {
  let normalized = content;
  let structuredRedaction = false;
  if (relativePath.endsWith(".json")) {
    try {
      const parsed = redactPlannedValue(JSON.parse(content));
      normalized = formatJson(parsed.value);
      structuredRedaction = parsed.redacted;
    } catch {
      // The owning JSON parser reports malformed input before this plan is emitted.
    }
  }
  const redacted =
    structuredRedaction ||
    /(https?:\/\/)[^/@\s]+@/i.test(normalized) ||
    /^(\s*[A-Za-z0-9_.-]*(?:token|secret|password|credential|private.?key|auth)[A-Za-z0-9_.-]*\s*=\s*).+$/im.test(normalized) ||
    /([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|CREDENTIAL|AUTH)[A-Z0-9_]*=)[^\s]+/.test(normalized);
  const sanitized = normalized
    .replace(/(https?:\/\/)[^/@\s]+@/gi, "$1<redacted>@")
    .replace(
      /^(\s*[A-Za-z0-9_.-]*(?:token|secret|password|credential|private.?key|auth)[A-Za-z0-9_.-]*\s*=\s*).+$/gim,
      "$1<redacted>",
    )
    .replace(
      /([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|CREDENTIAL|AUTH)[A-Z0-9_]*=)[^\s]+/g,
      "$1<redacted>",
    );
  return { content: sanitized, redacted };
}

export class Workspace {
  constructor(root) {
    this.root = resolveRoot(root);
    this.staged = new Map();
    this.operations = [];
  }

  path(relativePath) {
    if (!relativePath || isAbsolute(relativePath)) {
      throw new InitError(`Expected a project-relative path: ${relativePath}`, EXIT.USAGE);
    }
    const target = resolve(this.root, relativePath);
    assertContained(this.root, target);
    const parent = nearestExistingParent(dirname(target));
    const parentReal = realpathSync(parent);
    assertContained(this.root, parentReal);
    if (existsSync(target) && lstatSync(target).isSymbolicLink()) {
      throw new InitError(`Refusing to modify symlink: ${relativePath}`, EXIT.CONFLICT);
    }
    return target;
  }

  read(relativePath) {
    if (this.staged.has(relativePath)) return this.staged.get(relativePath).content;
    const target = this.path(relativePath);
    return existsSync(target) ? readFileSync(target, "utf8") : null;
  }

  stage(relativePath, content, options = {}) {
    const previous = this.read(relativePath);
    if (options.createOnly && previous !== null && previous !== content) {
      throw new InitError(
        `Existing ${relativePath} differs from the initializer template`,
        EXIT.CONFLICT,
      );
    }
    if (previous === content) {
      const target = this.path(relativePath);
      const modeMatches =
        options.mode === undefined ||
        (existsSync(target) && (statSync(target).mode & 0o777) === options.mode);
      if (modeMatches) {
        this.operations.push({ action: "unchanged", path: relativePath });
        return;
      }
    }
    this.staged.set(relativePath, { content, mode: options.mode });
    this.operations.push({ action: previous === null ? "create" : "update", path: relativePath });
  }

  appendLine(relativePath, line) {
    const current = this.read(relativePath) ?? "";
    if (current.split(/\r?\n/).includes(line)) {
      this.operations.push({ action: "unchanged", path: relativePath, detail: line });
      return;
    }
    const separator = current.length > 0 && !current.endsWith("\n") ? "\n" : "";
    this.stage(relativePath, `${current}${separator}${line}\n`);
  }

  plannedFiles() {
    return [...this.staged.entries()].map(([relativePath, staged]) => {
      const planned = redactPlannedContent(relativePath, staged.content);
      return {
        action: existsSync(this.path(relativePath)) ? "update" : "create",
        path: relativePath,
        content: planned.content,
        redacted: planned.redacted,
        ...(staged.mode === undefined
          ? {}
          : { mode: `0${staged.mode.toString(8)}` }),
      };
    });
  }

  apply() {
    for (const [relativePath, staged] of this.staged) {
      const target = this.path(relativePath);
      mkdirSync(dirname(target), { recursive: true });
      const temporary = `${target}.init-${process.pid}-${Date.now()}`;
      try {
        writeFileSync(temporary, staged.content, "utf8");
        if (staged.mode !== undefined) chmodSync(temporary, staged.mode);
        renameSync(temporary, target);
      } finally {
        rmSync(temporary, { force: true });
      }
    }
  }
}

export function readJsonObject(workspace, relativePath, fallback = {}) {
  const text = workspace.read(relativePath);
  if (text === null) return structuredClone(fallback);
  let value;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new InitError(`Invalid JSON in ${relativePath}: ${error.message}`, EXIT.CONFLICT);
  }
  if (!value || Array.isArray(value) || typeof value !== "object") {
    throw new InitError(`${relativePath} must contain a JSON object`, EXIT.CONFLICT);
  }
  return value;
}

function formatJsonValue(value, level = 0) {
  const indent = "  ".repeat(level);
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    const inline = `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;
    if (value.every((item) => item === null || typeof item !== "object") && indent.length + inline.length <= 80) {
      return inline;
    }
    if (value.length === 0) return "[]";
    return `[\n${value
      .map((item) => `${"  ".repeat(level + 1)}${formatJsonValue(item, level + 1)}`)
      .join(",\n")}\n${indent}]`;
  }
  const entries = Object.entries(value);
  if (entries.length === 0) return "{}";
  return `{\n${entries
    .map(([key, item]) => `${"  ".repeat(level + 1)}${JSON.stringify(key)}: ${formatJsonValue(item, level + 1)}`)
    .join(",\n")}\n${indent}}`;
}

export function formatJson(value) {
  return `${formatJsonValue(value)}\n`;
}

export function writeJsonObject(workspace, relativePath, value) {
  workspace.stage(relativePath, formatJson(value));
}

export function setExact(object, key, value, location, options = {}) {
  if (!Object.hasOwn(object, key)) {
    object[key] = value;
    return;
  }
  if (options.preserveExisting) return;
  if (JSON.stringify(object[key]) !== JSON.stringify(value)) {
    throw new InitError(
      `Conflict at ${location}.${key}: existing value differs from the approved initializer value`,
      EXIT.CONFLICT,
    );
  }
}

export function mergeExactMap(object, key, expected, location) {
  if (!Object.hasOwn(object, key)) object[key] = {};
  if (!object[key] || Array.isArray(object[key]) || typeof object[key] !== "object") {
    throw new InitError(`${location}.${key} must be an object`, EXIT.CONFLICT);
  }
  for (const [entry, value] of Object.entries(expected)) {
    setExact(object[key], entry, value, `${location}.${key}`);
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function taskHeaderPattern(name) {
  const escaped = escapeRegex(name);
  return new RegExp(`^\\[tasks\\.(?:"${escaped}"|${escaped})\\]\\s*$`);
}

function sectionBounds(lines, matcher) {
  const start = lines.findIndex((line) => matcher.test(line.trim()));
  if (start < 0) return null;
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^\[[^\]]+\]\s*$/.test(lines[index].trim())) {
      end = index;
      break;
    }
  }
  return { start, end };
}

function ensureSimpleKey(lines, bounds, key, rawValue, location) {
  const pattern = new RegExp(`^${escapeRegex(key)}\\s*=\\s*(.+?)\\s*$`);
  for (let index = bounds.start + 1; index < bounds.end; index += 1) {
    const match = lines[index].trim().match(pattern);
    if (!match) continue;
    const existing = parseTomlValue(match[1], `${location}.${key}`);
    const expected = parseTomlValue(rawValue, `${location}.${key}`);
    if (JSON.stringify(existing) !== JSON.stringify(expected)) {
      throw new InitError(`Conflict at ${location}.${key}`, EXIT.CONFLICT);
    }
    return lines;
  }
  lines.splice(bounds.end, 0, `${key} = ${rawValue}`);
  return lines;
}

export function ensureTomlTableKey(text, table, key, rawValue) {
  validateToml(text);
  const lines = text.replace(/\s+$/, "").split("\n");
  let bounds = sectionBounds(lines, new RegExp(`^\\[${escapeRegex(table)}\\]\\s*$`));
  if (!bounds) {
    if (lines.length && lines[0] !== "") lines.push("");
    lines.push(`[${table}]`, `${key} = ${rawValue}`);
  } else {
    ensureSimpleKey(lines, bounds, key, rawValue, table);
  }
  return finalizeToml(`${lines.join("\n").replace(/^\n+/, "")}\n`, `${table}.${key}`);
}

function formatTomlStringArray(values) {
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

export function ensureTomlTask(text, name, definition) {
  validateToml(text);
  const lines = text.replace(/\s+$/, "").split("\n");
  let bounds = sectionBounds(lines, taskHeaderPattern(name));
  if (!bounds) {
    if (lines.length && lines[0] !== "") lines.push("");
    lines.push(`[tasks.${JSON.stringify(name)}]`);
    if (definition.description) lines.push(`description = ${JSON.stringify(definition.description)}`);
    if (definition.depends) lines.push(`depends = ${formatTomlStringArray(definition.depends)}`);
    if (definition.run) lines.push(`run = ${JSON.stringify(definition.run)}`);
    return finalizeToml(
      `${lines.join("\n").replace(/^\n+/, "")}\n`,
      `tasks.${name}`,
    );
  }

  if (definition.run) {
    ensureSimpleKey(lines, bounds, "run", JSON.stringify(definition.run), `tasks.${name}`);
    bounds = sectionBounds(lines, taskHeaderPattern(name));
  }
  if (definition.depends) {
    const dependsIndex = lines.findIndex(
      (line, index) =>
        index > bounds.start && index < bounds.end && /^depends\s*=/.test(line.trim()),
    );
    if (dependsIndex < 0) {
      lines.splice(bounds.end, 0, `depends = ${formatTomlStringArray(definition.depends)}`);
    } else {
      const match = lines[dependsIndex].trim().match(/^depends\s*=\s*(\[[^\n]*\])\s*$/);
      if (!match) {
        throw new InitError(
          `Cannot safely merge multiline dependencies in task ${name}; reconcile it manually`,
          EXIT.CONFLICT,
        );
      }
      const existing = parseTomlValue(match[1], `tasks.${name}.depends`);
      if (!Array.isArray(existing) || existing.some((item) => typeof item !== "string")) {
        throw new InitError(`Task ${name} has unsupported dependency syntax`, EXIT.CONFLICT);
      }
      for (const dependency of definition.depends) {
        if (!existing.includes(dependency)) existing.push(dependency);
      }
      lines[dependsIndex] = `depends = ${formatTomlStringArray(existing)}`;
    }
  }
  return finalizeToml(
    `${lines.join("\n").replace(/^\n+/, "")}\n`,
    `tasks.${name}`,
  );
}

export function ensureTomlArrayItem(text, table, key, item) {
  validateToml(text);
  const lines = text.replace(/\s+$/, "").split("\n");
  let bounds = sectionBounds(lines, new RegExp(`^\\[${escapeRegex(table)}\\]\\s*$`));
  if (!bounds) {
    if (lines.length && lines[0] !== "") lines.push("");
    lines.push(`[${table}]`, `${key} = ${formatTomlStringArray([item])}`);
    return finalizeToml(
      `${lines.join("\n").replace(/^\n+/, "")}\n`,
      `${table}.${key}`,
    );
  }
  const keyIndex = lines.findIndex(
    (line, index) => index > bounds.start && index < bounds.end && new RegExp(`^${escapeRegex(key)}\\s*=`).test(line.trim()),
  );
  if (keyIndex < 0) {
    lines.splice(bounds.end, 0, `${key} = ${formatTomlStringArray([item])}`);
    return finalizeToml(
      `${lines.join("\n").replace(/^\n+/, "")}\n`,
      `${table}.${key}`,
    );
  }
  const match = lines[keyIndex].trim().match(new RegExp(`^${escapeRegex(key)}\\s*=\\s*(\\[[^\\n]*\\])\\s*$`));
  if (!match) {
    throw new InitError(
      `Cannot safely merge multiline ${table}.${key}; reconcile it manually`,
      EXIT.CONFLICT,
    );
  }
  const values = parseTomlValue(match[1], `${table}.${key}`);
  if (!Array.isArray(values) || values.some((value) => typeof value !== "string")) {
    throw new InitError(`${table}.${key} must be an array of strings`, EXIT.CONFLICT);
  }
  if (!values.includes(item)) values.push(item);
  lines[keyIndex] = `${key} = ${formatTomlStringArray(values)}`;
  return finalizeToml(
    `${lines.join("\n").replace(/^\n+/, "")}\n`,
    `${table}.${key}`,
  );
}

function redactDiagnostics(value) {
  return value
    .replace(/(https?:\/\/)[^/@\s]+@/gi, "$1<redacted>@")
    .replace(/([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|AUTH)[A-Z0-9_]*=)[^\s]+/gi, "$1<redacted>");
}

export function runCommand(root, command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    env: process.env,
    shell: false,
    maxBuffer: 10 * 1024 * 1024,
  });
  const output = redactDiagnostics(`${result.stdout ?? ""}${result.stderr ?? ""}`.trim());
  if (output) process.stderr.write(`${output.slice(0, 8000)}${output.length > 8000 ? "\n…truncated" : ""}\n`);
  if (result.error || result.status !== 0) {
    throw new InitError(
      `Command failed: ${command} ${args.join(" ")}`,
      EXIT.COMMAND,
      { status: result.status, error: result.error?.message },
    );
  }
}

export function requireGitRoot(root) {
  const result = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: root,
    encoding: "utf8",
    shell: false,
  });
  if (result.status !== 0) {
    throw new InitError("The project root must be an initialized Git repository", EXIT.ENVIRONMENT);
  }
  const gitRoot = realpathSync(result.stdout.trim());
  if (gitRoot !== root) {
    throw new InitError(`--root must be the Git root: ${gitRoot}`, EXIT.ENVIRONMENT);
  }
}

export function projectName(root) {
  return basename(root)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
}

export function emit(result, format = "json") {
  if (format === "json") {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  process.stdout.write(`${result.mode.toUpperCase()} ${result.skill} at ${result.root}\n`);
  for (const operation of result.operations) {
    process.stdout.write(`- ${operation.action}: ${operation.path ?? operation.command}${operation.detail ? ` (${operation.detail})` : ""}\n`);
  }
  if (result.files?.length) {
    process.stdout.write("Planned file contents:\n");
    for (const file of result.files) {
      process.stdout.write(`--- ${file.path}${file.redacted ? " (sensitive values redacted)" : ""}\n`);
      process.stdout.write(file.content.endsWith("\n") ? file.content : `${file.content}\n`);
    }
  }
  if (result.pending?.length) {
    process.stdout.write("Pending commands:\n");
    for (const command of result.pending) {
      const display = typeof command === "string"
        ? command
        : [command.command, ...(command.args ?? [])].join(" ");
      process.stdout.write(`- ${display}\n`);
    }
  }
}

export function handleError(error, help) {
  const normalized = error instanceof InitError
    ? error
    : new InitError(error?.message ?? String(error), EXIT.IO);
  process.stderr.write(`${normalized.name}: ${normalized.message}\n`);
  if (normalized.details) process.stderr.write(`${JSON.stringify(normalized.details)}\n`);
  if (normalized.code === EXIT.USAGE && help) process.stderr.write(`\n${help}\n`);
  process.exitCode = normalized.code;
}
