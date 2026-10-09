"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageFocus() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const historyNavigation = useRef(false);

  useEffect(() => {
    const onPop = () => { historyNavigation.current = window.location.pathname !== previous.current; };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (pathname === previous.current) return;
    previous.current = pathname;
    const restoring = historyNavigation.current;
    historyNavigation.current = false;
    // Leave history restoration to the router. Forward navigation receives a
    // useful reading/focus starting point without issuing another scroll.
    if (restoring) return;
    const frame = requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
