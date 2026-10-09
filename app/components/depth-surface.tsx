"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { useSurfaceDepth } from "./use-surface-depth";

export function DepthSurface({ children, className = "", trigger = "self", tone = "normal", restX = 0, restY = 0 }: { children: ReactNode; className?: string; trigger?: "self" | "article"; tone?: "normal" | "feature"; restX?: number; restY?: number }) {
  const { ref, enabled, rotateX, rotateY, y, light, lightOpacity } = useSurfaceDepth({ trigger, restX, restY });
  return <div ref={ref} className={`depthSurface ${className}`} data-tone={tone}>
    <m.div className="depthSurfacePlane" style={{ rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0, y: enabled ? y : 0 }}>
      {children}
      <m.span className="surfaceLight" aria-hidden="true" style={{ background: light, opacity: enabled ? lightOpacity : 0 }} />
    </m.div>
  </div>;
}
