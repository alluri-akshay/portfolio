"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { m, MotionConfig, useAnimationControls, useMotionValue, useSpring, useTransform, type Variants } from "motion/react";
import { useDesktopInteraction } from "./interaction-preferences";
import styles from "./developer-robot.module.css";

function subscribeVisibility(update: () => void) {
  document.addEventListener("visibilitychange", update);
  return () => document.removeEventListener("visibilitychange", update);
}
const visibleSnapshot = () => !document.hidden;
const serverSnapshot = () => false;

// One shared timeline keeps the joints and expression in the same greeting.
const greetingTiming = {
  duration: 3.4,
  times: [0, .12, .3, .44, .58, .72, .9, 1],
  ease: "easeInOut" as const,
};
const gestures: Record<string, Variants> = {
  greeting: {
    rest: { opacity: 0, y: 7, scale: .98 },
    greet: {
      opacity: [0, 0, 1, 1, 1, 0],
      y: [7, 7, -1, 0, 0, -4],
      scale: [.98, .98, 1.015, 1, 1, 1],
      transition: { duration: 4.8, times: [0, .045, .12, .19, .9, 1], ease: "easeInOut" },
    },
  },
  shoulder: {
    rest: { rotate: -12 },
    greet: { rotate: [-12, -42, -112, -118, -112, -116, -35, -12], transition: greetingTiming },
  },
  elbow: {
    rest: { rotate: 0 },
    greet: { rotate: [0, -10, -32, -40, -32, -40, -15, 0], transition: greetingTiming },
  },
  wrist: {
    rest: { rotate: 0 },
    greet: { rotate: [0, 0, -12, 20, -14, 12, 3, 0], transition: greetingTiming },
  },
  body: {
    rest: { rotate: 0 },
    greet: { rotate: [0, -1, -2.5, -2, -2.5, -2, -.5, 0], transition: greetingTiming },
  },
  head: {
    rest: { rotate: 0 },
    greet: { rotate: [0, 4, 6, 6, 4, 5, 1, 0], transition: greetingTiming },
  },
  openEyes: {
    rest: { opacity: 1 },
    // Close the normal eyes before revealing the happy eyes: no ghosted overlap.
    greet: { opacity: [1, 0, 0, 1], transition: { ...greetingTiming, times: [0, .16, .84, 1] } },
  },
  happyEyes: {
    rest: { opacity: 0 },
    greet: { opacity: [0, 0, 1, 1, 0, 0], transition: { ...greetingTiming, times: [0, .18, .24, .76, .82, 1] } },
  },
  smile: {
    rest: { d: "M287 285 Q301 297 315 285" },
    greet: {
      d: ["M287 285 Q301 297 315 285", "M287 285 Q301 297 315 285", "M284 283 Q301 305 318 283", "M284 283 Q301 305 318 283", "M284 283 Q301 305 318 283", "M284 283 Q301 305 318 283", "M287 285 Q301 297 315 285", "M287 285 Q301 297 315 285"],
      transition: greetingTiming,
    },
  },
};

/** Vector character, available without an image/model download or WebGL. */
export function DeveloperRobot() {
  const id = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const pointerEnabled = useDesktopInteraction({ respectMotionPreference: false });
  const tabVisible = useSyncExternalStore(subscribeVisibility, visibleSnapshot, serverSnapshot);
  const [inView, setInView] = useState(false);
  const gesture = useAnimationControls();
  const active = inView && tabVisible;
  const greetingRun = useRef(0);
  const replayTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const restartFrame = useRef<number | undefined>(undefined);
  const x = useMotionValue(0), y = useMotionValue(0);
  const lookX = useSpring(x, { stiffness: 130, damping: 20 });
  const lookY = useSpring(y, { stiffness: 130, damping: 20 });
  const headX = useTransform(lookX, value => value * .28);
  const headY = useTransform(lookY, value => value * .2);
  const rotateX = useTransform(lookY, value => -value * .25);
  const rotateY = useTransform(lookX, value => value * .35);

  useEffect(() => {
    if (!root.current) return;
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!active || !pointerEnabled) { x.set(0); y.set(0); }
  }, [active, pointerEnabled, x, y]);
  const replayGreeting = useCallback(function replay() {
    const run = ++greetingRun.current;
    clearTimeout(replayTimer.current);
    if (restartFrame.current !== undefined) cancelAnimationFrame(restartFrame.current);
    gesture.stop();
    gesture.set("rest");
    // Commit the resting joints before restarting. Reusing an infinite target
    // in the same frame could leave the hand waiting for its next loop.
    restartFrame.current = requestAnimationFrame(() => {
      restartFrame.current = undefined;
      void gesture.start("greet").then(() => {
        if (run !== greetingRun.current) return;
        replayTimer.current = setTimeout(replay, 8200);
      });
    });
  }, [gesture]);
  useEffect(() => {
    if (active) replayGreeting();
    else gesture.set("rest");
    return () => {
      ++greetingRun.current;
      clearTimeout(replayTimer.current);
      if (restartFrame.current !== undefined) cancelAnimationFrame(restartFrame.current);
      gesture.stop();
    };
  }, [active, gesture, replayGreeting]);
  const paint = (name: string) => `url(#${id}-${name})`;

  return <MotionConfig reducedMotion="never"><div ref={root} className={styles.robot} data-active={active}
    onPointerMove={event => {
      if (!active || !pointerEnabled || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      x.set(Math.max(-10, Math.min(10, ((event.clientX - bounds.left) / bounds.width - .5) * 20)));
      y.set(Math.max(-8, Math.min(8, ((event.clientY - bounds.top) / bounds.height - .5) * 16)));
    }} onPointerLeave={() => { x.set(0); y.set(0); }} onPointerCancel={() => { x.set(0); y.set(0); }}>
    <div className={styles.greetingSlot}>
      <m.div className={styles.greeting} initial="rest" animate={gesture} variants={gestures.greeting}>
        <strong>Hi, I’m Akshay.</strong>
        <span>Nice to meet you.</span>
      </m.div>
    </div>
    <div className={styles.scene}>
    <div className={styles.halo} aria-hidden="true" />
    <div className={styles.orbit} aria-hidden="true" />
    <m.div className={styles.character} role="img" aria-label="An interactive silver robot with teal eyes, a code emblem, and a friendly wave"
      style={{ rotateX: active && pointerEnabled ? rotateX : 0, rotateY: active && pointerEnabled ? rotateY : 0 }}>
      <svg viewBox="70 65 480 470" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-shell`} x1="180" y1="130" x2="418" y2="370" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff" /><stop offset=".38" stopColor="#f0f3f2" /><stop offset=".7" stopColor="#c5cfca" /><stop offset="1" stopColor="#7a9085" /></linearGradient>
          <linearGradient id={`${id}-body`} x1="224" y1="326" x2="384" y2="473" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff" /><stop offset=".45" stopColor="#e4ebe7" /><stop offset="1" stopColor="#94a99d" /></linearGradient>
          <linearGradient id={`${id}-glass`} x1="232" y1="188" x2="365" y2="326" gradientUnits="userSpaceOnUse"><stop stopColor="#253d35" /><stop offset=".45" stopColor="#111f1a" /><stop offset="1" stopColor="#08100d" /></linearGradient>
          <linearGradient id={`${id}-edge`} x1="165" y1="187" x2="446" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#b9d2c6" /><stop offset=".5" stopColor="#e9f5ee" /><stop offset="1" stopColor="#5f8070" /></linearGradient>
          <radialGradient id={`${id}-shadow`}><stop stopColor="#1a3025" stopOpacity=".3" /><stop offset="1" stopColor="#1a3025" stopOpacity="0" /></radialGradient>
          <linearGradient id={`${id}-eye`} x1="258" y1="232" x2="267" y2="270" gradientUnits="userSpaceOnUse"><stop stopColor="#d4ffeb" /><stop offset="1" stopColor="#65c79f" /></linearGradient>
          <linearGradient id={`${id}-sheen`} x1="232" y1="190" x2="316" y2="298" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity=".12" /><stop offset=".65" stopColor="white" stopOpacity="0" /></linearGradient>
          <linearGradient id={`${id}-rim`} x1="190" y1="200" x2="405" y2="310" gradientUnits="userSpaceOnUse"><stop stopColor="#e7f9ef" stopOpacity=".75" /><stop offset=".55" stopColor="#afcfbd" stopOpacity=".12" /><stop offset="1" stopColor="#afcfbd" stopOpacity=".45" /></linearGradient>
        </defs>
        <ellipse className={styles.shadow} cx="302" cy="501" rx="128" ry="25" fill={paint("shadow")} />
        <g className={styles.float}>
          <m.g data-robot-joint="body" style={{ originX: "300px", originY: "400px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.body}>
          <g>
            <rect x="175" y="347" width="46" height="99" rx="23" transform="rotate(20 175 347)" fill={paint("shell")} stroke="#91a99c" />
            <path d="M160 415L151 439C147 451 152 462 162 465C173 469 182 462 186 451L193 431" fill={paint("body")} stroke="#91a99c" strokeWidth="2" />
          </g>
          <m.g data-robot-joint="shoulder" style={{ originX: "408px", originY: "354px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.shoulder}>
            <circle cx="410" cy="355" r="17" fill={paint("edge")} stroke="#91a99c" />
            <rect x="389" y="343" width="43" height="63" rx="21" fill={paint("shell")} stroke="#91a99c" />
            <path d="M398 352V377" stroke="white" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
            <circle cx="410" cy="397" r="13" fill={paint("edge")} stroke="#91a99c" />
            <m.g data-robot-joint="elbow" style={{ originX: "410px", originY: "397px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.elbow}>
              <rect x="391" y="389" width="39" height="57" rx="19" fill={paint("body")} stroke="#91a99c" />
              <m.g data-robot-joint="wrist" style={{ originX: "410px", originY: "439px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.wrist}>
                <rect x="390" y="432" width="42" height="37" rx="17" fill={paint("shell")} stroke="#91a99c" />
                <path d="M399 450V458M410 452V460M421 450V458" stroke="#6b8979" strokeWidth="2" strokeLinecap="round" />
                <path d="M429 439Q442 434 441 444Q440 452 431 452" fill={paint("body")} stroke="#91a99c" />
              </m.g>
            </m.g>
          </m.g>
          <rect x="267" y="311" width="68" height="40" rx="17" fill="#6e8f7e" />
          <path d="M228 344C233 328 258 323 300 323C343 323 368 328 373 344L388 403C395 437 367 469 301 470C236 470 207 439 214 404L228 344Z" fill={paint("body")} stroke="#8da99a" strokeWidth="2" />
          <path d="M239 344C254 336 278 333 300 333" stroke="white" strokeOpacity=".8" strokeWidth="3" strokeLinecap="round" />
          <rect x="271" y="365" width="60" height="55" rx="17" fill="#203d30" stroke="#587e69" strokeWidth="2" />
          <path d="M281 368H319" stroke="#d5f2e1" strokeOpacity=".2" strokeLinecap="round" />
          <path d="M291 383L282 391L291 399M312 383L321 391L312 399M305 380L298 403" stroke="#abebc9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="282" y="440" width="37" height="4" rx="2" fill="#678b76" />
          <m.g style={{ x: active ? headX : 0, y: active ? headY : 0 }}>
            <g className={styles.headDrift}>
            <m.g style={{ originX: "300px", originY: "300px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.head}>
            <rect x="293" y="111" width="12" height="44" rx="6" fill="#87a394" />
            <circle cx="299" cy="109" r="12" fill="#b4e1c9" stroke="#789d89" strokeWidth="3" />
            <circle cx="296" cy="105" r="3" fill="white" fillOpacity=".9" />
            <rect x="153" y="222" width="38" height="64" rx="18" fill={paint("edge")} stroke="#809d8c" strokeWidth="2" />
            <rect x="411" y="222" width="38" height="64" rx="18" fill={paint("edge")} stroke="#809d8c" strokeWidth="2" />
            <path d="M180 194C187 161 226 148 300 148C373 148 415 163 422 194L429 268C433 309 402 334 301 336C201 338 167 310 171 269L180 194Z" fill={paint("shell")} stroke="#9fb6a8" strokeWidth="2" />
            <path d="M198 181C222 168 257 164 299 164" stroke="white" strokeOpacity=".9" strokeWidth="3" strokeLinecap="round" />
            <rect x="191" y="190" width="219" height="124" rx="51" fill={paint("glass")} stroke="#5a7c69" strokeWidth="3" />
            <rect x="194" y="193" width="213" height="118" rx="48" stroke={paint("rim")} />
            <rect x="195" y="194" width="211" height="116" rx="47" fill={paint("sheen")} />
            <path d="M211 218C225 201 259 198 287 199" stroke="white" strokeOpacity=".13" strokeWidth="4" strokeLinecap="round" />
            <m.g style={{ x: active ? lookX : 0, y: active ? lookY : 0 }}>
              <g className={styles.gaze}>
              <m.g initial="rest" animate={gesture} variants={gestures.openEyes}>
              <g className={styles.eyes}>
                <rect x="241" y="231" width="28" height="38" rx="14" fill={paint("eye")} />
                <rect x="333" y="231" width="28" height="38" rx="14" fill={paint("eye")} />
                <ellipse cx="250" cy="239" rx="4" ry="5" fill="white" fillOpacity=".8" />
                <ellipse cx="342" cy="239" rx="4" ry="5" fill="white" fillOpacity=".8" />
              </g>
              </m.g>
              <m.g initial="rest" animate={gesture} variants={gestures.happyEyes}>
                <path d="M243 254Q255 234 267 254M335 254Q347 234 359 254" stroke={paint("eye")} strokeWidth="7" strokeLinecap="round" />
              </m.g>
              <m.path initial="rest" animate={gesture} variants={gestures.smile} d="M287 285 Q301 297 315 285" stroke="#a4e4c0" strokeWidth="4" strokeLinecap="round" />
              </g>
            </m.g>
            <circle cx="211" cy="279" r="4" fill="#b4e3c8" fillOpacity=".35" />
            <circle cx="389" cy="279" r="4" fill="#b4e3c8" fillOpacity=".35" />
            </m.g>
            </g>
          </m.g>
          </m.g>
        </g>
      </svg>
    </m.div>
    </div>
    <div className={styles.sceneFooter}>
    <div className={styles.caption}><span className={styles.captionLine} aria-hidden="true" /><span>A little curiosity.<br /><strong>A lot of building.</strong></span></div>
    <div className={styles.controls}>
      <button type="button" className={styles.hello} onClick={replayGreeting} disabled={!active} title="Replay the robot’s wave and greeting">Say hello<span aria-hidden="true">↗</span></button>
    </div>
    </div>
  </div></MotionConfig>;
}
