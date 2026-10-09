# Research-informed depth refinement

The existing portfolio, project screenshots, themes, and motion tokens are the visual target. The goal is to make project exploration feel dimensional while keeping reading and navigation clear.

## Principles and application

- **Purposeful motion:** use animation to communicate feedback, navigation, and state changes. Project frames now gain a bounded pointer-following light and stronger hover shadow; supporting text surfaces retain a shallower tilt. Source: [NN/g, The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/).
- **Responsive timing:** short feedback and natural settling should not delay an action. Depth surfaces share a damped spring; border and shadow feedback use the existing 140/220 ms tokens. Appearance changes now include raised cards, browser toolbars, workflow steps, credentials, and case-study frames. Source: [Material Design, Duration & easing](https://m1.material.io/motion/duration-easing.html). These exact values are implementation choices, not universal requirements from the source.
- **Control over motion:** nonessential motion can be disabled. Pointer effects remain desktop-only; keyboard focus straightens preview frames. Both device and site reduced-motion preferences remove moving transforms and lighting. Source: [W3C, Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions).
- **Stable layout:** the visual plane moves inside a fixed interactive target. A narrow-screen hero glow overflow was corrected by containing its horizontal bounds.

## Validation

Type checking, lint, and all 9 existing theme tests passed. Browser checks covered desktop light/dark appearance, a focused project frame, widths 375 and 320 without horizontal overflow, and the site reduced-motion switch. Under reduced motion all depth/workflow transforms were removed and the lighting overlay was hidden. No new dependencies, static export, or deployment.
