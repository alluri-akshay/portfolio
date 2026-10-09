# Refinement plan: Phase 1 and Phase 2 implementation

This implements Phase 1 and Phase 2 of the latest eight-phase refinement plan,
not the earlier five-phase portfolio plan.

## Phase 1 - visual structure

- Contact/footer now share the warm paper background and restrained blue actions.
- The dark experience section remains the single full-width contrast section;
  lime is restricted to its small labels, icons, and keyboard focus indicators.
- Project containers and badges use neutral colors; real screenshots supply
  their own product colors.
- Contact has the agreed heading, one sentence, email and Copy email together,
  and GitHub/LinkedIn beneath them.
- LeetCode and HackerRank moved into the Coding profiles group beside Skills.
- The telephone link and availability messaging are absent from the page.
  The existing resume and its download URL are unchanged.
- The quiet footer contains copyright, Back to top, and the Phase 2 motion control.

Measured at a 1440px viewport: contact 328px plus footer 73px (401px total),
within the planned 360-440px desktop target. At 390px: contact 424px plus footer
104px, growing naturally for wrapped content. Neither viewport overflowed.

## Phase 2 - shared motion foundation

- Shared duration tokens: feedback 180ms, navigation 250ms, entrances 450ms,
  hero 700ms, page arrival 300ms; entrance easing is cubic-bezier(.22,1,.36,1).
- A single LazyMotion/MotionConfig owner lives in the root layout, while page
  content continues to be passed as server-rendered children.
- Motion preferences respect the device setting and expose a Reduce motion
  button. The choice persists in localStorage and synchronizes across tabs.
  Blocked storage falls back to an in-session choice.
- Existing entrances use shared values and keep initial server content visible.
- Scene movement lives separately in motion-scene.tsx. Existing tilt respects
  the shared preference; new scroll-linked choreography is reserved for Phase 3.
- CSS feedback uses the same timing variables. Site/device reduced motion also
  disables CSS transitions, tilt, image scaling, and smooth scrolling.

## Verification

- Type-checking, lint, and all ten dev-server tests passed.
- Browser toggle changed the root to reduced motion, disabled tilt, and changed
  document scrolling to auto. The setting survived reload. Turning it off
  restored normal motion and smooth scrolling.
- Copy email succeeded with visible Copied feedback and an accessible status.
- Keyboard navigation reached Back to top from the motion control.
- Clean browser error log was empty.
- No build commands or new dependency installs were used.

OS-level reduced-motion emulation and blocked-storage failure were not forced.
The new hero sequence, independent panel depth, scroll choreography, route
transitions, and WebGL remain later phases and were not added in this change.
