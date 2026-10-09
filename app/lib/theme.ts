export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const themeStorageKey = "portfolio.theme";
const changeEvent = "portfolio:theme-preference";
const systemQuery = "(prefers-color-scheme: dark)";
let volatilePreference: ThemePreference | undefined;

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function readPreference(): ThemePreference {
  if (volatilePreference !== undefined) return volatilePreference;
  try {
    const saved = window.localStorage.getItem(themeStorageKey);
    return isThemePreference(saved) ? saved : "system";
  } catch { return "system"; }
}

function systemTheme(): ResolvedTheme {
  try { return window.matchMedia(systemQuery).matches ? "dark" : "light"; }
  catch { return "light"; }
}

export function getThemeSnapshot(): string {
  const preference = readPreference();
  return `${preference}:${preference === "system" ? systemTheme() : preference}`;
}

// A stable server snapshot avoids hydrating a stored choice into server markup.
export function getServerThemeSnapshot() { return "system:light"; }

function applyTheme() {
  const [preference, resolved] = getThemeSnapshot().split(":");
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
}

export function setThemePreference(preference: ThemePreference) {
  volatilePreference = preference;
  try { window.localStorage.setItem(themeStorageKey, preference); }
  catch { /* Keep the explicit choice in memory when storage is unavailable. */ }
  applyTheme();
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeTheme(onChange: () => void) {
  const update = () => { applyTheme(); onChange(); };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== themeStorageKey && event.key !== null) return;
    volatilePreference = undefined;
    update();
  };
  let media: MediaQueryList | undefined;
  try { media = window.matchMedia(systemQuery); }
  catch { /* Explicit light and dark choices still work without matchMedia. */ }
  window.addEventListener(changeEvent, update);
  window.addEventListener("storage", onStorage);
  media?.addEventListener("change", update);
  // Synchronize from browser state, never from the server hydration snapshot.
  update();
  return () => {
    window.removeEventListener(changeEvent, update);
    window.removeEventListener("storage", onStorage);
    media?.removeEventListener("change", update);
  };
}

// Blocking head script runs before body content in both Vinext and static export.
// Keep it dependency-free: the browser must not wait for React or an external file.
export const themeInitScript = `(function(){var p="system";try{var s=window.localStorage.getItem("${themeStorageKey}");if(s==="light"||s==="dark"||s==="system")p=s;}catch(e){}var t=p;if(p==="system"){try{t=window.matchMedia("${systemQuery}").matches?"dark":"light";}catch(e){t="light";}}var r=document.documentElement;r.dataset.theme=t;r.dataset.themePreference=p;})();`;
