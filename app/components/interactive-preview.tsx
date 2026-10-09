"use client";

import type { ReactNode } from "react";
import { m, useTransform } from "motion/react";
import { motionTokens } from "../lib/motion-tokens";
import { ArrowUpRight } from "./icons";
import { useSurfaceDepth } from "./use-surface-depth";

export function InteractivePreview({ children, title, warm = false }: { children: ReactNode; title: string; warm?: boolean }) {
  const { ref, enabled, rotateX, rotateY, y, light, lightOpacity } = useSurfaceDepth({ trigger: "link", tilt: motionTokens.depth.previewTilt, lift: motionTokens.depth.previewLift, restX: motionTokens.depth.previewRestX, restY: warm ? -motionTokens.depth.previewRestY : motionTokens.depth.previewRestY });
  const arrowX = useTransform(rotateY, value => value / motionTokens.depth.previewTilt * motionTokens.preview.arrowTravel);
  const arrowY = useTransform(rotateX, value => -value / motionTokens.depth.previewTilt * motionTokens.preview.arrowTravel);
  return <div ref={ref} className="interactivePreview">
    <m.div className="interactivePreviewSurface" style={{ rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0, y: enabled ? y : 0 }}>
      <div className="previewToolbar" aria-hidden="true"><span className="previewWindowDots"><i /><i /><i /></span><span>{title}</span><ArrowUpRight size={13} /></div>
      {children}
      <m.span className="surfaceLight" aria-hidden="true" style={{ background: light, opacity: enabled ? lightOpacity : 0 }} />
    </m.div>
    <span className="previewCue" aria-hidden="true">View project
      <m.span style={{ x: enabled ? arrowX : 0, y: enabled ? arrowY : 0 }}><ArrowUpRight size={17} /></m.span>
    </span>
  </div>;
}
