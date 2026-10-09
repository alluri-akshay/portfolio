# Refinement Phases 3 and 4

## Implemented

- Hero introduces identity, headline, supporting copy/actions, and the project
  scene in sequence. The last group completes within the planned 900ms; content
  starts visible and actions remain interactive.
- Real project panels have independent pointer movement, damped springs, and
  hover/focus elevation. Front tilt is capped at 6 degrees, back tilt at 3.
- Scrolling the hero moves the back panel 20px and front panel 45px while their
  rotation settles to neutral. Headlines/buttons do not receive scroll movement.
- Whole-home-section reveals were replaced with smaller content groups. Their
  travel is 16px, duration 450ms, and stagger delays cap at 250ms.
- Project screenshots move within stable clipping containers. Five-percent
  travel gives approximately 24-36px total movement at typical desktop card
  sizes; overscan prevents exposed edges. Coarse-pointer/reduced-motion modes
  display static screenshots.
- Shared section navigation marks the current location, including the mobile
  menu. The bottom-of-page case selects Contact correctly.
- A thin progress line below the header follows document reading progress,
  including when spatial motion is reduced.

## Minimal verification

Type-checking and diff whitespace checks passed. Dev HTML returned 200 with
the scene, progress line, and portfolio content present.

Browser checks confirmed initial panel depths of 12px/38px, then 20px/45px
vertical displacement after scrolling to Work. Work received aria-current and
the progress line advanced from zero to approximately 19%. Project preview
movement was present on a fine-pointer device. No horizontal overflow was
observed in the checked desktop state.

Keyboard activation of Reduce motion disabled panel and screenshot transforms.
Normal motion was restored. A clean final reload had no new browser errors;
an earlier transient hot-reload error occurred while exports were being edited.

No build or full test suite was run, per the requested minimal testing scope.
Detailed performance, touch-device testing, and motion recording remain part
of the later validation phase. Route transitions and WebGL were not added.
