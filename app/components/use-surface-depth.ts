"use client";

import { useEffect, useRef } from "react";
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { motionTokens } from "../lib/motion-tokens";
import { useDesktopInteraction } from "./interaction-preferences";

/** Measure the fixed outer surface; only its visual plane moves. */
export function useSurfaceDepth({ tilt = motionTokens.depth.surfaceTilt, lift = motionTokens.depth.surfaceLift, restX = 0, restY = 0, trigger = "self" }: { tilt?: number; lift?: number; restX?: number; restY?: number; trigger?: "self" | "link" | "article" } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useDesktopInteraction();
  const rx = useMotionValue(0), ry = useMotionValue(0), height = useMotionValue(0);
  const smoothX = useSpring(rx, motionTokens.depth.spring), smoothY = useSpring(ry, motionTokens.depth.spring), y = useSpring(height, motionTokens.depth.spring);
  const rotateX = useTransform(smoothX, value => restX + value);
  const rotateY = useTransform(smoothY, value => restY + value);
  const lightX = useMotionValue(50), lightY = useMotionValue(35), illumination = useMotionValue(0);
  const lightOpacity = useSpring(illumination, motionTokens.depth.spring);
  const light = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, var(--depth-light), transparent 68%)`;

  useEffect(() => {
    const surface = trigger === "self" ? ref.current : ref.current?.closest<HTMLElement>(trigger === "link" ? "a" : "article") ?? ref.current;
    const reset = () => { rx.set(0); ry.set(0); height.set(0); illumination.set(0); };
    reset();
    if (!enabled || !surface) return;
    let hovered = false;
    let focused = surface.matches(":focus-within");
    function update() {
      height.set(hovered || focused ? -lift : 0);
      illumination.set(focused ? 0.35 : hovered ? 1 : 0);
      if (focused) { rx.set(-restX); ry.set(-restY); }
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !surface) return;
      hovered = true;
      const bounds = surface.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const py = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      lightX.set((px + 1) * 50); lightY.set((py + 1) * 50);
      // At the center, straighten the frame so its screenshot is easier to read.
      rx.set(-restX - py * tilt); ry.set(-restY + px * tilt); update();
    }
    function leave() { hovered = false; reset(); update(); }
    function focus() { focused = true; update(); }
    function blur(event: FocusEvent) {
      if (event.relatedTarget instanceof Node && surface?.contains(event.relatedTarget)) return;
      focused = false; reset(); update();
    }
    function suspend() { hovered = false; focused = false; reset(); }
    function visibility() { if (document.hidden) suspend(); }
    update();
    surface.addEventListener("pointerenter", move);
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", leave);
    surface.addEventListener("pointercancel", leave);
    surface.addEventListener("focusin", focus);
    surface.addEventListener("focusout", blur);
    window.addEventListener("blur", suspend);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      surface.removeEventListener("pointerenter", move);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
      surface.removeEventListener("pointercancel", leave);
      surface.removeEventListener("focusin", focus);
      surface.removeEventListener("focusout", blur);
      window.removeEventListener("blur", suspend);
      document.removeEventListener("visibilitychange", visibility);
      suspend();
    };
  }, [enabled, trigger, tilt, lift, restX, restY, rx, ry, height, lightX, lightY, illumination]);

  return { ref, enabled, rotateX, rotateY, y, light, lightOpacity };
}
