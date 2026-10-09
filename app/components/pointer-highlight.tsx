"use client";

import { useEffect, useRef } from "react";
import { m, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useDesktopInteraction } from "./interaction-preferences";
import { motionTokens } from "../lib/motion-tokens";

// Insert inside a positioned surface. The decorative layer never owns clicks.
export function PointerHighlight() {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useDesktopInteraction();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const visibility = useMotionValue(0);
  const opacity = useSpring(visibility, motionTokens.highlight.spring);
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  useEffect(() => {
    const surface = ref.current?.parentElement;
    visibility.set(0);
    if (!enabled || !surface) return;
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !surface) return;
      if (!(event.target instanceof Element) || !event.target.closest(".projectImage, .textLink, .projectExternal")) {
        visibility.set(0);
        return;
      }
      const bounds = surface.getBoundingClientRect();
      x.set(Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)));
      y.set(Math.max(0, Math.min(bounds.height, event.clientY - bounds.top)));
      visibility.set(1);
    }
    function reset() { visibility.set(0); }
    function onVisibility() { if (document.hidden) reset(); }
    surface.addEventListener("pointerenter", move);
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", reset);
    surface.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      surface.removeEventListener("pointerenter", move);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", reset);
      surface.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", onVisibility);
      visibility.set(0);
    };
  }, [enabled, visibility, x, y]);

  return <m.span ref={ref} className="pointerHighlight" aria-hidden="true"
    style={{ width: motionTokens.highlight.size, height: motionTokens.highlight.size,
      marginLeft: -motionTokens.highlight.size / 2, marginTop: -motionTokens.highlight.size / 2,
      transform, opacity: enabled ? opacity : 0 }} />;
}
