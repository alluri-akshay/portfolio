"use client";

import { m } from "motion/react";
import { useMotionPreference } from "./motion-preferences";
import { motionTokens } from "../lib/motion-tokens";
import { ArrowRight, Check } from "./icons";
import { useDesktopInteraction } from "./interaction-preferences";

/** Editorial illustration of documented capabilities, not a product screenshot. */
export function ProjectWorkflow() {
  const { reduced } = useMotionPreference();
  const timing = motionTokens.choreography.workflow;
  const enhanced = useDesktopInteraction();
  return <figure className="workflowIllustration">
    <div className="workflowTop"><span className="workflowMark" aria-hidden="true">A</span><span>Auto Auth<span className="workflowSub">A clearer path through the form</span></span></div>
    <m.ol className="workflowSteps" initial={false} whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      {[{ title: "Prefill", detail: "Less repetitive entry" }, { title: "Validate", detail: "Guidance as you go" }, { title: "Submit", detail: "Clear loading & feedback" }].map((step, index) => <m.li key={step.title} initial={false} animate={!enhanced ? { z: 0, rotateX: 0, ...(reduced ? { opacity: 1, y: 0 } : {}) } : undefined} variants={{ visible: reduced ? { opacity: 1, y: 0, z: 0, rotateX: 0 } : { opacity: [0.85, 1], y: [timing.distance, 0], rotateX: enhanced ? [-9, 0] : 0, z: enhanced ? [-12, index * motionTokens.depth.workflowStep] : 0 } }} whileHover={enhanced ? { z: index * motionTokens.depth.workflowStep + 8 } : undefined} transition={{ duration: reduced ? 0 : timing.duration, delay: reduced ? 0 : index * timing.stagger, ease: motionTokens.easeOut }}>
        <span className="workflowStepNumber">0{index + 1}</span><div><strong>{step.title}</strong><span>{step.detail}</span></div>{index < 2 ? <ArrowRight size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
      </m.li>)}
    </m.ol>
    <figcaption>Workflow illustration · based on documented features</figcaption>
  </figure>;
}
