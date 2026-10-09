# Portfolio theme and motion direction

Phase 1 design specification, completed on 4 October 2026.

This document defines the light and dark visual identities, the motion storyboard, and shared design rules for Akshay Alluri's current portfolio. It is the implementation reference for the remaining seven phases. Its decisions are based on the active source files inspected on this date, including uncommitted work. Palette and timing values below are design targets; browser rendering and performance verification belong to the later implementation phases.

## Phase 1 completion

| Subphase | Deliverable | Status |
| --- | --- | --- |
| 1.1 Establish the two theme identities | Semantic palettes, project colors, section treatments, and interaction states | Specified |
| 1.2 Define where the strongest motion belongs | Visitor journey storyboard with triggers, sequencing, and static alternatives | Specified |
| 1.3 Establish shared design rules | Typography, spacing, depth, timing, responsive behavior, and acceptance criteria | Specified |

The Phase 1 completion condition is satisfied by the visual specification and motion storyboard below. Theme switching, CSS conversion, and animation changes are implementation work in Phases 2 through 7. The live site has not yet received these changes.

## Current source foundation

The homepage orders its content as hero, technology strip, selected work, experience, about and skills, credentials, contact, and footer. Selected work contains Career Nexus, Auto Auth, and Burger Hut. Each project has a directly accessible case study, and unknown routes have recovery navigation.

The current visual language uses Manrope Variable, selective Georgia emphasis, warm paper, cobalt blue, generous spacing, and rounded project surfaces. Experience and the orange project chapter have explicit dark treatments. There is no global theme preference or light and dark switch.

Motion already includes heading entrances, section reveals, desktop project-image parallax, pointer tilt, magnetic action content, contextual cursor feedback, and a lazy Three.js hero. The site has device and stored reduced-motion preferences, touch fallbacks, and route-focus handling.

| Source | Responsibility in this specification |
| --- | --- |
| app/globals.css | Palette, typography, layout, states, and static alternatives |
| app/layout.tsx | Future theme initialization alongside the existing motion provider |
| app/lib/motion-tokens.ts | Future shared timing and movement limits |
| app/components/motion.tsx | Hero, section, and page entrance behavior |
| app/components/hero.tsx and hero-showcase.tsx | Opening composition and fallback handoff |
| app/components/hero-3d-scene.tsx | Theme-aware materials, lighting, and camera behavior |
| app/components/project-card.tsx and project-chapter.tsx | Chapter composition and scroll feedback |
| app/components/motion-scene.tsx and interactive-preview.tsx | Image parallax and pointer response |
| app/components/site-navigation.tsx and mobile-navigation.tsx | Navigation hierarchy and theme control placement |
| app/components/case-study.tsx and case-study-contents.tsx | Calm reading and project continuity |

## Subphase 1.1 Theme identities

### Light identity

Use a warm paper canvas with white project surfaces, dark navy text, and cobalt actions. Reserve larger shadows for screenshots and the hero composition. Fine dividers and generous spacing establish hierarchy elsewhere. The overall impression should be clear, approachable, and precise.

### Dark identity

Use a deep navy canvas with progressively lighter charcoal surfaces. Text should be soft white, with a readable blue-gray secondary tone. The accent becomes a lighter blue so text links remain clear against dark surfaces. Use surface contrast, fine borders, and subtle edge light to define depth. Avoid continuous glowing decoration.

Dark mode uses the same information hierarchy, image dimensions, and section rhythm as light mode. Project screenshots retain their original image colors; their frames and surrounding surfaces adapt to the theme.

### Semantic palette

These names describe each color's purpose. They are proposed tokens for Phase 2, not changes to the current CSS.

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| --background | #f6f5f0 | #0d131c | Page canvas |
| --surface | #ffffff | #151e2b | Cards, menu, secondary controls |
| --surface-raised | #ffffff | #202d40 | Elevated or hovered surfaces |
| --surface-subtle | #edf1f7 | #192436 | Tags and selected backgrounds |
| --text-primary | #111827 | #eef2f7 | Headings and primary body text |
| --text-secondary | #526071 | #a9b6c8 | Supporting copy and metadata |
| --border | #d9dee7 | #35455c | Decorative separators and surface edges |
| --border-interactive | #78879b | #7387a2 | Controls that require a visible boundary |
| --accent | #2457d6 | #9bbaff | Links, focus, progress, primary actions |
| --accent-hover | #1d46ae | #b7cdff | Hovered primary actions |
| --on-accent | #ffffff | #0d131c | Text and icons on primary actions |
| --focus-ring | #2457d6 | #9bbaff | Keyboard focus |
| --feature-background | #111827 | #172233 | Experience section |
| --feature-text | #eef2f7 | #eef2f7 | Primary text on feature surfaces |
| --feature-muted | #a9b6c8 | #a9b6c8 | Secondary text on feature surfaces |
| --feature-accent | #c9ff64 | #c9ff64 | Small feature icons and labels |

Do not remap the current --ink variable directly to dark-mode text: it also supplies the experience section background and navigation CTA background. Split these responsibilities before converting styles. --white also currently represents both a surface and literal white foreground; those uses need separate tokens.

A decorative border is not the sole indicator of a control or selected state. Give interactive boundaries their own contrast check during Phase 8. Colors for errors and success must include readable text or icons; color alone does not communicate the state.

### Project identities

| Project | Light visual surface and accent | Dark visual surface and accent | Presentation |
| --- | --- | --- | --- |
| Career Nexus | #ebe8f6 and #6751a7 | #262039 and #c7b7ff | Violet framing around the real dashboard screenshot |
| Auto Auth | #dcefeb and #19635a | #142f2b and #85d7c5 | Teal workflow illustration with explicit step labels |
| Burger Hut | #fff0e1 and #8c4a14 | #29231e and #ffbd76 | Warm framing around the original food-ordering screenshot |

Use the normal theme surface for each chapter's text panel. The image or illustration panel carries the project's tinted surface. This gives Burger Hut an intentional light version and keeps its warm identity in dark mode. Project accents support numbering, progress, and illustrations; shared action buttons use the site accent consistently.

### Section treatment

| Surface | Light treatment | Dark treatment |
| --- | --- | --- |
| Header | Translucent paper, navy text, fine divider | Translucent navy, soft white text, visible divider |
| Hero | Paper canvas, white panel edges, soft contact shadow | Navy canvas, charcoal panel edges, restrained edge light |
| Technology strip | Paper with thin dividers | Canvas with theme dividers |
| Project chapters | White text panel and project tint | Charcoal text panel and darker project tint |
| Experience | Dark navy feature band | Slightly raised navy feature band |
| About and credentials | Open paper layout and fine rules | Open dark layout and readable fine rules |
| Contact and footer | Paper, cobalt links, compact controls | Dark canvas, pale-blue links, charcoal controls |
| Case studies | Paper reading canvas and white evidence panel | Dark reading canvas and charcoal evidence panel |
| Mobile menu and theme picker | White raised surface | Charcoal raised surface |
| 404 | Standard page palette and primary/secondary actions | Standard dark palette and equivalent actions |

### Interaction states and preference controls

| State | Visual rule | Motion rule |
| --- | --- | --- |
| Default | Clear label, stable hit area, appropriate surface | At rest |
| Hover | Accent or boundary emphasis appropriate to the control | One short content or icon response |
| Focus | Visible 3 px outline with sufficient separation | Clear state without reliance on pointer movement |
| Pressed | Stronger surface emphasis; readable label | Small immediate compression or icon reset |
| Selected | Text label plus indicator or selected surface | Short indicator movement |
| Success | Check icon and explicit confirmation | Brief replacement of the existing feedback icon |
| Error | Readable recovery message | No shake or repeated attention effect |
| Disabled | Explain unavailable preference when needed | Static |
| Reduced motion | Same state information and usable controls | Immediate updates without displacement |

Primary buttons use --accent with --on-accent. The navigation CTA follows that same pair. Secondary buttons use --surface and --text-primary. Inside the experience section, focus uses --feature-accent.

The theme control will expose Light, Dark, and System choices. System is the first-visit default and resolves to one of the two visual themes. Explicit choices persist across reloads and project navigation. Place a labeled compact control in desktop navigation and in the mobile navigation panel. On intermediate widths, ensure the extra control does not crowd the current navigation. Keep motion preference independent from theme preference.

### Palette contrast checks

Calculated using sRGB relative luminance on the solid colors above. These are arithmetic checks of proposed pairs, not a browser accessibility audit.

| Pair | Contrast ratio |
| --- | --- |
| Light primary text on page | 16.25 to 1 |
| Light secondary text on page | 5.88 to 1 |
| Light accent text on page | 5.64 to 1 |
| White text on light primary button | 6.16 to 1 |
| Dark primary text on page | 16.57 to 1 |
| Dark secondary text on page | 9.06 to 1 |
| Dark secondary text on raised surface | 6.76 to 1 |
| Dark accent text on raised surface | 7.19 to 1 |
| Dark primary button text on accent | 9.64 to 1 |
| Light violet accent on violet surface | 5.26 to 1 |
| Dark violet accent on violet surface | 8.64 to 1 |
| Light teal accent on teal surface | 5.91 to 1 |
| Dark teal accent on teal surface | 8.51 to 1 |
| Light orange accent on orange surface | 6.06 to 1 |
| Dark orange accent on orange surface | 9.45 to 1 |

All listed text pairs exceed a 4.5 to 1 design target at full opacity. Rendered checks must also cover opacity, gradients, translucent navigation, focus outlines, and hover states. Large decorative chapter numbers are not a substitute for the readable project numbers.

## Subphase 1.2 Motion storyboard

### Attention hierarchy

The hero is the strongest opening moment. Selected work receives the second strongest movement because it explains the portfolio's substance. Controls respond quickly to the visitor's actions. Experience, credentials, and case-study copy use quieter entrances. Contact provides a clear closing invitation.

Empathy in this design means readable content, predictable feedback, stable click targets, and respect for a visitor's motion preference. The visitor can act while entrances are playing.

### Visitor journey

Times are relative to each scene's trigger. Pointer and scroll values are bounded; normal document scrolling remains the source of navigation.

| Scene and trigger | Sequence and target | Static or reduced-motion alternative |
| --- | --- | --- |
| First home arrival | Name and role at 0 ms; headline lines at 80 and 180 ms; supporting copy and actions at 240 ms. Headline settles over 720 ms with a clipped 20 percent line rise. Supporting content travels no more than 12 px. | Fully readable content and actions at rest immediately |
| Hero image availability | Screenshot composition is visible first. Once the first usable 3D frame is ready, crossfade in 160 ms with matching framing. Loading does not delay the text sequence. | Keep the original screenshot composition |
| Hero pointer movement | Camera follows gently within the existing 4 degree pointer-angle cap. Panels and camera use one coordinated response rather than separate competing tilt effects. | Static framed screenshots and normal project links |
| Leaving the hero | Camera recedes by at most the existing 1.2 world-unit scroll travel and settles as work enters view. Text remains stationary. | Natural document scrolling |
| Selected work entering view | Heading arrives first over 520 ms; visual follows over 560 ms; summary follows by 80 ms. Supporting features and actions arrive together. Run once per chapter. | Whole chapter visible immediately |
| Project hover or focus | On desktop pointer hover, preview tilts at most 3 degrees and lifts at most 6 px. Focus gets visible edge emphasis and a clear View project cue. | Stable image and visible cue on touch; focus outline on keyboard |
| Project scroll movement | Image travel capped at approximately 3 percent in either direction, with measured overscan that preserves screenshot content. Progress line follows the chapter. | Stable image; decorative progress at rest |
| Auto Auth entering view | Prefill, Validate, Submit arrive 80 ms apart over 420 ms per step; connecting emphasis follows the same order. Illustration remains clearly labeled. | All steps and connections visible together |
| Experience entering view | Heading and role summary arrive within 480 ms. Contribution group follows after 80 ms with no movement while reading. | Fully visible heading and role information |
| About and credentials entering view | Short 400 ms entrances, at most 6 px travel; groups may stagger by 60 ms with a 180 ms cap. | Stable open layout |
| Contact entering view | Heading and invitation arrive together in 440 ms; actions follow by 60 ms. | Invitation and actions visible immediately |
| Copy email action | Existing copy/check icon replacement in 140 ms. Keep the existing explicit status message and three-second success display. | Immediate icon and text update |
| Mobile menu action | Panel arrives in 220 ms with at most 8 px travel; items stagger by 24 ms within 120 ms total. Close in 160 ms. | Immediate panel opening and closing |
| Project route arrival | Case-study title and summary arrive over 420 ms; details follow by 60 ms. Keep normal route focus and history restoration. | Content visible at destination immediately |
| Case-study reading | Heading groups use 320 ms and at most 4 px travel. Long paragraphs remain stationary. | Entire reading section visible |
| Theme selection | Change surfaces, text, and borders over 180 ms; update 3D material colors without remounting the scene where feasible. | Immediate palette update |

Shared-image route transitions are a later Phase 7 prototype. Their use depends on verified routing, browser support, focus behavior, and history restoration. This specification requires a coherent page arrival even when shared transitions are unavailable.

### Rules for overlapping effects

Assign a single owner to each moving layer. HeroLine owns headline displacement; an outer HeroEntrance may orchestrate timing but must not add another translation to the heading. InteractivePreview owns hover tilt and lift; ProjectPreview may move its nested image for scroll parallax. Remove competing CSS hover scaling when the preview already responds.

MagneticContent owns the primary action's inner movement with a maximum of 4 px horizontally and 3 px vertically. Its click target stays fixed. CSS hover rules must not add a second displacement to the same contents.

For project previews, image response and the View project cue are the main feedback. The cursor follower stays subordinate. Suppress the radial pointer highlight where the preview already has depth and border feedback. Plain links use color and a small directional icon movement, without magnetic behavior.

## Subphase 1.3 Shared design rules

### Typography and reading

Retain Manrope Variable as the main typeface. Georgia provides selective emphasis in the hero and existing section headings. Use sentence case for headings and keep uppercase to small section labels.

| Role | Size and rhythm |
| --- | --- |
| Desktop hero | Existing clamp from 48 to 82 px; approximately 1.04 line height |
| Small-screen hero | Existing responsive scale around 38 to 64 px, checked at narrow widths |
| Section heading | 34 to 56 px; approximately 1.1 line height |
| Project heading | 32 to 48 px; approximately 1.12 line height |
| Main body | 16 px; 1.7 to 1.85 line height |
| Hero support | 17 px desktop, 15 to 16 px on small screens |
| Case-study body | 16 px; up to 1.9 line height; maximum 65 characters of typical reading width |
| Control label | 14 px normally; maintain readability when space is limited |
| Metadata | 11 to 13 px with strong full-opacity contrast |

Theme selection never changes type sizes or font metrics. Headline masks must account for serif ascenders and descenders. Reading copy must not blur or move continuously.

### Spacing and composition

Use an 8 px base rhythm, with existing 12 px and 20 px exceptions for compact control and surface details. Shared spacing steps are 8, 12, 16, 24, 32, 40, 48, 72, 96, and 120 px.

Retain the 1240 px desktop shell and fluid 72 to 120 px major section spacing. Preserve mobile gutters of approximately 18 to 20 px. Align heading, paragraph, and action edges within each section. Alternate project visual order only where the desktop grid supports it; the small-screen reading order is visual then summary.

Keep controls at least 44 px in hit height. Theme switching, success labels, hover response, and scene loading must not change layout dimensions. Verify the existing navigation near its current 760 px collapse breakpoint once the theme control is added.

### Surface depth

| Level | Use | Light treatment | Dark treatment |
| --- | --- | --- | --- |
| 0 | Reading canvas and text sections | Paper and fine rules | Navy canvas and fine rules |
| 1 | Cards and ordinary controls | White surface with a subtle border | Charcoal surface with a visible edge |
| 2 | Menus and active surfaces | Soft 0 12px 36px shadow at low navy opacity | Raised surface with subtle black shadow and edge highlight |
| 3 | Hero and screenshot presentation | Broader soft shadow plus panel thickness | Controlled contact shadow and subdued edge light |

Use existing radius steps of 12, 20, and 28 px, with 999 px for pill controls. Preserve screenshot aspect ratios. Project image pixels retain their original colors in both themes.

The 3D frame must use semantic surface color and respond to theme changes. Its contact depth should be believable without a bright outline around every object. Lighting values will be tuned against both palettes during Phase 5.

### Timing and movement

| Motion role | Default target | Limit or purpose |
| --- | --- | --- |
| Feedback | 140 ms | Range 120 to 180 ms |
| Menu and navigation | 220 ms | Range 180 to 260 ms |
| Quiet entrance | 400 ms | Range 320 to 480 ms; travel 4 to 6 px |
| Section entrance | 560 ms | Range 500 to 650 ms; travel no more than 16 px |
| Hero headline | 720 ms | Range 650 to 800 ms; one line mask |
| Page arrival | 420 ms | Range 350 to 450 ms; travel no more than 12 px |
| Theme colors | 180 ms | Start only on an intentional change, not initial theme resolution |
| Pointer spring | Stiffness 160 and damping 24 | Start from current values; tune settling without obvious bounce |
| Entrance easing | Cubic bezier 0.22, 1, 0.36, 1 | Retain current shared ease-out |
| Exit easing | Short ease-in | Exit faster than arrival |

Use transform and opacity for movement. Theme transitions affect a deliberate list of color properties. Do not apply transition: all to the page. Avoid animation that changes reading layout, repeats indefinitely, or blocks a link until it settles.

### Responsive and accessible behavior

Desktop pointer enhancement remains conditional on a fine pointer, hover support, a width of at least 1024 px, and unrestricted motion. Touch and narrower layouts use the static project composition with small action feedback. Keep the native pointer visible.

Device reduced motion takes precedence over the site's animation preference. In that mode, remove displacement, tilt, parallax, magnetic movement, cursor following, and scroll animation. Opening menus, theme changes, and success feedback happen immediately with the same state information.

Content and links remain readable before hydration or scene loading. Initial theme resolution happens before visible page paint in Phase 2. WebGL failures retain accessible project links. Offscreen and hidden-tab 3D work remains paused, with the existing demand renderer and maximum device-pixel ratio of 1.5 retained as starting constraints.

## Implementation handoff

| Phase | Concrete work derived from this specification |
| --- | --- |
| 2 Theme foundation | Add semantic tokens, independent theme preferences, early initialization, and accessible Light/Dark/System controls |
| 3 Complete theme coverage | Convert all sections, state styling, illustrations, secondary routes, and 3D materials |
| 4 Motion consolidation | Establish timing roles, remove nested movement conflicts, and consolidate CSS overrides |
| 5 Signature hero | Implement the opening sequence, composition, lighting, camera response, and matching fallback |
| 6 Section choreography | Apply the chapter, workflow, experience, reading, and contact sequences |
| 7 Navigation continuity | Refine menu and section transitions; validate optional shared-image transitions |
| 8 Verification | Check browser interaction, both build paths, accessibility, appearance, and frame performance |

Phase 8 should include light and dark review at 375, 768, 1024, and 1440 px widths, plus a narrow 320 px check. Cover the homepage, every case study, 404, open mobile menu, theme picker, keyboard focus, hover, copy success/error, reduced motion, and unavailable WebGL. Verify first paint, theme persistence, browser Back, and storage failure.

The chosen contrast pairs were checked for this Phase 1 document. The remaining palette combinations, rendered layouts, timings, and performance remain implementation acceptance work; they are not claimed as already tested.

## Phase 1 acceptance record

- The two themes have explicit canvas, surface, text, accent, and focus decisions.
- Each project has matching light and dark presentation colors.
- Navigation, controls, secondary routes, and the 3D fallback have defined theme treatments.
- The journey storyboard identifies triggers, sequence, travel limits, and static alternatives.
- The strongest motion is assigned to the hero and selected work; reading sections have quieter treatment.
- Typography, spacing, depth, timing, and interaction states share one set of rules.
- Overlapping animation responsibilities and the current ambiguous CSS tokens are identified.
- Subsequent implementation phases have concrete handoff tasks.
