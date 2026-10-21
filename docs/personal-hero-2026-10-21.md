# Personal developer hero

This revision supersedes the Career Nexus-focused hero following owner feedback on 21 October 2026.

- Name and software-developer identity now lead the opening. Supporting text describes existing React and browser-automation work.
- The primary action explores all selected work. Career Nexus remains the first project in Selected Work, rather than occupying the hero.
- An original vector robot replaces the screenshot stage: sculpted silver surfaces, dark visor, teal eyes, code emblem, and an articulated arm.
- Motion runs autonomously: floating, blinking, gentle head movement, a scanning gaze, and a greeting repeated after a 4.8-second rest. The 2.8-second greeting coordinates separate shoulder, elbow, and wrist joints with a slight body lean, head tilt, happy curved eyes, and a wider smile. All gesture parts share one timeline; the normal expression returns between waves. Pointer tracking adds a small response on suitable desktops; no pointer movement or click is needed to keep the character alive. Say hello immediately restarts the repeating greeting.
- The robot has no separate pause button. Its automatic motion continues under the existing site-wide animation switch in the footer. Continuous character animation pauses when offscreen or when the browser tab is hidden.
- The character is server-rendered SVG with no external imagery, model download, or WebGL dependency. The previous lazy screenshot renderer remains in the repository but is no longer imported by the hero.
- Layout stacks below 900px; interaction buttons remain available on touch screens.

No build, test suite, or browser verification was run, as requested. Existing hero HTML regression assertions were adjusted to reflect the revised public interface.
