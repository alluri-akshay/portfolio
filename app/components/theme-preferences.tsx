"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  getServerThemeSnapshot, getThemeSnapshot, setThemePreference, subscribeTheme,
  type ResolvedTheme, type ThemePreference,
} from "../lib/theme";
import { Moon, Sun } from "./icons";

interface ThemeState { preference: ThemePreference; resolved: ResolvedTheme; setPreference: (value: ThemePreference) => void }
const ThemeContext = createContext<ThemeState | null>(null);

export function ThemePreferences({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [preference, resolved] = snapshot.split(":") as [ThemePreference, ResolvedTheme];
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const setPreference = useCallback((value: ThemePreference) => {
    if (getThemeSnapshot().split(":")[0] === value) return;
    const root = document.documentElement;
    root.dataset.themeTransition = "active";
    // Establish transition styles before changing the palette; first paint stays immediate.
    void getComputedStyle(document.body).backgroundColor;
    setThemePreference(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { delete root.dataset.themeTransition; }, 240);
  }, []);
  useEffect(() => () => {
    clearTimeout(timer.current);
    delete document.documentElement.dataset.themeTransition;
  }, []);
  return <ThemeContext.Provider value={{ preference, resolved, setPreference }}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const state = useContext(ThemeContext);
  if (!state) throw new Error("Theme controls require ThemePreferences.");
  return state;
}

const choices = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

export function ThemeControl() {
  const { resolved, setPreference } = useThemePreference();
  const keyboardScroll = useRef<{ left: number; top: number } | null>(null);
  const focusFrame = useRef<number | undefined>(undefined);
  useEffect(() => {
    const rememberTabPosition = (event: KeyboardEvent) => {
      if (event.key === "Tab") keyboardScroll.current = { left: window.scrollX, top: window.scrollY };
    };
    document.addEventListener("keydown", rememberTabPosition, true);
    return () => {
      document.removeEventListener("keydown", rememberTabPosition, true);
      if (focusFrame.current !== undefined) cancelAnimationFrame(focusFrame.current);
    };
  }, []);
  return <fieldset className="themeControl">
    <legend className="srOnly">Color theme</legend>
    <div className="themeOptions">{choices.map(({ value, label, Icon }) =>
      <button className="themeOption" type="button" title={`${label} theme`} key={value}
        aria-label={`${label} theme`} aria-pressed={resolved === value}
        onPointerDown={event => {
          keyboardScroll.current = null;
          if (event.button !== 0) return;
          // Focusing a clipped input in the sticky header could scroll to its
          // original document position. Keep focus here without moving the page.
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
        }}
        onFocus={() => {
          const position = keyboardScroll.current;
          keyboardScroll.current = null;
          if (!position) return;
          // Some browsers scroll a sticky control to its original layout position
          // on Tab. Restore only this focus operation, never lock normal scrolling.
          if (focusFrame.current !== undefined) cancelAnimationFrame(focusFrame.current);
          focusFrame.current = requestAnimationFrame(() => {
            window.scrollTo({ ...position, behavior: "instant" });
            focusFrame.current = undefined;
          });
        }}
        onClick={() => setPreference(value)}>
        <span className="themeOptionVisual"><Icon size={17} strokeWidth={1.8} aria-hidden="true" />
          <span className="themeOptionText">{label}</span>
        </span>
      </button>
    )}</div>
  </fieldset>;
}
