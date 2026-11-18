import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { publicToolEnvironment } from "./environment.mjs";

// Use a fresh, disposable profile and Chromium's private pipe, not a personal browser or TCP debugger.
export async function browser() {
  const profile = mkdtempSync(join(tmpdir(), "ai-skills-browser-"));
  const child = spawn(
    process.env.ARCHIFY_CHROME ?? "chromium",
    [
      "--headless=new",
      "--remote-debugging-pipe",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    {
      env: publicToolEnvironment(join(profile, "tool-home")),
      stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"],
    },
  );
  const pending = new Map();
  const events = [];
  let sequence = 0;
  let buffer = "";
  let diagnostic = "";
  let terminated = false;
  const fail = (error) => {
    for (const item of pending.values()) {
      clearTimeout(item.timer);
      item.reject(error);
    }
    pending.clear();
  };
  child.stderr.setEncoding("utf8").on("data", (part) => {
    diagnostic = (diagnostic + part).slice(-2000);
  });
  child.stdio[3].on("error", fail);
  child.stdio[4].on("error", fail);
  child.on("error", (error) => {
    terminated = true;
    fail(error);
  });
  child.on("exit", () => {
    terminated = true;
    fail(new Error(`Chromium exited: ${diagnostic}`));
  });
  child.stdio[4].setEncoding("utf8").on("data", (part) => {
    buffer += part;
    if (buffer.length > 16 * 1024 * 1024) {
      fail(new Error("DevTools response exceeded its bound"));
      child.kill();
      return;
    }
    let end;
    while ((end = buffer.indexOf("\0")) !== -1) {
      const text = buffer.slice(0, end);
      buffer = buffer.slice(end + 1);
      if (!text) continue;
      let message;
      try {
        message = JSON.parse(text);
      } catch (error) {
        fail(error);
        child.kill();
        return;
      }
      if (message.id) {
        const item = pending.get(message.id);
        if (item) {
          pending.delete(message.id);
          clearTimeout(item.timer);
          if (message.error) item.reject(new Error(JSON.stringify(message.error)));
          else item.resolve(message.result);
        }
      } else {
        events.push(message);
        if (events.length > 1000) events.shift();
      }
    }
  });
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      if (terminated) {
        reject(new Error("Chromium is not running"));
        return;
      }
      const id = ++sequence;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`DevTools timeout: ${method}`));
      }, 20000);
      pending.set(id, { resolve, reject, timer });
      child.stdio[3].write(
        JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + "\0",
        (error) => {
          if (error) {
            clearTimeout(timer);
            pending.delete(id);
            reject(error);
          }
        },
      );
    });
  const waitEvent = async (method, predicate = () => true) => {
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      const index = events.findIndex((event) => event.method === method && predicate(event.params));
      if (index !== -1) return events.splice(index, 1)[0].params;
      if (terminated) throw new Error("Chromium exited before its event");
      await delay(20);
    }
    throw new Error(`DevTools event timeout: ${method}`);
  };
  const close = async () => {
    try {
      if (!terminated) await send("Browser.close");
    } finally {
      if (!terminated) child.kill("SIGTERM");
      const deadline = Date.now() + 5000;
      while (!terminated && Date.now() < deadline) await delay(20);
      if (!terminated) {
        child.kill("SIGKILL");
        await delay(100);
      }
      fail(new Error("Browser closed"));
      rmSync(profile, { recursive: true, force: true });
    }
  };
  try {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const call = (method, params) => send(method, params, sessionId);
    await call("Page.enable");
    await call("Runtime.enable");
    await call("Page.setLifecycleEventsEnabled", { enabled: true });
    const evaluate = async (expression) => {
      const result = await call("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (result.exceptionDetails)
        throw new Error(`Browser evaluation failed: ${result.exceptionDetails.text}`);
      return result.result.value;
    };
    const navigate = async (url) => {
      const result = await call("Page.navigate", { url });
      if (result.errorText) throw new Error(result.errorText);
      await waitEvent(
        "Page.lifecycleEvent",
        (event) => event.loaderId === result.loaderId && event.name === "load",
      );
      await evaluate(
        "document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))",
      );
    };
    return { send, call, evaluate, navigate, waitEvent, close, events };
  } catch (error) {
    await close();
    throw error;
  }
}
