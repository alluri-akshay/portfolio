"use client";

import { AnimatePresence, m, useIsPresent } from "motion/react";
import { ArrowUpRight, Download, Menu, X } from "./icons";
import { useEffect, useId, useRef, useState } from "react";
import { SectionLinks } from "./section-navigation";
import { useMotionPreference } from "./motion-preferences";
import { motionTokens } from "../lib/motion-tokens";
import { ThemeControl } from "./theme-preferences";

function MenuPanel({ id, home, resumeUrl, email, close }: { id: string; home: boolean; resumeUrl: string; email: string; close: () => void }) {
  const present = useIsPresent();
  const { reduced } = useMotionPreference();
  return <m.div id={id} className="mobileMenu" inert={!present} aria-hidden={!present}
    style={{ pointerEvents: present ? "auto" : "none" }}
    initial={reduced ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
    exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, transition: { duration: motionTokens.duration.exit, ease: "easeIn" } }}
    transition={{ duration: reduced ? 0 : motionTokens.duration.navigation, ease: motionTokens.easeOut }}>
    <SectionLinks home={home} mobile onNavigate={close} />
    <a href={resumeUrl} download onClick={close}>Download resume<Download size={18} aria-hidden="true" /></a>
    <a href={`mailto:${email}`} onClick={close}>Let&apos;s talk<ArrowUpRight size={18} aria-hidden="true" /></a>
    <div className="mobileTheme"><ThemeControl /></div>
  </m.div>;
}

export function MobileNavigation({ home, resumeUrl, email }: { home: boolean; resumeUrl: string; email: string }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const close = () => { setOpen(false); button.current?.focus({ preventScroll: true }); };
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") { setOpen(false); button.current?.focus({ preventScroll: true }); } }
    function onOutside(event: PointerEvent) { if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onOutside); };
  }, [open]);
  return <div className="mobileNavigation" ref={root}>
    <button ref={button} className="menuButton" aria-expanded={open} aria-controls={open ? menuId : undefined}
      aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
      {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}<span>Menu</span>
    </button>
    <AnimatePresence initial={false}>{open && <MenuPanel key={menuId} id={menuId} home={home} resumeUrl={resumeUrl} email={email} close={close} />}</AnimatePresence>
  </div>;
}
