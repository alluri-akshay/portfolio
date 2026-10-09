"use client";

import { Check, Copy } from "./icons";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useMotionPreference } from "./motion-preferences";
import { motionTokens } from "../lib/motion-tokens";

export function CopyEmail({ email }: { email: string }) {
  const { reduced } = useMotionPreference();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); }
  }

  return (
    <div className="copyEmail">
      <button className={`button copyButton ${status === "copied" ? "isCopied" : ""}`} aria-label="Copy email" onClick={copy}>
        <span className="copyIconFrame" aria-hidden="true"><AnimatePresence initial={false}>
          <m.span className="copyFeedbackIcon" key={status === "copied" ? "check" : "copy"}
            initial={reduced ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : 0.8 }}
            transition={{ duration: reduced ? 0 : motionTokens.duration.feedback }}>
            {status === "copied" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          </m.span>
        </AnimatePresence></span>
        <span>{status === "copied" ? "Copied" : "Copy email"}</span>
      </button>
      <p className={`copyStatus ${status === "error" ? "copyError" : "srOnly"}`} role="status">{status === "copied" ? "Email copied to clipboard." : status === "error" ? "Copy failed. Use the email link." : ""}</p>
    </div>
  );
}
