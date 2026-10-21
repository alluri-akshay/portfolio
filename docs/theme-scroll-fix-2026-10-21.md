# Theme switch scroll correction

The project section was not shrinking. Its measured height stayed at 1476.255px. Activating the clipped radio input in the sticky navigation changed scrollY from 608 to 0.

Replaced clipped radios with native theme buttons and aria-pressed state. Pointer focus uses preventScroll. Tab focus records the position immediately before focus and restores it on the next frame to avoid the browser scrolling a sticky control to its original document position. This handling is scoped to theme-control focus; normal scrolling and section navigation remain available. Color transitions, persistent theme storage, and mobile controls retain their existing behavior.

Focused browser verification:
- Pointer theme switch: scrollY 608 before and after; project section top 112px before and after.
- Tab followed by Enter: scrollY 608 and project section top 112px retained.
- Mid-project light/dark/light sequence: scrollY 968 and Auto Auth top 352.948px retained.
- Project-section height unchanged between themes.

No build or full test suite run.
