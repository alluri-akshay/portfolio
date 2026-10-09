import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../app/lib/theme.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function events() {
  const listeners = new Map();
  return {
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener); },
    dispatchEvent(event) {
      for (const listener of [...(listeners.get(event.type) ?? [])]) listener(event);
    },
    listenerCount() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
  };
}

function browser({ saved = null, dark = false, blocked = false, noMedia = false } = {}) {
  const values = new Map(saved === null ? [] : [["portfolio.theme", saved]]);
  const media = Object.assign(events(), { matches: dark });
  const window = Object.assign(events(), {
    localStorage: {
      getItem(key) { if (blocked) throw new Error("Storage blocked"); return values.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error("Storage blocked"); values.set(key, value); },
    },
    matchMedia() { if (noMedia) throw new Error("Media unavailable"); return media; },
  });
  const document = { documentElement: { dataset: {} } };
  const context = vm.createContext({ exports: {}, window, document, Event });
  vm.runInContext(compiled, context);
  const theme = context.exports;
  return {
    theme, window, document, values, media,
    bootstrap() { vm.runInContext(theme.themeInitScript, context); },
    setSystem(dark) { media.matches = dark; media.dispatchEvent({ type: "change" }); },
    setStored(value, key = theme.themeStorageKey) {
      if (value === null) values.delete(key); else values.set(key, value);
      window.dispatchEvent({ type: "storage", key });
    },
  };
}

test("first paint resolves saved and system choices before React runs", () => {
  for (const [saved, dark, expectedPreference, expectedTheme] of [
    [null, false, "system", "light"],
    [null, true, "system", "dark"],
    ["light", true, "light", "light"],
    ["dark", false, "dark", "dark"],
    ["system", true, "system", "dark"],
    ["invalid", true, "system", "dark"],
  ]) {
    const b = browser({ saved, dark });
    b.bootstrap();
    assert.equal(b.document.documentElement.dataset.themePreference, expectedPreference);
    assert.equal(b.document.documentElement.dataset.theme, expectedTheme);
    assert.equal(b.theme.getThemeSnapshot(), expectedPreference + ":" + expectedTheme);
  }
});

test("hydration subscription retains the initialized dark choice", () => {
  const b = browser({ saved: "dark" });
  b.bootstrap();
  assert.equal(b.theme.getServerThemeSnapshot(), "system:light");
  const observed = [];
  const stop = b.theme.subscribeTheme(() => observed.push(b.document.documentElement.dataset.theme));
  assert.deepEqual(observed, ["dark"]);
  assert.equal(b.theme.getThemeSnapshot(), "dark:dark");
  stop();
});

test("explicit choices persist across a new page and ignore device changes", () => {
  const b = browser({ dark: true });
  const stop = b.theme.subscribeTheme(() => {});
  b.theme.setThemePreference("light");
  assert.equal(b.values.get("portfolio.theme"), "light");
  b.setSystem(false);
  b.setSystem(true);
  assert.equal(b.document.documentElement.dataset.theme, "light");
  const nextPage = browser({ saved: b.values.get("portfolio.theme"), dark: true });
  nextPage.bootstrap();
  assert.equal(nextPage.document.documentElement.dataset.theme, "light");
  b.theme.setThemePreference("dark");
  b.setSystem(false);
  assert.equal(b.document.documentElement.dataset.theme, "dark");
  stop();
});

test("System follows live device changes and resumes after an override", () => {
  const b = browser();
  const stop = b.theme.subscribeTheme(() => {});
  b.setSystem(true);
  assert.equal(b.document.documentElement.dataset.theme, "dark");
  b.theme.setThemePreference("light");
  b.theme.setThemePreference("system");
  assert.equal(b.document.documentElement.dataset.theme, "dark");
  b.setSystem(false);
  assert.equal(b.theme.getThemeSnapshot(), "system:light");
  assert.equal(b.values.get("portfolio.theme"), "system");
  stop();
});

test("storage changes synchronize tabs and clearing a choice restores System", () => {
  const b = browser({ saved: "light", dark: true });
  const stop = b.theme.subscribeTheme(() => {});
  b.theme.setThemePreference("light");
  b.setStored("dark");
  assert.equal(b.theme.getThemeSnapshot(), "dark:dark");
  b.setStored(null);
  assert.equal(b.theme.getThemeSnapshot(), "system:dark");
  b.setStored("nonsense");
  assert.equal(b.theme.getThemeSnapshot(), "system:dark");
  b.theme.setThemePreference("light");
  b.values.clear();
  b.window.dispatchEvent({ type: "storage", key: null });
  assert.equal(b.theme.getThemeSnapshot(), "system:dark");
  stop();
});

test("motion storage changes do not alter theme preference", () => {
  const b = browser({ dark: true });
  const stop = b.theme.subscribeTheme(() => {});
  b.theme.setThemePreference("light");
  b.setStored("true", "portfolio.reduce-motion");
  assert.equal(b.theme.getThemeSnapshot(), "light:light");
  assert.equal(b.document.documentElement.dataset.theme, "light");
  stop();
});

test("blocked storage keeps explicit choices usable for the current session", () => {
  const b = browser({ dark: true, blocked: true });
  b.bootstrap();
  assert.equal(b.document.documentElement.dataset.theme, "dark");
  const stop = b.theme.subscribeTheme(() => {});
  b.theme.setThemePreference("light");
  b.setSystem(false);
  b.setSystem(true);
  assert.equal(b.theme.getThemeSnapshot(), "light:light");
  b.theme.setThemePreference("system");
  assert.equal(b.theme.getThemeSnapshot(), "system:dark");
  stop();
});

test("unavailable media queries fall back to light and allow explicit dark", () => {
  const b = browser({ noMedia: true, blocked: true });
  b.bootstrap();
  assert.equal(b.document.documentElement.dataset.theme, "light");
  const stop = b.theme.subscribeTheme(() => {});
  b.theme.setThemePreference("dark");
  assert.equal(b.document.documentElement.dataset.theme, "dark");
  stop();
});

test("unsubscribing removes all browser listeners", () => {
  const b = browser();
  const stop = b.theme.subscribeTheme(() => {});
  assert.equal(b.window.listenerCount(), 2);
  assert.equal(b.media.listenerCount(), 1);
  stop();
  assert.equal(b.window.listenerCount(), 0);
  assert.equal(b.media.listenerCount(), 0);
  b.setSystem(true);
  assert.equal(b.document.documentElement.dataset.theme, "light");
});
