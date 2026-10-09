"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { useDesktopInteraction } from "./interaction-preferences";
import { motionTokens } from "../lib/motion-tokens";

export function ProjectChapter({ children, className, id }: { children: ReactNode; className: string; id: string }) {
  const ref = useRef<HTMLElement>(null);
  const enabled = useDesktopInteraction();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, motionTokens.scrollSpring);
  return <m.article ref={ref} id={id} className={className} initial={false} whileInView="visible" viewport={{ once: true, amount: motionTokens.entrance.amount }}>
    <div className="chapterProgress" aria-hidden="true"><m.span style={{ scaleX: enabled ? progress : 1 }} /></div>
    {children}
  </m.article>;
}
