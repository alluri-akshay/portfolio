# Phase 2: Career Nexus hero

Implemented 21 October 2026. Ready for owner UI review. No build or test suite was run, per request; rendered layout and motion timing are not claimed as verified.

- Career Nexus is the sole hero showcase, selected explicitly by slug with a safe first-image fallback. The main action opens its case study directly; resume and selected-work navigation remain available.
- New opening hierarchy: developer identity, two-line headline, introduction/actions, then the featured project and contribution context.
- The visual stage uses a faint grid, a one-time accent-line entrance, and a larger project image. Project summary and technologies sit beneath the visual, outside the moving scene.
- The lazy 3D scene unfolds forward, responds to desktop pointer movement, and straightens/recedes while scrolling. Rendering still pauses offscreen/in hidden tabs and settles rather than looping continuously.
- A persistent full-stage project link remains usable while the screenshot/canvas crossfade. Hover or keyboard focus reveals its exploration cue. Touch layouts show the cue without hover.
- Mobile uses the real screenshot in a stable frame. The site's animations-off choice removes spatial effects, including the decorative accent entrance.
- Hero layout uses a scoped CSS module so subsequent section work can proceed independently. Existing project evidence and claims are retained.

The existing HTML regression expectations were updated to match the Career Nexus-only hero; they were not executed during this phase.
