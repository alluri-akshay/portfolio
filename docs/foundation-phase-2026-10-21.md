# Phase 1: theme and motion foundation

Implemented 21 October 2026. Awaiting the owner's UI review; no build or test suite was run, as requested.

## Palette

| Purpose | Light | Dark |
| --- | --- | --- |
| Canvas | #f8f9f8 | #141717 |
| Surface | #ffffff | #1c2020 |
| Raised surface | #ffffff | #292e2d |
| Main text | #222725 | #f0f3f1 |
| Supporting text | #606a65 | #acb6b0 |
| Accent | #146b58 | #94cdb6 |

Neutral backgrounds carry the layout. Teal is reserved for actions, focus, and small emphasis. Career Nexus uses muted slate/green framing. Purple/violet/lavender theme values and 3D light tints were removed. Existing product screenshot pixels remain authentic to their source.

## Motion behavior

Animations default to on. The site switch explicitly controls motion independently of OS preferences. A stored off choice remains off until the visitor changes it. The switch appears in desktop navigation, the mobile menu, and the footer. Its pressed state represents animations on.

The preference uses a stable server snapshot to avoid the previous system-dependent hydration mismatch. A small head script applies the stored CSS alternative before paint. Blocked storage retains the choice for the current session, and storage events synchronize changes between tabs. The switch is never disabled by the OS setting.

Pointer effects still require a suitable pointer and screen size. WebGL remains capability-dependent, with static project imagery available when unsupported. Mobile section entrances and feedback remain available in full motion mode.

## Continuation

Edits from before the model change also include software-developer labeling, Career Nexus foreground ordering, contribution labels, and initial contact/footer copy. Their new style hooks are completed in this phase. Further hero, project, experience, about, credentials, contact, and footer refinements should proceed one phase at a time following UI feedback.

The earlier audit described honoring OS reduced motion. The owner's later explicit request supersedes that policy: this implementation makes the site choice independent of OS settings.
