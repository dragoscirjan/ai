import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import { browser } from "./browser.mjs";
import { catalog, docsBase, groups, root } from "./data.mjs";
import { publicToolEnvironment } from "./environment.mjs";

async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const port = server.address().port;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}
async function until(check, label) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (await check()) return;
    await delay(50);
  }
  throw new Error(`Browser check timed out: ${label}`);
}
export async function checkBrowser(mode = "preview") {
  if (!["preview", "dev"].includes(mode)) throw new Error("Choose preview or dev");
  const base = docsBase();
  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const directory = join(
    root,
    ".docs-artifacts/browser",
    `${mode}-${base === "/" ? "root" : "hosted"}-${randomUUID()}`,
  );
  mkdirSync(directory, { recursive: true });
  const home = mkdtempSync(join(tmpdir(), "ai-skills-server-"));
  const env = publicToolEnvironment(home);
  env.DOCS_BASE = base;
  const child = spawn(
    process.execPath,
    [
      join(root, "node_modules/vitepress/bin/vitepress.js"),
      mode,
      "docs",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    { cwd: root, env, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"] },
  );
  let log = "";
  let exited = false;
  const capture = (chunk) => {
    log = (log + chunk).slice(-4000);
  };
  child.stdout.setEncoding("utf8").on("data", capture);
  child.stderr.setEncoding("utf8").on("data", capture);
  child.on("exit", () => {
    exited = true;
  });
  child.on("error", (error) => {
    exited = true;
    capture(error.message);
  });
  let b;
  let failure;
  const cleanupErrors = [];
  const report = {
    mode,
    base,
    pages: [],
    screenshots: [],
    search: false,
    mobileMenu: false,
    notices: false,
    skillInstalls: [],
    groups: [],
  };
  try {
    await until(async () => {
      if (exited) throw new Error(`Site server exited: ${log}`);
      try {
        return (await fetch(origin + base)).ok;
      } catch {
        return false;
      }
    }, "local server");
    b = await browser();
    await b.call("Network.enable");
    const screenshot = async (name) => {
      const data = await b.call("Page.captureScreenshot", { format: "png" });
      const file = join(directory, `${name}.png`);
      writeFileSync(file, Buffer.from(data.data, "base64"));
      report.screenshots.push(file);
    };
    for (const [label, width, height] of [
      ["desktop", 1440, 1000],
      ["mobile", 390, 844],
    ]) {
      await b.call("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: label === "mobile",
      });
      await b.call("Emulation.setTouchEmulationEnabled", {
        enabled: label === "mobile",
        maxTouchPoints: 1,
      });
      for (const page of [
        "",
        "guide/start.html",
        "guide/install.html",
        "skills/scaffold.html",
        "skills/coding-with-rules.html",
        "skills/archify.html",
        "skills/sync-my-skills.html",
        "skills/init-project.html",
        "skills/grilling.html",
        ...groups.map((group) => `groups/${group.id}.html`),
        "workflows/install-selected-skills.html",
        "reference/relationships.html",
        "reference/notices.html",
      ]) {
        await b.navigate(origin + base + page);
        await until(
          () => b.evaluate('Boolean(document.querySelector(".VPContent"))'),
          "page content",
        );
        const metrics = await b.evaluate(
          `({width:innerWidth,scroll:document.documentElement.scrollWidth,title:document.title,h1:document.querySelector("h1")?.textContent,images:Array.from(document.images).every(image=>image.complete&&image.naturalWidth>0)})`,
        );
        assert.ok(metrics.scroll <= metrics.width, `${label} horizontal overflow: ${page}`);
        assert.ok(metrics.h1, `Missing page heading: ${page}`);
        assert.ok(metrics.images, `Unloaded image: ${page}`);
        const links = await b.evaluate(
          'Array.from(document.querySelectorAll("a[href]")).map(a=>a.href).filter(h=>h.startsWith(location.origin))',
        );
        assert.ok(
          links.every((href) => new URL(href).pathname.startsWith(base)),
          `Link escaped base: ${page}`,
        );
        if (page.startsWith("skills/")) {
          const name = page.slice("skills/".length, -".html".length);
          const command = await b.evaluate(
            'document.querySelector(".vp-doc div.language-sh code")?.textContent.trim()',
          );
          assert.equal(
            command,
            catalog().byName.get(name).install.argv.join(" "),
            `Wrong install command: ${page}`,
          );
          report.skillInstalls.push({ viewport: label, skill: name });
        }
        if (page.startsWith("groups/")) {
          const id = page.slice("groups/".length, -".html".length);
          const group = groups.find((item) => item.id === id);
          const members = await b.evaluate(
            'Array.from(document.querySelectorAll(".vp-doc a[href]")).map(a=>new URL(a.href).pathname).filter(p=>p.includes("/skills/")).map(p=>p.split("/").at(-1).replace(/\\.html$/, ""))',
          );
          assert.deepEqual(new Set(members), new Set(group.skills), `Wrong group members: ${id}`);
          report.groups.push({ viewport: label, group: id });
        }
        report.pages.push({
          viewport: label,
          page: page || "index",
          horizontalOverflow: false,
          imagesLoaded: true,
        });
        if (
          [
            "",
            "guide/start.html",
            "workflows/install-selected-skills.html",
            "groups/documentation.html",
            "groups/utility.html",
            "skills/archify.html",
            "skills/coding-with-rules.html",
          ].includes(page)
        )
          await screenshot(
            `${label}-${page ? page.split("/").at(-1).replace(".html", "") : "home"}`,
          );
      }
      await b.navigate(origin + base);
      if (label === "mobile") {
        await b.evaluate('document.querySelector(".VPNavBarHamburger").click()');
        await until(
          () =>
            b.evaluate(
              'document.querySelector(".VPNavBarHamburger")?.getAttribute("aria-expanded")==="true"',
            ),
          "mobile navigation",
        );
        assert.ok(
          await b.evaluate(
            'Array.from(document.querySelectorAll(".VPNavScreen a")).some(a=>a.textContent.includes("Skills"))',
          ),
        );
        report.mobileMenu = true;
        await b.evaluate('document.querySelector(".VPNavBarHamburger").click()');
      }
      await b.evaluate('document.querySelector(".VPNavBarSearch button").click()');
      await until(
        () => b.evaluate('Boolean(document.querySelector("#localsearch-input"))'),
        "local search dialog",
      );
      await b.evaluate(
        'const input=document.querySelector("#localsearch-input");input.value="scaffold";input.dispatchEvent(new Event("input",{bubbles:true}));',
      );
      await until(
        () =>
          b.evaluate(
            'Array.from(document.querySelectorAll(".VPLocalSearchBox a")).some(a=>a.href.includes("/skills/scaffold.html"))',
          ),
        "local search result",
      );
      await b.evaluate(
        'Array.from(document.querySelectorAll(".VPLocalSearchBox a")).find(a=>a.href.includes("/skills/scaffold.html")).click()',
      );
      await until(
        () =>
          b.evaluate(
            'location.pathname.endsWith("/skills/scaffold.html") && document.querySelector("h1")?.textContent.includes("scaffold")',
          ),
        "search navigation",
      );
      await screenshot(`${label}-search-result`);
    }
    report.search = true;
    await b.call("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await b.navigate(origin + base);
    await b.evaluate('document.documentElement.classList.add("dark")');
    await screenshot("desktop-home-dark");
    await b.navigate(origin + base + "reference/notices.html");
    const notices = await b.evaluate(
      'Array.from(document.querySelectorAll(".vp-doc a")).map(a=>a.href).filter(h=>h.startsWith(location.origin))',
    );
    for (const href of notices) {
      const response = await fetch(href);
      assert.equal(response.status, 200, `Legal download failed: ${new URL(href).pathname}`);
    }
    report.notices = true;
    const errors = b.events.filter(
      (event) =>
        event.method === "Runtime.exceptionThrown" ||
        (event.method === "Network.loadingFailed" && !event.params.canceled),
    );
    assert.equal(errors.length, 0, "Browser runtime/network errors");
    writeFileSync(join(directory, "report.json"), JSON.stringify(report, null, 2) + "\n");
  } catch (error) {
    failure = error;
  } finally {
    try {
      if (b) await b.close();
    } catch (error) {
      cleanupErrors.push(error);
    }
    for (const signal of ["SIGTERM", "SIGKILL"]) {
      if (exited || !child.pid) break;
      try {
        if (process.platform === "win32") child.kill(signal);
        else process.kill(-child.pid, signal);
      } catch (error) {
        if (error.code !== "ESRCH") cleanupErrors.push(error);
      }
      const deadline = Date.now() + (signal === "SIGTERM" ? 5000 : 1000);
      while (!exited && Date.now() < deadline) await delay(20);
    }
    try {
      rmSync(home, { recursive: true, force: true });
    } catch (error) {
      cleanupErrors.push(error);
    }
  }
  if (failure && !cleanupErrors.length) throw failure;
  if (failure || cleanupErrors.length)
    throw new AggregateError(
      [...(failure ? [failure] : []), ...cleanupErrors],
      "Browser walkthrough or owned-resource cleanup failed",
    );
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length > 3)
    throw new Error("Usage: node scripts/docs/browser-check.mjs [preview|dev]");
  const report = await checkBrowser(process.argv[2]);
  console.log(
    JSON.stringify({
      mode: report.mode,
      base: report.base,
      pages: report.pages.length,
      search: report.search,
      mobileMenu: report.mobileMenu,
      notices: report.notices,
      screenshots: report.screenshots,
    }),
  );
}
