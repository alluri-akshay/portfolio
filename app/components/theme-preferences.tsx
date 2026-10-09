"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  getServerThemeSnapshot, getThemeSnapshot, setThemePreference, subscribeTheme,
  type ResolvedTheme, type ThemePreference,
} from "../lib/theme";
import { Monitor, Moon, Sun } from "./icons";

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
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeControl() {
  const id = useId();
  const { preference, setPreference } = useThemePreference();
  return <fieldset className="themeControl">
    <legend className="srOnly">Color theme</legend>
    <div className="themeOptions">{choices.map(({ value, label, Icon }) =>
      <label className="themeOption" htmlFor={`${id}-${value}`} title={`${label} theme`} key={value}>
        <input className="srOnly themeRadio" id={`${id}-${value}`} name={id} type="radio"
          value={value} checked={preference === value} aria-label={`${label} theme`}
          onChange={() => setPreference(value)} />
        <span className="themeOptionVisual"><Icon size={17} strokeWidth={1.8} aria-hidden="true" />
          <span className="themeOptionText">{label}</span>
        </span>
      </label>
    )}</div>
  </fieldset>;
}
