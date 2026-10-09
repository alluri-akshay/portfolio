# Hero depth and scrolling review

Implemented phases 1 and 2 on 3 October 2026. The optional WebGL scene remains
deferred until the CSS result is reviewed.

- Layered panel edges, shadows, highlights, and visible keyboard focus.
- Desktop pointer tilt capped at 8 degrees, combined horizontal movement at
  12px, and hover/focus lift of 18px.
- Hero-relative scroll progression: overlap, separation, then alignment.
  Front-panel vertical travel spans 44px; back-panel travel spans 24px.
  Rotation changes span at most 6 degrees. Scrolling remains native.
- Hero transforms disabled below 1024px, with coarse pointers, and under the
  existing site or system reduced-motion preference.

Browser checks covered widths of 375, 768, and 1440px without horizontal
overflow. Both hero links can receive keyboard focus. The site reduced-motion
toggle produces computed transforms of `none`. Scrolling to the hero exit
produces the final aligned transforms, and returning reverses the progression.
No browser console warnings or errors were observed during these checks.

Review screenshots: `desktop.png`, `tablet.png`, and `mobile.png`. These are
still images, not recordings. Physical touch-device behavior, pointer movement
feel, and the operating-system preference switch still warrant manual review;
the system preference and coarse-pointer CSS guards remain in place.

Validation: TypeScript, ESLint, and all 10 development-server regression tests.
No new dependencies, backend changes, or deployment changes were made.
