import { readFileSync, readdirSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";
import { TextDecoder } from "node:util";
import { check, frontmatter, noLinks } from "./catalog.mjs";
import { parseMarkdown, sourceOrigin } from "./links.mjs";

const within = (base, path) => path === base || path.startsWith(`${base}/`);
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const manager =
  /(?:\bsync-(?:skills|my-skills|agent-assets)\b|github:dragoscirjan\/ai|scripts\/skills\/sync\.mjs|catalog\/skill-catalog|\bselection manager\b|\bNode\.js installation CLI\b)/i;
const collectionPath =
  /^(?:catalog\/|scripts\/skills\/|(?:AGENTS|CONTRIBUTING|VALIDATION)\.md$|docs\/(?:guide\/install|maintenance\/|skills\/|reference\/|workflows\/))/;
const legalName =
  /^(?:LICEN[CS]E(?:[._-].*)?|COPYING(?:[._-].*)?|NOTICE(?:[._-].*)?|THIRD_PARTY_NOTICES(?:[._-].*)?)$/i;
const instructionFile = /\/SKILL\.md$/i;
const importPaths =
  /(?:\bfrom\s*|\bimport\s*\(|\brequire\s*\(|\bimport\s*)\s*["'](\.{1,2}\/[^"']+)["']/g;
function decode(value, context) {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new Error(`Invalid reference encoding: ${context.entry.name}/${context.file}`);
  }
}
function contextFor(entry, plan, file, profile) {
  const origins = plan.linkSources.flatMap((candidate) =>
    [candidate.source, candidate.upstream]
      .filter(Boolean)
      .map((source) => ({ ...sourceOrigin(source, plan), name: candidate.name })),
  );
  return {
    entry,
    plan,
    file,
    profile,
    origins,
    current: sourceOrigin(entry.source, plan),
    allowed: new Set([entry.name, ...entry.prerequisites]),
    names: new Set(plan.linkSources.map((source) => source.name)),
  };
}
function named(name, context) {
  check(
    context.allowed.has(name),
    `Undeclared skill reference: ${context.entry.name} -> ${name} (${context.file})`,
  );
}
function ownerAt(path, repository, context) {
  return context.origins
    .filter((source) => source.repository === repository && within(source.path, path))
    .sort((a, b) => b.path.length - a.path.length)[0]?.name;
}
function targetName(href, context, helper = false) {
  if (!href || href.startsWith("#") || href.startsWith("?")) return;
  const value = decode(href.split(/[?#]/)[0], context);
  if (context.profile) {
    const profile = value.match(/^\/skills\/([a-z][a-z0-9-]*)(?:[/.]|$)/);
    if (profile) return profile[1];
  }
  if (/^https?:\/\//i.test(value)) {
    for (const source of [...context.origins].sort((a, b) => b.path.length - a.path.length)) {
      const prefix = source.repository.replace(/\.git$/, "") + "/";
      if (!value.startsWith(prefix)) continue;
      const tail = value.slice(prefix.length);
      if (!/^(?:tree|blob)\//.test(tail)) continue;
      const marker = `/${source.path}`;
      const at = tail.indexOf(marker);
      if (at >= 0 && (tail.length === at + marker.length || tail[at + marker.length] === "/"))
        return source.name;
    }
    if (!context.profile && value.startsWith(context.plan.repository + "/")) {
      const path = value
        .replace(context.plan.repository + "/", "")
        .replace(/^(?:blob|tree)\/[^/]+\//, "");
      check(
        !collectionPath.test(path),
        `Collection guidance is not portable: ${context.entry.name}/${context.file}`,
      );
    }
    const skill = value.match(/\/skills\/(?:[^/]+\/)*([a-z][a-z0-9-]*)(?:\/SKILL\.md)?\/?$/);
    if (skill && (context.names.has(skill[1]) || instructionFile.test(value))) return skill[1];
    if (instructionFile.test(value)) return posix.basename(posix.dirname(value));
    return;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("/")) return;
  const path = posix.normalize(
    posix.join(posix.dirname(posix.join(context.current.path, context.file)), value),
  );
  if (within(context.current.path, path)) return context.entry.name;
  if (!context.profile && context.current.repository === context.plan.repository)
    check(
      !collectionPath.test(path),
      `Collection guidance is not portable: ${context.entry.name}/${context.file}`,
    );
  const owner = ownerAt(path, context.current.repository, context);
  if (owner) return owner;
  if (instructionFile.test(path)) return posix.basename(posix.dirname(path));
  check(
    !helper,
    `Helper import leaves the independent package: ${context.entry.name}/${context.file}`,
  );
}
function reference(href, context, helper = false) {
  const name = targetName(href, context, helper);
  if (name && !context.attribution) named(name, context);
}
function invocations(text, context) {
  for (const match of text.matchAll(
    /(?:\/skill:|\bskills?:)([a-z][a-z0-9-]*)|--skill\s+["']?([a-z][a-z0-9-]*)|\bSkill\s*\(\s*["']?([a-z][a-z0-9-]*)["']?\s*\)/g,
  )) {
    const name = match[1] ?? match[2] ?? match[3];
    if ((match[1] || match[3]) && ["name", "skill-name"].includes(name) && !context.names.has(name))
      continue;
    named(name, context);
  }
  for (const match of text.matchAll(
    /\b(?:require[sd]?|invoke|call|load|select|use)\s+(?:the\s+)?["'`]?([a-z][a-z0-9-]*)["'`]?(\s+skill\b)?(?=([^\n]*))/gi,
  )) {
    const name = match[1].toLowerCase();
    if (
      [
        "a",
        "an",
        "any",
        "another",
        "this",
        "that",
        "the",
        "current",
        "installed",
        "selected",
        "required",
        "same",
        "relevant",
        "appropriate",
        "specific",
      ].includes(name)
    )
      continue;
    if (
      !match[2] &&
      /^\s+(?:CLI|command|binary|package|application|file|format|renderer|tool)\b/i.test(match[3])
    )
      continue;
    // Ordinary domain phrases are not names of installed instructions.
    if (name === "coding" && /^\s+(?:standards|conventions|guidance|style)\b/i.test(match[3]))
      continue;
    if (
      match[2] ||
      (context.names.has(name) &&
        (/^(?:require[sd]?|invoke|call|load|select)\b/i.test(match[0]) ||
          (context.usage && /^use\b/i.test(match[0]))))
    )
      named(name, context);
  }
}
function markupText(text, context) {
  invocations(text, context);
  if (context.attribution) return;
  for (const name of context.names)
    if (
      name.includes("-") &&
      new RegExp(`(?<![a-z0-9-])${escape(name)}(?![a-z0-9-]|\\.[a-z0-9])`).test(text)
    )
      named(name, context);
}
const overviewAttribution = new Set(["origin", "source", "inspiration"]);
function overviewText(node, prose = false) {
  if (prose && ["link", "linkReference", "inlineCode"].includes(node.type)) return "";
  return node.value ?? node.children?.map((child) => overviewText(child, prose)).join("") ?? "";
}
function overviewSections(tree) {
  const sections = new Map(),
    references = new Map();
  let section = "intent";
  for (const block of tree.children) {
    if (block.type === "heading")
      section = block.depth === 1 ? "intent" : overviewText(block).toLowerCase().trim();
    const attribution =
      block.type === "paragraph" &&
      /^(?:(?:adapted|derived) from|inspired by|based on|source:)\s/i.test(overviewText(block));
    const blockSection = attribution ? "origin" : section;
    const pending = [block];
    while (pending.length) {
      const node = pending.pop();
      sections.set(node, blockSection);
      if (node.type === "linkReference")
        references.set(
          node.identifier,
          (references.get(node.identifier) ?? true) && overviewAttribution.has(blockSection),
        );
      if (node.children) pending.push(...node.children);
    }
  }
  for (const node of sections.keys())
    if (node.type === "definition")
      sections.set(node, references.get(node.identifier) ? "origin" : "dependencies");
  return sections;
}
function verifyStandaloneInstall(node, context, invalid) {
  check(
    ["sh", "bash", "shell"].includes(node.lang),
    invalid("install examples must use shell syntax"),
  );
  let ref = null,
    commands = 0;
  for (const line of node.value
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)) {
    const assignment = line.match(
      /^ref="(<published-tag-or-commit>|[A-Za-z0-9][A-Za-z0-9._/-]*)"$/,
    );
    if (assignment) {
      check(ref === null, invalid("duplicate source revision"));
      ref = assignment[1];
      continue;
    }
    const command = line.match(
      /^npx -y skills@1\.7\.4 add (?:"([^"\n]+)"|'([^'\n]+)'|(\S+)) --skill ([a-z][a-z0-9-]*)$/,
    );
    check(command, invalid("use the pinned standalone acquisition command only"));
    const name = command[4],
      url = command[1] ?? command[2] ?? command[3];
    check(context.allowed.has(name), invalid("installation selects an unrelated skill"));
    const source = context.plan.linkSources.find((entry) => entry.name === name)?.source;
    check(source, invalid("unknown installation source"));
    const origin = sourceOrigin(source, context.plan),
      prefix = `${origin.repository}/tree/`,
      suffix = `/${origin.path}`;
    check(
      url.startsWith(prefix) && url.endsWith(suffix),
      invalid("installation source does not match the selected skill"),
    );
    const revision = url.slice(prefix.length, -suffix.length);
    check(
      (ref !== null && ["$ref", "${ref}"].includes(revision)) || /^[a-f0-9]{40}$/.test(revision),
      invalid("identify a published tag or commit"),
    );
    if (source.type === "github")
      check(
        revision === source.revision ||
          (ref === source.revision && ["$ref", "${ref}"].includes(revision)),
        invalid("preserve the upstream source pin"),
      );
    commands++;
  }
  check(commands > 0, invalid("missing standalone installation command"));
}
function verifyOverview(sections, context) {
  const allowed = new Set([
    "intent",
    "purpose",
    "dependencies",
    "usage",
    "install",
    "installation",
    ...overviewAttribution,
  ]);
  const invalid = (reason) =>
    `Invalid skill overview: ${context.entry.name}/${context.file} (${reason})`;
  for (const [node, section] of sections) {
    check(
      allowed.has(section),
      invalid(
        "section must describe this skill, its usage, standalone install, dependencies, or attribution",
      ),
    );
    check(
      !["html", "image", "imageReference", "blockquote", "thematicBreak", "table"].includes(
        node.type,
      ),
      invalid(node.type),
    );
    check(!(node.type === "list" && node.ordered), invalid("workflow steps"));
    if (node.type === "link" || node.type === "definition")
      check(
        !legalName.test(posix.basename(decode(node.url.split(/[?#]/)[0], context))),
        invalid("license reference"),
      );
    if (node.type === "code") {
      if (["install", "installation"].includes(section)) {
        verifyStandaloneInstall(node, context, invalid);
        continue;
      }
      check(
        section === "usage" && [null, "text", "plaintext"].includes(node.lang),
        invalid("code examples belong only to Usage or Install"),
      );
    }
    if (!["paragraph", "code"].includes(node.type)) continue;
    const text = overviewText(node),
      prose = overviewText(node, true);
    check(
      !/\.(?:claude|opencode|agents|pi)(?:\/|\b)|\bClaude Code\b|--(?:agent|skills-dir|global|scope)\b/i.test(
        text,
      ) &&
        (["install", "installation"].includes(section) || !/\bnpx\b/i.test(text)),
      invalid("deployment guidance"),
    );
    check(!/\blicen[cs](?:es?|ing)\b/i.test(text), invalid("license material"));
    check(!/\/skill:|--skill\b|\bSkill\s*\(/.test(text), invalid("harness-specific invocation"));
    if (!["usage", "install", "installation"].includes(section))
      check(
        !/\b(?:for example|to use this skill|load the installed|run the following|before you start)\b|\b(?:first|then|next)\s+(?:run|load|use|read|install|check|make|execute|apply|ask|write)\b/i.test(
          prose,
        ),
        invalid("usage or workflow guidance outside its section"),
      );
    if (overviewAttribution.has(section))
      check(
        !/\b(?:use|load|run|invoke|call|install|follow|adapt|apply|combine|activate|fetch|execute|requires?)\s+/i.test(
          prose,
        ),
        invalid("attribution must be factual, not procedural"),
      );
  }
}
function checkMarkdown(text, context) {
  const { tree } = parseMarkdown(text),
    sections =
      !context.profile && /^README(?:\.[^/.]+)?$/i.test(context.file)
        ? overviewSections(tree)
        : null,
    pending = [tree];
  if (context.file === "SKILL.md") {
    const values = [frontmatter(text, context.entry.name)],
      seen = new Set();
    while (values.length) {
      const value = values.pop();
      if (typeof value === "string") pending.push(parseMarkdown(value).tree);
      else if (value && typeof value === "object" && !seen.has(value)) {
        seen.add(value);
        values.push(...Object.values(value));
      }
    }
  }
  while (pending.length) {
    const node = pending.pop(),
      current =
        sections && overviewAttribution.has(sections.get(node))
          ? { ...context, attribution: true }
          : sections?.get(node) === "usage"
            ? { ...context, usage: true }
            : context;
    if (node.type === "text") markupText(node.value, current);
    if (node.type === "inlineCode") {
      if (!current.attribution && current.names.has(node.value)) named(node.value, current);
      invocations(node.value, current);
    }
    if (["link", "image", "definition"].includes(node.type)) reference(node.url, current);
    if (node.type === "code") {
      if (current.usage) markupText(node.value, current);
      else invocations(node.value, current);
      for (const match of node.value.matchAll(importPaths)) reference(match[1], current);
    }
    if (node.type === "html") {
      invocations(node.value, current);
      for (const match of node.value.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi))
        reference(match[1], current);
    }
    if (node.children) for (const child of node.children) pending.push(child);
  }
  if (sections) verifyOverview(sections, context);
}
export function verifyMarkdownIndependence(text, entry, plan, file, { profile = false } = {}) {
  const context = contextFor(entry, plan, file, profile);
  if (!profile)
    check(!manager.test(text), `Collection guidance is not portable: ${entry.name}/${file}`);
  checkMarkdown(text, context);
}
export function verifySkillIndependence(root, entry, plan) {
  const pending = [root],
    legal = new Set((entry.legal ?? []).map((file) => file.target));
  while (pending.length) {
    const directory = pending.pop();
    noLinks(root, directory);
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, item.name),
        file = relative(root, path).split(sep).join("/");
      noLinks(root, path);
      if (item.isDirectory()) {
        pending.push(path);
        continue;
      }
      check(item.isFile(), `Unsupported package file: ${entry.name}/${file}`);
      if (legal.has(file) || legalName.test(item.name)) continue;
      const bytes = readFileSync(path);
      let text;
      try {
        text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
      } catch {
        check(
          !/\.(?:md|mdx|txt|[cm]?js|tsx?|py|sh)$/i.test(item.name),
          `Invalid text encoding: ${entry.name}/${file}`,
        );
        continue;
      }
      if (/\.(?:md|mdx|txt)$/i.test(item.name) || /^readme(?:\.|$)/i.test(item.name))
        verifyMarkdownIndependence(text, entry, plan, file);
      else {
        const context = contextFor(entry, plan, file, false);
        check(!manager.test(text), `Collection guidance is not portable: ${entry.name}/${file}`);
        invocations(text, context);
        for (const match of text.matchAll(importPaths)) reference(match[1], context, true);
        if (/\.(?:html|svg)$/i.test(item.name))
          for (const match of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi))
            reference(match[1], context);
      }
    }
  }
}
