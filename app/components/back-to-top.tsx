"use client";

import { ArrowUp } from "./icons";
import { useMotionPreference } from "./motion-preferences";

export function BackToTop() {
  const { reduced } = useMotionPreference();
  return <button className="backToTop" type="button" onClick={() => {
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
    document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
  }}>Back to top<ArrowUp size={16} aria-hidden="true" /></button>;
}
