# Hero height refinement

Implemented 21 October 2026 after the owner reported hero actions below the fold on a shorter laptop viewport.

At widths of at least 760px and heights up to 800px, the hero uses a compact two-column composition. Heading size responds to both the content column and available screen height. Paragraph spacing, top padding, and supporting metadata are tighter, while interactive targets remain at least 44px tall. The robot's maximum size reserves space for the header and its greeting control.

This also keeps landscape tablets in a two-column layout when stacking would make the hero unnecessarily tall. On narrow phones the content stays stacked, with smaller vertical gaps and a capped robot. Normal page scrolling remains available; the page does not force browser zoom, clip content, or lock the hero to a fixed height.

No build or test suite was run. The changed rules are ready for owner review on the target screen.
