"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import { useDesktopInteraction } from "./interaction-preferences";
import { motionTokens } from "../lib/motion-tokens";

/** Only the contents move; the link's click target stays stationary. */
export function MagneticContent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useDesktopInteraction();
  const x = useMotionValue(0), y = useMotionValue(0);
  const smoothX = useSpring(x, motionTokens.spring), smoothY = useSpring(y, motionTokens.spring);
  useEffect(() => {
    const target = ref.current?.closest("a, button");
    const reset = () => { x.set(0); y.set(0); };
    reset();
    if (!enabled || !target) return;
    function move(event: Event) {
      if (!(event instanceof PointerEvent) || event.pointerType !== "mouse" || !target) return;
      const bounds = target.getBoundingClientRect();
      x.set(Math.max(-motionTokens.magnetic.x, Math.min(motionTokens.magnetic.x, ((event.clientX - bounds.left) / bounds.width - .5) * motionTokens.magnetic.x * 2)));
      y.set(Math.max(-motionTokens.magnetic.y, Math.min(motionTokens.magnetic.y, ((event.clientY - bounds.top) / bounds.height - .5) * motionTokens.magnetic.y * 2)));
    }
    function visibility() { if (document.hidden) reset(); }
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerleave", reset);
    target.addEventListener("pointercancel", reset);
    target.addEventListener("focusout", reset);
    target.addEventListener("keydown", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerleave", reset);
      target.removeEventListener("pointercancel", reset);
      target.removeEventListener("focusout", reset);
      target.removeEventListener("keydown", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
      reset();
    };
  }, [enabled, x, y]);
  return <m.span ref={ref} className="magneticContent" style={{ x: enabled ? smoothX : 0, y: enabled ? smoothY : 0 }}>{children}</m.span>;
}
