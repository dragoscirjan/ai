import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { verifiedTool } from "./archify-tool.mjs";
import { browser } from "./browser.mjs";
import { catalog, root } from "./data.mjs";
import { diagramSpecs } from "./diagram-specs.mjs";
import { publicToolEnvironment } from "./environment.mjs";
import { hash, passingGates, publicText } from "./verify.mjs";

export const sha256 = hash;
export const checkPublicArtifact = publicText;
export async function canonicalSvg(b, html, downloads) {
  await b.navigate(pathToFileURL(html).href);
  await b.evaluate(
    'document.querySelector("#btn-export").click(); document.querySelector(\'[data-format="svg"]\').click()',
  );
  const begin = await b.waitEvent("Browser.downloadWillBegin");
  if (!/^[a-f0-9-]+$/i.test(begin.guid)) throw new Error("Invalid browser download ID");
  const result = await b.waitEvent(
    "Browser.downloadProgress",
    (event) => event.guid === begin.guid && event.state !== "inProgress",
  );
  if (result.state !== "completed") throw new Error("Canonical SVG export did not complete");
  const svg = readFileSync(join(downloads, begin.guid));
  checkPublicArtifact(svg);
  if (
    !svg.includes(Buffer.from("<svg")) ||
    /<script\b|\son(?:load|error)\s*=/i.test(svg.toString("utf8"))
  )
    throw new Error("Invalid or active SVG export");
  return svg;
}
export async function renderDiagrams(selected = []) {
  const specs = diagramSpecs();
  if (new Set(selected).size !== selected.length || selected.some((id) => !specs.has(id)))
    throw new Error("Use only distinct known diagram IDs");
  const tool = verifiedTool();
  const targets = selected.length ? selected : [...specs.keys()];
  const evidence = join(root, ".docs-artifacts/archify", `review-${randomUUID()}`);
  const downloads = join(evidence, "downloads");
  mkdirSync(downloads, { recursive: true });
  const publicDir = join(root, "docs/public/diagrams");
  mkdirSync(publicDir, { recursive: true });
  const manifestPath = join(root, "docs/diagrams/manifest.json");
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : {
        schemaVersion: 1,
        tool: { repository: tool.entry.source.repository, revision: tool.entry.source.revision },
        artifacts: {},
      };
  if (manifest.tool.revision !== tool.entry.source.revision)
    throw new Error("Review the diagram provenance before changing the renderer pin");
  // Chromium singleton sockets have a short OS path limit; keep disposable state outside the long checkout path.
  const toolHome = mkdtempSync(join(tmpdir(), "ai-skills-render-"));
  const rendererEnv = publicToolEnvironment(toolHome);
  let b;
  try {
    b = await browser();
    await b.send("Browser.setDownloadBehavior", {
      behavior: "allowAndName",
      downloadPath: downloads,
      eventsEnabled: true,
    });
    for (const id of targets) {
      const specification = specs.get(id);
      const relative = `docs/diagrams/${id}.json`;
      const candidate = Buffer.from(JSON.stringify(specification, null, 2) + "\n");
      writeFileSync(join(root, relative), candidate);
      const result = spawnSync(
        process.execPath,
        [
          join(tool.directory, "bin/archify.mjs"),
          "finalize",
          specification.diagram_type,
          relative,
          specification.meta.output,
          "--repo-root",
          ".",
          "--quality",
          "showcase",
          "--out-dir",
          join(evidence, id),
          "--json",
        ],
        {
          cwd: root,
          env: rendererEnv,
          encoding: "utf8",
          timeout: 180000,
          maxBuffer: 8 * 1024 * 1024,
        },
      );
      let receipt;
      try {
        receipt = JSON.parse(result.stdout);
      } catch (error) {
        throw new Error(
          `No valid finalize receipt for ${id}: ${result.stderr ?? result.error ?? ""}`,
          { cause: error },
        );
      }
      if (receipt.update?.noticeRequired) console.log(receipt.update.noticeText);
      if (
        result.status !== 0 ||
        !receipt.ok ||
        receipt.status !== "pass" ||
        receipt.quality !== "showcase" ||
        !passingGates(receipt.gates) ||
        receipt.browserCheck?.ran !== true
      )
        throw new Error(
          `Finalize failed for ${id}: ${JSON.stringify(receipt.diagnostics ?? receipt)}`,
        );
      if (receipt.specification.sha256 !== sha256(candidate))
        throw new Error("Candidate changed during finalize");
      const htmlPath = join(root, specification.meta.output);
      const html = readFileSync(htmlPath);
      if (sha256(html) !== receipt.artifact.sha256)
        throw new Error("Delivered artifact changed after finalize");
      checkPublicArtifact(html);
      const svg = await canonicalSvg(b, htmlPath, downloads);
      writeFileSync(join(publicDir, `${id}.html`), html);
      writeFileSync(join(publicDir, `${id}.svg`), svg);
      manifest.artifacts[id] = {
        candidateSha256: sha256(candidate),
        htmlSha256: sha256(html),
        svgSha256: sha256(svg),
        gates: receipt.gates,
        quality: "showcase",
        repository: specification.meta.repository,
        visualReview: "not-requested",
      };
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
      console.log(`${id}: all four finalize gates passed; canonical dual-theme SVG exported.`);
    }
  } finally {
    try {
      if (b) await b.close();
    } finally {
      rmSync(toolHome, { recursive: true, force: true });
    }
  }
  for (const legal of catalog().byName.get("archify").legal) {
    const path = join(root, "docs/public/notices/archify", legal.target);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, readFileSync(join(tool.directory, legal.target)));
  }
  return targets.length;
}
