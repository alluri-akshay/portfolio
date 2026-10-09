"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { motionTokens } from "../lib/motion-tokens";
import { useMotionPreference } from "./motion-preferences";

interface EntranceProps { children: ReactNode; className?: string; delay?: number; as?: "div" | "header" | "p" | "article"; variant?: "section" | "quiet" | keyof typeof motionTokens.choreography; coordinated?: boolean }

export function Reveal({ children, className = "", delay = 0, as = "div", variant = "section", coordinated = false }: EntranceProps) {
  const { reduced } = useMotionPreference();
  const Component = m[as];
  const timing = variant === "section" ? { duration: motionTokens.duration.entrance, distance: motionTokens.entrance.distance }
    : variant === "quiet" ? { duration: motionTokens.duration.quiet, distance: motionTokens.entrance.quietDistance }
    : motionTokens.choreography[variant];
  return <Component className={className} initial={false}
    variants={{ visible: reduced ? { opacity: 1, y: 0 } : { opacity: [0.85, 1], y: [timing.distance, 0] } }}
    animate={reduced ? { opacity: 1, y: 0 } : undefined}
    whileInView={coordinated ? undefined : "visible"}
    viewport={{ once: true, amount: motionTokens.entrance.amount }}
    transition={{ duration: reduced ? 0 : timing.duration, delay: reduced ? 0 : Math.min(motionTokens.entrance.maxDelay, Math.max(0, delay)), ease: motionTokens.easeOut }}>
    {children}
  </Component>;
}

export function HeroEntrance({ children, className = "", step = 0, settled = false }: { children: ReactNode; className?: string; step?: number; settled?: boolean }) {
  const { reduced } = useMotionPreference();
  return <m.div className={className} initial={false}
    animate={reduced || settled ? { opacity: 1, y: 0 } : { opacity: [0.85, 1], y: [motionTokens.hero.distance, 0] }}
    transition={{ duration: reduced ? 0 : motionTokens.duration.entrance, delay: reduced ? 0 : motionTokens.hero.delays[Math.min(3, Math.max(0, step))], ease: motionTokens.easeOut }}>{children}</m.div>;
}

export function PageArrival({ children, identity, className = "", delay = 0, as = "div" }: Omit<EntranceProps, "as"> & { identity: string; as?: "div" | "header" | "p" | "article" | "figure" }) {
  const { reduced } = useMotionPreference();
  const Component = m[as];
  return <Component key={identity} className={className} initial={false}
    animate={reduced ? { opacity: 1, y: 0 } : { opacity: [0.85, 1], y: [motionTokens.page.distance, 0] }}
    transition={{ duration: reduced ? 0 : motionTokens.duration.page, delay: reduced ? 0 : Math.min(motionTokens.page.maxDelay, Math.max(0, delay)), ease: motionTokens.easeOut }}>{children}</Component>;
}

/** Clipped line entrances preserve the readable server-rendered heading. */
export function HeroLine({ children, step = 0 }: { children: ReactNode; step?: number }) {
  const { reduced } = useMotionPreference();
  return <span className="heroLine"><m.span initial={false}
    animate={reduced ? { y: 0, opacity: 1 } : { y: [motionTokens.hero.lineRise, "0%"], opacity: [0.85, 1] }}
    transition={{ duration: reduced ? 0 : motionTokens.duration.hero, delay: reduced ? 0 : motionTokens.hero.lineDelay + step * motionTokens.hero.lineStagger, ease: motionTokens.easeOut }}>{children}</m.span></span>;
}
