"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { createContext, useContext, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motionTokens } from "../lib/motion-tokens";
import { getMotionSnapshot, getServerMotionSnapshot, setReducedMotion, subscribeMotion } from "../lib/motion-preference";

interface MotionPreference { reduced: boolean; setReduced: (value: boolean) => void }
const PreferenceContext = createContext<MotionPreference | null>(null);

export function MotionPreferences({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeMotion, getMotionSnapshot, getServerMotionSnapshot);
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
    <PreferenceContext.Provider value={{ reduced, setReduced: setReducedMotion }}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={reduced ? "always" : "never"} transition={{ duration: motionTokens.duration.entrance, ease: motionTokens.easeOut }}>
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
  const { reduced, setReduced } = useMotionPreference();
  return (
    <button className="motionToggle" aria-pressed={!reduced}
      title="Turn page animations on or off. The robot stays animated. This choice is independent of device settings."
      onClick={() => setReduced(!reduced)}>
      <span className="motionIndicator" aria-hidden="true" /> Animations <span>{reduced ? "Off" : "On"}</span>
    </button>
  );
}
