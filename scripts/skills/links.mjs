import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, sep } from "node:path";
import { TextDecoder } from "node:util";
import { fromMarkdown } from "mdast-util-from-markdown";
import { check, noLinks } from "./catalog.mjs";

const slash = (path) => path.split(sep).join("/");
const within = (root, path) => path === root || path.startsWith(`${root}/`);
const encode = (value) =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
const urlPath = (path) => path.split("/").map(encode).join("/");
const safeSuffix = (value) =>
  [...value]
    .map((c) =>
      c.charCodeAt(0) <= 32 || c.charCodeAt(0) === 127 || "\\<>\"'()`".includes(c) ? encode(c) : c,
    )
    .join("");
function origin(source, plan) {
  return source.type === "local"
    ? { repository: plan.repository, ref: plan.ref, path: source.path }
    : { repository: source.repository, ref: source.revision, path: source.path };
}
function sourceUrl(source, path, suffix, image, directory) {
  const repository = source.repository.replace(/\.git$/, "");
  const base = image
    ? repository.replace("https://github.com/", "https://raw.githubusercontent.com/")
    : `${repository}/${directory ? "tree" : "blob"}`;
  return `${base}/${encode(source.ref)}/${urlPath(path)}${safeSuffix(suffix)}`;
}
export function rewriteMarkdown(text, { entry, plan, file }) {
  const offset = text.match(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)?.[0].length ?? 0;
  const body = text.slice(offset),
    spans = [];
  function capture(token) {
    spans.push({
      start: token.start.offset + offset,
      end: token.end.offset + offset,
      node: this.stack.at(-1),
    });
    this.buffer();
  }
  const tree = fromMarkdown(body, {
    mdastExtensions: [
      { enter: { resourceDestinationString: capture, definitionDestinationString: capture } },
    ],
  });
  const imageReferences = new Set(),
    pending = [tree];
  while (pending.length) {
    const node = pending.pop();
    if (node.type === "imageReference") imageReferences.add(node.identifier);
    if (node.children) for (const child of node.children) pending.push(child);
  }
  const current = origin(entry.source, plan);
  const sourceFile = posix.join(current.path, file);
  const destinationFile = join(entry.destinations[0], ...file.split("/"));
  const sources = plan.linkSources.map((candidate) => ({
    ...origin(candidate.source, plan),
    name: candidate.name,
  }));
  const changes = [];
  for (const span of spans) {
    const href = span.node.url;
    if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || /^[/#?]/.test(href)) continue;
    const split = href.search(/[?#]/),
      path = split < 0 ? href : href.slice(0, split),
      suffix = split < 0 ? "" : href.slice(split);
    let decoded;
    try {
      decoded = decodeURIComponent(path);
    } catch {
      throw new Error(`Invalid URL encoding in ${entry.name}/${file}: ${href}`);
    }
    check(
      [...decoded].every((c) => c.charCodeAt(0) >= 32 && c.charCodeAt(0) !== 127),
      `Invalid source link in ${entry.name}/${file}`,
    );
    const resolved = posix.normalize(posix.join(posix.dirname(sourceFile), decoded));
    check(
      resolved !== ".." && !resolved.startsWith("../"),
      `Source link escapes repository in ${entry.name}/${file}: ${href}`,
    );
    if (within(current.path, resolved)) continue;
    const owner = sources
      .filter(
        (candidate) =>
          candidate.repository === current.repository &&
          candidate.ref === current.ref &&
          within(candidate.path, resolved),
      )
      .sort((a, b) => b.path.length - a.path.length)[0];
    const selected = owner && plan.entries.find((candidate) => candidate.name === owner.name);
    let replacement;
    if (selected) {
      const target = join(
        selected.destinations[0],
        ...posix.relative(owner.path, resolved).split("/"),
      );
      if (
        posix.normalize(
          posix.join(
            slash(join(entry.destinations[0], ...posix.dirname(file).split("/"))),
            decoded,
          ),
        ) === slash(target)
      )
        continue;
      const path = slash(relative(dirname(destinationFile), target));
      replacement = `${urlPath(path)}${decoded.endsWith("/") && !path.endsWith("/") ? "/" : ""}${safeSuffix(suffix)}`;
    } else {
      const image =
        span.node.type === "image" ||
        (span.node.type === "definition" && imageReferences.has(span.node.identifier));
      replacement = sourceUrl(
        current,
        resolved,
        suffix,
        image,
        decoded.endsWith("/") || owner?.path === resolved,
      );
    }
    changes.push({
      start: span.start,
      end: span.end,
      from: text.slice(span.start, span.end),
      to: replacement,
    });
  }
  let result = text;
  for (const change of changes.sort((a, b) => b.start - a.start))
    result = result.slice(0, change.start) + change.to + result.slice(change.end);
  return { text: result, changes };
}
// Transform original source-layout URLs once, on fresh acquisition before final publication.
export function rebaseSkillLinks(root, entry, plan) {
  const pending = [root],
    legal = new Set(entry.legal.map((file) => file.target));
  let changed = 0;
  while (pending.length) {
    const directory = pending.pop();
    noLinks(root, directory);
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, item.name),
        file = slash(relative(root, path));
      noLinks(root, path);
      if (item.isDirectory()) pending.push(path);
      else if (/\.md$/i.test(item.name) && !legal.has(file)) {
        const bytes = readFileSync(path);
        new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        const result = rewriteMarkdown(bytes.toString("utf8"), { entry, plan, file });
        if (result.changes.length) {
          writeFileSync(path, result.text);
          changed += result.changes.length;
        }
      }
    }
  }
  return changed;
}
