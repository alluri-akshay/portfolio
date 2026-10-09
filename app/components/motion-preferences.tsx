"use client";

import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";
import { createContext, useContext, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motionTokens } from "../lib/motion-tokens";

const storageKey = "portfolio.reduce-motion";
const changeEvent = "portfolio:motion-preference";
let volatilePreference: boolean | undefined;

function snapshot(): boolean {
  if (volatilePreference !== undefined) return volatilePreference;
  try { return localStorage.getItem(storageKey) === "true"; }
  catch { return false; }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) { volatilePreference = undefined; onChange(); }
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function setPreference(value: boolean) {
  volatilePreference = value;
  try { localStorage.setItem(storageKey, String(value)); volatilePreference = undefined; }
  catch { /* Keep the choice for this session if browser storage is blocked. */ }
  window.dispatchEvent(new Event(changeEvent));
}

interface MotionPreference { reduced: boolean; systemReduced: boolean; setReduced: (value: boolean) => void }
const PreferenceContext = createContext<MotionPreference | null>(null);

export function MotionPreferences({ children }: { children: ReactNode }) {
  const override = useSyncExternalStore(subscribe, snapshot, () => false);
  const systemReduced = Boolean(useReducedMotion());
  const reduced = override || systemReduced;
  const timings = {
    "--motion-feedback": `${motionTokens.duration.feedback}s`,
    "--motion-navigation": `${motionTokens.duration.navigation}s`,
    "--motion-entrance": `${motionTokens.duration.entrance}s`,
    "--motion-hero": `${motionTokens.duration.hero}s`,
    "--motion-page": `${motionTokens.duration.page}s`,
    "--motion-handoff": `${motionTokens.duration.handoff}s`,
    "--motion-theme": `${motionTokens.duration.theme}s`,
    "--motion-ease-out": `cubic-bezier(${motionTokens.easeOut.join(",")})`,
  } as CSSProperties;

  return (
    <PreferenceContext.Provider value={{ reduced, systemReduced, setReduced: setPreference }}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={override ? "always" : "user"} transition={{ duration: motionTokens.duration.entrance, ease: motionTokens.easeOut }}>
          <div className="motionRoot" data-motion={reduced ? "reduced" : "full"} style={timings}>{children}</div>
        </MotionConfig>
      </LazyMotion>
    </PreferenceContext.Provider>
  );
}

export function useMotionPreference() {
  const preference = useContext(PreferenceContext);
  if (!preference) throw new Error("Motion components require MotionPreferences.");
  return preference;
}

export function MotionToggle() {
  const { reduced, systemReduced, setReduced } = useMotionPreference();
  return (
    <button className="motionToggle" aria-pressed={reduced} disabled={systemReduced}
      title={systemReduced ? "Reduced motion is enabled by your device preference." : "Reduce animations throughout this site."}
      onClick={() => setReduced(!reduced)}>
      Reduce motion <span>{reduced ? "On" : "Off"}</span>
    </button>
  );
}
