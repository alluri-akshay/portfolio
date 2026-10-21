"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

type Position = { left: number; top: number };
const entryKey = "__portfolioEntry";
const sectionRoutes: Record<string, string> = { "/projects": "work", "/experience": "experience", "/about": "about", "/contact": "contact" };

export function PageFocus() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const positions = useRef(new Map<string, Position>());
  const currentEntry = useRef("");
  const navigating = useRef(false);
  const restoration = useRef<Position | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const remember = () => {
      if (!navigating.current && currentEntry.current) positions.current.set(currentEntry.current, { left: scrollX, top: scrollY });
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) {
        const id = sectionRoutes[url.pathname.replace(/\/$/, "")];
        if (id && !url.hash) {
          event.preventDefault();
          document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
        }
        return;
      }
      // Capture before the router swaps content or clamps the old scroll offset.
      remember();
      navigating.current = true;
    };
    const onPop = (event: PopStateEvent) => {
      cancelAnimationFrame(frame.current);
      // Local document anchors keep the router's normal anchor behavior.
      if (location.pathname === previous.current) {
        navigating.current = false;
        restoration.current = null;
        return;
      }
      navigating.current = true;
      restoration.current = positions.current.get(event.state?.[entryKey]) ?? { left: 0, top: 0 };
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("scroll", remember, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      cancelAnimationFrame(frame.current);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", remember);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useLayoutEffect(() => {
    const changed = pathname !== previous.current;
    previous.current = pathname;
    currentEntry.current = history.state?.[entryKey] ?? crypto.randomUUID();
    history.replaceState({ ...history.state, [entryKey]: currentEntry.current }, "");
    const sectionId = sectionRoutes[pathname.replace(/\/$/, "")];
    if (!changed && !sectionId) return;
    const position = restoration.current;
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => {
        if (position) window.scrollTo({ ...position, behavior: "instant" });
        else if (sectionId) {
          const section = document.getElementById(sectionId);
          section?.scrollIntoView({ block: "start", behavior: "instant" });
          const heading = section?.querySelector<HTMLElement>("h2");
          heading?.setAttribute("tabindex", "-1");
          heading?.focus({ preventScroll: true });
        } else document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
        restoration.current = null;
        navigating.current = false;
      });
    });
    return () => cancelAnimationFrame(frame.current);
  }, [pathname]);

  return null;
}
