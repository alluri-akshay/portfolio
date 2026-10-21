"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { m, useScroll } from "motion/react";
import { ArrowUpRight } from "./icons";

const sections = [["/projects", "Projects", "work"], ["/experience", "Experience", "experience"], ["/about", "About", "about"], ["/contact", "Contact", "contact"]] as const;
const listeners = new Set<() => void>();
let active = "";
let frame = 0;
function update() {
  frame = 0;
  let next = "";
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 8) next = "/contact";
  else for (const [path, , id] of sections) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= 180) next = path;
  }
  if (next !== active) { active = next; listeners.forEach(listener => listener()); }
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
  const pathname = usePathname();
  const visible = useSyncExternalStore(home ? subscribe : noSubscription, () => home ? active : "", serverSnapshot);
  useEffect(() => { if (home) schedule(); }, [home, pathname]);
  return <>{sections.map(([path, label]) => <Link key={path} href={path} scroll={false}
    aria-current={home ? visible === path ? "location" : undefined : pathname === path || pathname.startsWith(`${path}/`) ? "page" : undefined} onClick={onNavigate}>
    {label}{mobile && <ArrowUpRight size={18} aria-hidden="true" />}
  </Link>)}</>;
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <div className="readingProgress" aria-hidden="true"><m.div className="readingProgressFill" style={{ scaleX: scrollYProgress, originX: 0 }} /></div>;
}
