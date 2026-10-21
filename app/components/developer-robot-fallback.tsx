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
  duration: 4.2,
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
    greet: { rotate: [-12, -28, -90, -92, -90, -92, -30, -12], transition: greetingTiming },
  },
  elbow: {
    rest: { rotate: 0 },
    greet: { rotate: [0, -20, -80, -80, -80, -80, -25, 0], transition: greetingTiming },
  },
  wrist: {
    rest: { rotate: 0 },
    greet: { rotate: [0, 0, -6, 6, -6, 0, 0, 0], transition: greetingTiming },
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
export function VectorRobot() {
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
    <m.div className={styles.character} role="img" aria-label="An ivory AA robot with mint eyes, articulated hands, and a friendly wave"
      style={{ rotateX: active && pointerEnabled ? rotateX : 0, rotateY: active && pointerEnabled ? rotateY : 0 }}>
      <svg viewBox="70 65 480 470" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-shell`} cx=".28" cy=".18" r=".91"><stop stopColor="#f6faf7" /><stop offset=".38" stopColor="#e3ece6" /><stop offset=".72" stopColor="#b4c8bd" /><stop offset=".93" stopColor="#7f9e8d" /><stop offset="1" stopColor="#527461" /></radialGradient>
          <radialGradient id={`${id}-body`} cx=".3" cy=".16" r=".94"><stop stopColor="#f6faf7" /><stop offset=".42" stopColor="#e0eae3" /><stop offset=".75" stopColor="#a9c1b2" /><stop offset="1" stopColor="#688d78" /></radialGradient>
          <linearGradient id={`${id}-limb`} x1="0" y1=".2" x2="1" y2=".6"><stop stopColor="#819c8b" /><stop offset=".2" stopColor="#edf5ef" /><stop offset=".45" stopColor="#d9e8de" /><stop offset=".8" stopColor="#a6c0af" /><stop offset="1" stopColor="#6b907a" /></linearGradient>
          <radialGradient id={`${id}-socket`} cx=".35" cy=".25" r=".8"><stop stopColor="#b7cfc0" /><stop offset=".45" stopColor="#759a85" /><stop offset="1" stopColor="#2a4235" /></radialGradient>
          <filter id={`${id}-volume`} x="-25%" y="-25%" width="150%" height="160%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="3" dy="7" stdDeviation="4" floodColor="#06130b" floodOpacity=".32" result="cast" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="soft" />
            <feOffset in="soft" dx="-5" dy="-6" result="inset" />
            <feComposite in="SourceAlpha" in2="inset" operator="out" result="edge" />
            <feFlood floodColor="#304d3e" floodOpacity=".28" />
            <feComposite in2="edge" operator="in" result="shade" />
            <feMerge><feMergeNode in="cast" /><feMergeNode in="shade" /></feMerge>
          </filter>
          <filter id={`${id}-contact`} x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#06130b" floodOpacity=".5" /></filter>
          <linearGradient id={`${id}-glass`} x1="232" y1="188" x2="365" y2="326" gradientUnits="userSpaceOnUse"><stop stopColor="#303d35" /><stop offset=".45" stopColor="#15231d" /><stop offset="1" stopColor="#080f0c" /></linearGradient>
          <linearGradient id={`${id}-joint`} x1="390" y1="348" x2="428" y2="405" gradientUnits="userSpaceOnUse"><stop stopColor="#668471" /><stop offset="1" stopColor="#202d26" /></linearGradient>
          <linearGradient id={`${id}-chest`} x1="277" y1="370" x2="325" y2="430" gradientUnits="userSpaceOnUse"><stop stopColor="#405047" /><stop offset="1" stopColor="#202c25" /></linearGradient>
          <linearGradient id={`${id}-edge`} x1="165" y1="187" x2="446" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#b9d2c6" /><stop offset=".5" stopColor="#e9f5ee" /><stop offset="1" stopColor="#5f8070" /></linearGradient>
          <radialGradient id={`${id}-shadow`}><stop stopColor="#1a3025" stopOpacity=".3" /><stop offset="1" stopColor="#1a3025" stopOpacity="0" /></radialGradient>
          <linearGradient id={`${id}-eye`} x1="258" y1="232" x2="267" y2="270" gradientUnits="userSpaceOnUse"><stop stopColor="#d4ffeb" /><stop offset="1" stopColor="#65c79f" /></linearGradient>
          <linearGradient id={`${id}-sheen`} x1="232" y1="190" x2="316" y2="298" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity=".12" /><stop offset=".65" stopColor="white" stopOpacity="0" /></linearGradient>
          <linearGradient id={`${id}-rim`} x1="190" y1="200" x2="405" y2="310" gradientUnits="userSpaceOnUse"><stop stopColor="#e7f9ef" stopOpacity=".75" /><stop offset=".55" stopColor="#afcfbd" stopOpacity=".12" /><stop offset="1" stopColor="#afcfbd" stopOpacity=".45" /></linearGradient>
          <g id={`${id}-hand`}>
            <rect x="400" y="436" width="20" height="14" rx="7" fill={paint("socket")} />
            <g filter={paint("volume")}>
              <path d="M390 451Q389 442 400 441L419 442Q430 444 431 454L428 468Q425 476 415 477L399 474Q391 472 390 462Z" fill={paint("limb")} />
              <path d="M400 449Q409 445 419 450L421 463Q414 472 401 465Q397 459 400 449Z" fill={paint("chest")} stroke="#809b8b" strokeWidth="1.2" />
              <g fill={paint("socket")}>
                <rect x="391" y="469" width="10" height="24" rx="5" transform="rotate(9 396 470)" />
                <rect x="405" y="474" width="10" height="24" rx="5" />
                <rect x="419" y="470" width="10" height="23" rx="5" transform="rotate(-9 424 470)" />
              </g>
              <g fill={paint("limb")}>
                <g transform="rotate(9 396 470)"><rect x="390" y="467" width="12" height="15" rx="5" /><rect x="391" y="485" width="10" height="16" rx="5" /></g>
                <rect x="404" y="470" width="12" height="16" rx="5" /><rect x="405" y="489" width="10" height="18" rx="5" />
                <g transform="rotate(-9 424 470)"><rect x="418" y="467" width="12" height="15" rx="5" /><rect x="419" y="485" width="10" height="16" rx="5" /></g>
                <g transform="rotate(-34 430 451)"><rect x="426" y="447" width="12" height="15" rx="5" /><rect x="427" y="461" width="10" height="6" rx="3" fill={paint("socket")} /><rect x="427" y="465" width="10" height="14" rx="5" /></g>
              </g>
              <path d="M394 450Q397 444 404 445" stroke="#f7fcf9" strokeOpacity=".65" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        </defs>
        <ellipse className={styles.shadow} cx="302" cy="526" rx="112" ry="19" fill={paint("shadow")} />
        <g className={styles.float}>
          <m.g data-robot-joint="body" style={{ originX: "300px", originY: "400px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.body}>
          <g>
            <ellipse cx="204" cy="361" rx="27" ry="30" fill={paint("shell")} filter={paint("volume")} />
            <ellipse cx="211" cy="362" rx="15" ry="22" fill={paint("socket")} stroke="#567b65" strokeWidth="2" />
            <path d="M186 377Q195 371 203 381L193 409Q189 419 177 414Q166 410 171 399Z" fill={paint("limb")} filter={paint("volume")} />
            <ellipse cx="178" cy="413" rx="12" ry="12" fill={paint("socket")} />
            <path d="M164 419C171 414 182 415 186 422C191 431 188 445 180 452C174 458 164 454 159 446C153 437 155 425 164 419Z" fill={paint("limb")} filter={paint("volume")} />
            <path d="M160 425Q158 440 167 447M181 420L185 438" stroke="#f7fcf9" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round" />
            <g transform="translate(172 449) rotate(12) scale(.72) translate(-410 -439)"><use href={`#${id}-hand`} /></g>
          </g>
          <m.g data-robot-joint="shoulder" style={{ originX: "408px", originY: "354px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.shoulder}>
            <ellipse cx="405" cy="355" rx="26" ry="29" fill={paint("shell")} filter={paint("volume")} />
            <ellipse cx="401" cy="355" rx="15" ry="21" fill={paint("socket")} stroke="#567b65" strokeWidth="2" />
            <path d="M399 371Q411 364 422 375L426 389Q424 402 411 402Q396 400 394 388Z" fill={paint("limb")} filter={paint("volume")} />
            <path d="M399 375Q395 385 401 392" stroke="white" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
            <circle cx="410" cy="397" r="12" fill={paint("socket")} />
            <m.g data-robot-joint="elbow" style={{ originX: "410px", originY: "397px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.elbow}>
              <path d="M398 403C409 399 422 401 427 410C431 419 433 429 426 438C422 443 414 446 405 442C391 437 386 421 392 409Q394 405 398 403Z" fill={paint("limb")} filter={paint("volume")} />
              <path d="M397 410Q393 425 401 435M424 407L429 423Q428 434 421 438" stroke="#f7fcf9" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round" />
              <m.g data-robot-joint="wrist" style={{ originX: "410px", originY: "439px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.wrist}>
                <use href={`#${id}-hand`} transform="translate(410 439) scale(.88) translate(-410 -439)" />
              </m.g>
            </m.g>
          </m.g>
          <rect x="277" y="305" width="48" height="39" rx="12" fill={paint("socket")} stroke="#54765f" />
          <path d="M280 323Q301 328 322 323" stroke="#182b20" strokeWidth="3" />
          <path d="M250 338C228 343 222 375 217 411C214 464 242 517 298 520C352 521 384 473 384 426C384 379 374 344 346 337Q301 326 250 338Z" fill={paint("body")} filter={paint("volume")} />
          <ellipse cx="301" cy="340" rx="40" ry="14" fill="#344d40" stroke="#91ac9d" strokeWidth="1.5" />
          <ellipse cx="301" cy="336" rx="27" ry="9" fill={paint("socket")} />
          <path d="M245 346C235 361 235 377 243 390M353 344C367 361 368 376 359 390" stroke="#7e9b89" strokeOpacity=".65" strokeWidth="1.2" />
          <path d="M244 392C246 426 249 463 270 490Q300 505 331 489C350 463 355 431 358 392" stroke="#648571" strokeOpacity=".55" strokeWidth="1.4" />
          <path d="M245 395Q249 444 263 469" stroke="#f6fbf8" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
          <path d="M222 427Q231 420 236 436L244 471Q248 488 238 480Q222 460 222 427Z" fill="#304d3e" />
          <path d="M272 511Q298 525 326 510" stroke="#5d816a" strokeWidth="6" strokeLinecap="round" />
          <path d="M272 368Q301 362 330 368Q338 370 335 381L324 418Q321 426 301 427Q282 426 278 418L267 382Q264 371 272 368Z" fill={paint("chest")} stroke="#789b84" strokeWidth="2" filter={paint("contact")} />
          <path d="M274 370Q301 365 328 370" stroke="#e3eee7" strokeOpacity=".25" strokeLinecap="round" />
          <text x="301" y="405" textAnchor="middle" fill="#eaf4ed" fontFamily="Manrope Variable, sans-serif" fontSize="21" fontWeight="650" letterSpacing="-1">AA</text>
          <path d="M228 366Q219 384 221 402" stroke="#f6fcf8" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
          <path d="M371 386Q383 422 365 449" stroke="#53765f" strokeOpacity=".25" strokeWidth="2" strokeLinecap="round" />
          <rect x="283" y="465" width="37" height="8" rx="4" fill="#526f5e" />
          <rect x="285" y="467" width="33" height="4" rx="2" fill="#a9e7c8" />
          <m.g style={{ x: active ? headX : 0, y: active ? headY : 0 }}>
            <g className={styles.headDrift}>
            <g transform="translate(36 22) scale(.88)">
            <m.g style={{ originX: "300px", originY: "300px", transformBox: "view-box" }} initial="rest" animate={gesture} variants={gestures.head}>
            <rect x="351" y="124" width="9" height="30" rx="4.5" transform="rotate(15 351 124)" fill={paint("joint")} />
            <rect x="350" y="116" width="12" height="18" rx="6" transform="rotate(15 350 116)" fill="#b2d5c3" stroke="#7a9c88" />
            <ellipse cx="176" cy="241" rx="17" ry="37" fill={paint("limb")} filter={paint("volume")} />
            <ellipse cx="174" cy="241" rx="9" ry="27" fill={paint("socket")} />
            <path d="M176 197C180 157 218 137 288 138C362 138 408 155 420 190L429 262C434 307 408 332 310 337C214 339 172 317 170 276L176 197Z" transform="translate(4 5)" fill="#718f7e" />
            <path d="M176 197C180 157 218 137 288 138C362 138 408 155 420 190L429 262C434 307 408 332 310 337C214 339 172 317 170 276L176 197Z" fill={paint("shell")} filter={paint("volume")} />
            <path d="M184 210L187 194C194 163 231 149 283 149" stroke="#fafffc" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" />
            <path d="M294 139Q320 139 348 147L343 157Q318 150 293 150Q285 148 290 141Z" fill={paint("body")} stroke="#89a494" strokeWidth=".8" />
            <path d="M398 193Q408 180 418 198L430 262Q428 292 414 300L407 278" fill={paint("limb")} stroke="#849f8d" strokeWidth="1" />
            <ellipse cx="423" cy="249" rx="11" ry="26" fill={paint("socket")} transform="rotate(-6 423 249)" />
            <path d="M229 178C271 171 337 176 373 188C403 199 414 223 411 258L407 281C401 309 372 321 303 318L239 314C205 311 184 292 185 258L187 225C188 197 201 183 229 178Z" fill="#6e8e7a" filter={paint("contact")} />
            <path d="M230 183C271 176 336 181 370 193C398 203 408 225 405 257L401 279C396 303 370 315 303 312L241 308C210 305 190 289 191 258L193 227C194 202 205 188 230 183Z" fill={paint("glass")} stroke="#1d2d22" strokeWidth="3" />
            <path d="M230 185C272 178 334 183 369 195C396 205 405 225 402 256L398 278C393 300 368 311 303 309L242 305C212 302 194 287 194 258L196 227C197 204 207 190 230 185Z" stroke={paint("rim")} strokeWidth="1" />
            <path d="M222 192Q296 173 371 204Q391 215 395 237C367 207 275 190 210 216Q212 199 222 192Z" fill={paint("sheen")} />
            <path d="M207 211Q213 195 234 193" stroke="white" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
            <path d="M373 313L374 330" stroke="#759481" strokeOpacity=".65" strokeWidth="1" />
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



