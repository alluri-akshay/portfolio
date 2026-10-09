"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { motionTokens } from "../lib/motion-tokens";
import { useDesktopInteraction } from "./interaction-preferences";
import { InteractivePreview } from "./interactive-preview";

/** The poster stays stable; the enhanced scene's camera owns hero response. */
export function HeroScene({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`heroScene ${className}`}>{children}</div>;
}

export function HeroPanel({ children, front = false }: { children: ReactNode; front?: boolean }) {
  return <figure className={`heroPanel ${front ? "showcaseSecondary" : "showcaseMain"}`}>{children}</figure>;
}

export function ProjectPreview({ children, title, warm = false }: { children: ReactNode; title: string; warm?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useDesktopInteraction();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Three-percent travel stays inside four-percent overscan, preserving edges.
  const y = useTransform(scrollYProgress, [0, 1], [`${motionTokens.preview.parallax}%`, `-${motionTokens.preview.parallax}%`]);
  return <InteractivePreview title={title} warm={warm}><div ref={ref} className="projectPreview"><m.div className="projectPreviewImage" style={{ y: enabled ? y : 0, scale: enabled ? motionTokens.preview.scale : 1 }}>{children}</m.div></div></InteractivePreview>;
}
