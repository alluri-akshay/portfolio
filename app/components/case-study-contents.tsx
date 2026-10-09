"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CaseStudySection } from "../content/portfolio";

export function CaseStudyContents({ sections }: { sections: Pick<CaseStudySection, "id" | "title">[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      let current = "";
      for (const section of sections) {
        const heading = document.getElementById(`case-${section.id}`);
        if (heading && heading.getBoundingClientRect().top <= Math.min(180, innerHeight * 0.3)) current = section.id;
      }
      setActive(current);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const observer = new ResizeObserver(schedule);
    const body = document.querySelector(".caseStudyBody");
    if (body) observer.observe(body);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      observer.disconnect(); cancelAnimationFrame(frame);
    };
  }, [sections]);
  return <nav aria-label="Case study contents">{sections.map((section, index) =>
    <Link href={`#case-${section.id}`} key={section.id} aria-current={active === section.id ? "location" : undefined}>
      <span>{String(index + 1).padStart(2, "0")}</span>{section.title}
    </Link>)}</nav>;
}
