"use client";

import { useSyncExternalStore } from "react";
import { useMotionPreference } from "./motion-preferences";

const query = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function snapshot() { return window.matchMedia(query).matches; }
const serverSnapshot = () => false;

export function useDesktopInteraction() {
  const eligible = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const { reduced } = useMotionPreference();
  return eligible && !reduced;
}
