"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { m, useScroll } from "motion/react";
import { ArrowUpRight } from "./icons";

const sections = [["work", "Work"], ["experience", "Experience"], ["about", "About"], ["contact", "Contact"]] as const;
const listeners = new Set<() => void>();
let active = "";
let frame = 0;

function update() {
  frame = 0;
  let next = "";
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 8) next = "contact";
  else for (const [id] of sections) {
    const target = document.getElementById(id);
    if (target && target.getBoundingClientRect().top <= Math.min(180, innerHeight * 0.3)) next = id;
  }
  if (next !== active) { active = next; listeners.forEach((listener) => listener()); }
}
function schedule() { if (!frame) frame = requestAnimationFrame(update); }
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame); frame = 0; active = "";
    }
  };
}
const noSubscription = () => () => {};
const serverSnapshot = () => "";

export function SectionLinks({ home, mobile = false, onNavigate }: { home: boolean; mobile?: boolean; onNavigate?: () => void }) {
  const current = useSyncExternalStore(home ? subscribe : noSubscription, () => home ? active : "", serverSnapshot);
  return <>{sections.map(([id, label]) => <Link key={id} href={`${home ? "" : "/"}#${id}`}
    aria-current={current === id ? "location" : undefined} onClick={onNavigate}>
    {label}{mobile && <ArrowUpRight size={18} aria-hidden="true" />}
  </Link>)}</>;
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <div className="readingProgress" aria-hidden="true"><m.div className="readingProgressFill" style={{ scaleX: scrollYProgress, originX: 0 }} /></div>;
}
