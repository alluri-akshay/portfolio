"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { m, useMotionValue, useSpring } from "motion/react";
import { useDesktopInteraction } from "./interaction-preferences";
import { motionTokens } from "../lib/motion-tokens";
import { ArrowUpRight } from "./icons";

// The native pointer stays precise; the decorative follower adds context.
export function CursorFeedback() {
  const root = useRef<HTMLDivElement>(null);
  const enabled = useDesktopInteraction();
  const pathname = usePathname();
  const x = useMotionValue(0), y = useMotionValue(0);
  const visible = useMotionValue(0);
  const size = useMotionValue(26);
  const diameter = useSpring(size, motionTokens.cursor.spring);
  const ringX = useSpring(x, motionTokens.cursor.spring);
  const ringY = useSpring(y, motionTokens.cursor.spring);

  useEffect(() => {
    if (!enabled) return;
    let shown = false, frame = 0;
    let restingSize = 26, latestX = 0, latestY = 0;
    let mode = "", tone = "";
    function targetStyle(target: Element | null) {
      const action = target?.closest('a[href], button:not(:disabled), [role="button"]');
      const preview = Boolean(action?.matches('.projectImage, .heroPanel a, .heroSceneLinks a, .conceptLink, .nextProject'));
      const nextMode = preview ? "preview" : action ? "action" : "rest";
      const nextTone = target?.closest(".primary, .navCta") ? "light" : target?.closest(".experience") ? "feature" : "blue";
      restingSize = preview ? 56 : action ? 36 : 26;
      if (mode !== nextMode) { mode = nextMode; size.set(restingSize); root.current?.setAttribute("data-mode", mode); }
      if (tone !== nextTone) { tone = nextTone; root.current?.setAttribute("data-tone", tone); }
    }
    function reset() {
      visible.set(0); size.set(26); shown = false; mode = ""; tone = "";
      cancelAnimationFrame(frame); frame = 0;
    }
    function update() {
      frame = 0;
      const target = document.elementFromPoint(latestX, latestY);
      if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) { reset(); return; }
      if (!shown) { ringX.jump(latestX); ringY.jump(latestY); }
      x.set(latestX); y.set(latestY); targetStyle(target);
      visible.set(1); shown = true;
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") { reset(); return; }
      latestX = event.clientX; latestY = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    }
    function scroll() { if (shown && !frame) frame = requestAnimationFrame(update); }
    function down(event: PointerEvent) { if (shown && event.pointerType === "mouse") size.set(restingSize * .86); }
    function up() { if (shown) size.set(restingSize); }
    function keyboard(event: KeyboardEvent) { if (event.key === "Tab" || event.key === "Escape") reset(); }
    function leave(event: PointerEvent) { if (!event.relatedTarget) reset(); }
    function visibility() { if (document.hidden) reset(); }
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", reset);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", reset);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", scroll);
      reset();
    };
  }, [enabled, pathname, x, y, visible, size, ringX, ringY]);

  return <div ref={root} className="cursorFeedback" aria-hidden="true">
    <m.span className="cursorHalo" style={{ x: ringX, y: ringY, width: diameter, height: diameter, opacity: enabled ? visible : 0 }}><ArrowUpRight size={16} /><span className="cursorPreviewLabel">View</span></m.span>
  </div>;
}
