"use client";

import Link from "next/link";
import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useMotionValue, useScroll } from "motion/react";
import { ArrowUpRight } from "./icons";
import { useDesktopInteraction } from "./interaction-preferences";
import type { HeroSurface } from "./hero-3d-scene";

const Scene = lazy(() => import("./hero-3d-scene"));
function subscribeVisibility(update: () => void) {
  document.addEventListener("visibilitychange", update);
  return () => document.removeEventListener("visibilitychange", update);
}
const visibleSnapshot = () => !document.hidden;
const serverSnapshot = () => false;

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HeroShowcase({ children, surfaces }: { children: ReactNode; surfaces: HeroSurface[] }) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const eligible = useDesktopInteraction();
  const tabVisible = useSyncExternalStore(subscribeVisibility, visibleSnapshot, serverSnapshot);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setReady(false); setFailed(true); }, []);
  const reset = useCallback(() => { pointerX.set(0); pointerY.set(0); }, [pointerX, pointerY]);

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) reset(); };
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reset]);

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!eligible || !visible || !tabVisible || failed || supported) return;
    const frame = requestAnimationFrame(() => {
      try {
        const context = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
        if (context) { context.getExtension("WEBGL_lose_context")?.loseContext(); setSupported(true); }
      } catch { /* Keep the server-rendered screenshot composition. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [eligible, visible, tabVisible, failed, supported]);
  useEffect(() => {
    if (eligible) return;
    reset();
    const frame = requestAnimationFrame(() => setReady(false));
    return () => cancelAnimationFrame(frame);
  }, [eligible, reset]);

  const requested = eligible && supported && !failed;
  const enhanced = requested && ready;
  return <div ref={node => { root.current = node; hero.current = node?.closest("section") ?? null; }}
    className="heroEnhancement" data-scene={enhanced ? "ready" : failed ? "fallback" : requested ? "loading" : "static"}
    onPointerMove={event => {
      if (!requested || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      pointerX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)));
      pointerY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)));
    }} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="heroFallback" inert={enhanced} aria-hidden={enhanced ? true : undefined}>{children}</div>
    {requested && <SceneBoundary onFailure={onFailure}><Suspense fallback={null}>
      <div className="heroCanvas" aria-hidden="true"><Scene surfaces={surfaces} pointerX={pointerX} pointerY={pointerY}
        progress={scrollYProgress} active={visible && tabVisible} onReady={onReady} onFailure={onFailure} /></div>
    </Suspense></SceneBoundary>}
    <nav className="heroSceneLinks" aria-label="Featured projects">{surfaces.map(surface =>
      <Link key={surface.slug} href={`/projects/${surface.slug}`} aria-label={`Read ${surface.title} case study`}>
        <span><strong>{surface.title}</strong><small>{surface.kind}</small></span><ArrowUpRight size={17} aria-hidden="true" />
      </Link>)}</nav>
  </div>;
}
