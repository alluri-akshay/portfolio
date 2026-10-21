# Project section redesign

All three projects appear as consistent, vertically stacked rows. Career Nexus stays first. Each row contains a preview, category, brief summary, existing personal contribution, three technologies, and clearly labeled links. On narrow screens the preview sits above its details. No contribution claims or results were added.

The surrounding cards use neutral theme surfaces. Preview stages use restrained sage-grey, blue-grey, and warm-grey colors, with separate light and dark values. The repeated floating screenshot arrow was removed. The primary project link uses a right arrow; external links retain descriptive text. Hover depth is deliberately small and respects the existing motion preference.

References inspected:
- https://brittanychiang.com/ — compact project summaries and technology context.
- https://linear.app/ — product-led visual presentation and restrained surrounding UI.
- https://www.nngroup.com/articles/ux-design-portfolios/ — portfolio guidance about communicating the project and personal contribution. This is UX guidance, adapted here for a software developer portfolio.

## Auto Auth asset

Built-in image generation produced `public/projects/auto-auth-concept.png`. The image is labeled Concept illustration and the case-study caption and alt text explicitly distinguish it from a product screenshot. It shows the existing documented prefill, validation, and review workflow without real patient data, invented outcomes, or metrics. The original generated file is preserved.

### Generation prompt

Use case: ui-mockup. Asset type: landscape portfolio project cover, approximately 16:10.
Create a polished, restrained visual explanation of Auto Auth, a healthcare authorization form frontend. This is a CONCEPT illustration, not an authentic product screenshot.
Composition: one large straight-on white application panel centered on a very pale cool grey background, broad consistent margins. Crisp editorial software UI, precise typography, subtle realistic shadows, no perspective tilt. Navy charcoal text, muted blue accents, soft sage success indications. No purple, violet, lavender, neon, people, medical photos, or decorative 3D.
Panel header: simple outlined document icon, exact title "Auto Auth", smaller subtitle "Healthcare authorization".
Below: a three-step horizontal progress indicator with exact labels "Prefill", "Validate", "Submit", using modest numbers and thin connectors.
Main form: title "Authorization request". Two clean outlined fields with exact labels "Patient details" and "Request details". Their contents are neutral grey placeholder lines, NO real names or clinical data. Small pale sage pill "Prefilled" beside the first field. Small blue outlined check badge "Validated" beside the second.
Bottom right: a modest blue button with exact text "Review request". Bottom left: a subtle document/check icon.
Small caption beneath the application panel, exact text "Concept illustration". Keep all text large enough to read on a project card. No claims of approval, actual patient data, statistics, charts, sidebar, fake browser URL, giant logos, or watermarks. Professional and exceptionally clean with careful spacing.
