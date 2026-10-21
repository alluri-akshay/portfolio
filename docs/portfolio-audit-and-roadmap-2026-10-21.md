# Portfolio audit and phased experience plan

Reviewed 21 October 2026. This is an assessment and implementation proposal; application source has not been changed.

## Agreed direction

- Primary audience: recruiters and hiring teams.
- Target identity: software developer. Existing React and browser-automation experience remains the supporting specialty; this does not establish additional backend experience.
- Lead project: Career Nexus, confirmed by the owner as their strongest contribution.
- Preserve existing project descriptions, screenshots, demo links, and repository links. Add no new evidence, screenshots, recordings, metrics, or ownership claims.
- Reference: https://shadcnspace.com/animated-blocks.
- Desired experience: expressive motion and polished transitions that bring attention to the projects and make exploration easy.

## What the project actually is

This repository is Akshay Alluri's public portfolio. It presents three separate projects; it does not contain the implementation of Career Nexus, Auto Auth, or Burger Hut. Its core journey is home introduction → selected project → case study → resume/contact.

The homepage contains hero, technology strip, selected work, TaskLabs experience, about/skills, education/certifications, contact, and footer. Three project pages share a case-study template, with their own metadata and next-project navigation. There are also a 404, robots.txt, and sitemap.xml.

The installed stack is React 19.2.6, TypeScript 5.9.3, Next-compatible routing through Vinext 0.0.50/Vite 8.0.13, Tailwind 4.3.3, Motion 14.0.0, React Three Fiber 9.8.1, and Three.js 0.186.1. Most styling is custom CSS. Manrope is self-hosted. Content is a typed local module, not a CMS.

Cloudflare is the normal development/build adapter. VERCEL=1 selects Nitro's Vercel adapter. A separate static-export script stages a Next build. The database, D1 example, and ChatGPT authentication helper are optional starter infrastructure, unused by the public portfolio. There is no active contact submission backend; contact uses email links and clipboard copying.

## Review coverage and limits

Read the 43 files under app/, including every component, route, content module, library, and the 800-line stylesheet. Also read build configuration, worker/database/example code, scripts, tests, README, ignore rules, and historical Markdown reports. Inspected lockfile root dependency metadata rather than reading all 752 dependency entries. Inventoried the public assets and historical screenshots; sampled a historical hero image. Did not read third-party node_modules source exhaustively, Git objects, every historical image, or the resume PDF's contents. The accompanying inventory lists tracked files without implying every binary was visually reviewed.

Fresh browser inspection eventually reached the local homepage and Career Nexus page. Reviewed their desktop layout under the browser's existing dark/system and reduced-motion preferences. Observed a real hydration error on the initial homepage load. Full-motion timing, current mobile layouts, screen-reader behavior, production performance, and every route have not been freshly certified.

TypeScript and ESLint completed without diagnostics. All 9 theme tests passed. Both attempts at the 12 development HTTP regressions failed at fetch, rather than content assertions. A focused localhost probe returned EACCES. The browser nevertheless reached the server after slow startup. These connection failures are not evidence that all routes are broken. No production build or deployment was performed.

## What already elevates the experience

| Existing strength | Why it helps |
| --- | --- |
| Clear name, specialty, work and resume actions | Gives recruiters an immediate path into the portfolio |
| Real existing screenshots and direct project routes | Makes work concrete and shareable |
| Typed content separated from presentation | Allows consistent edits across home and case studies |
| Consistent light/dark semantic colors | Provides a coherent visual foundation |
| Lazy 3D hero with server-rendered fallback | Adds depth while retaining accessible links when enhancement is unavailable |
| Demand-driven rendering and offscreen/hidden-tab guards | Shows deliberate handling of decorative rendering cost |
| Central motion tokens and bounded transforms | Supports consistent choreography rather than independent effects |
| Skip link, focus handling, mobile menu, copy status | Makes the portfolio more usable beyond visual presentation |
| Case-study decisions and limitations | Communicates engineering considerations without invented quantitative outcomes |

Existing motion already covers clipped headline entrances, section reveals, project chapter progress, screenshot parallax, pointer tilt, moving surface light, magnetic button contents, a cursor follower, menu opening/closing, page arrivals, copy feedback, theme transitions, and a lazy 3D camera. Rebuilding these from a component gallery would duplicate substantial work.

## What is limiting it

| Priority | Finding and evidence | Proposed response |
| --- | --- | --- |
| First | Initial hydration differs under system reduced motion: browser error shows data-motion full → reduced and toggle Off → On | Make the first client render match SSR, then synchronize preferences; retain CSS protection before hydration. Add a browser regression for this exact condition |
| High | Hero places Burger Hut in front of Career Nexus; hero.tsx and hero-3d-scene.tsx assign the second image the foreground | Make Career Nexus the dominant panel in both static and 3D versions |
| High | Profile, metadata, and headline framing emphasize frontend developer; owner targets software developer | Update the role label and SEO consistently while keeping experience claims within existing facts |
| High | All three chapters use broadly similar scale and treatment | Give Career Nexus a larger, distinctive lead chapter and make the other two easier to scan |
| Medium | Seven case-study sections repeat contribution/features/engineering and reflection/next improvements | Reorganize existing prose into a clearer summary and reading hierarchy without adding claims |
| Medium | Hero slogan is polished but generic | Put the software-developer identity and existing specialty closer to the main visual message |
| Medium | Source contains page entrance animation, but no shared project-image navigation transition or explicit route loading UI | Prototype continuity with router/browser fallbacks; add waiting feedback only where an actual wait exists |
| Medium | globals.css repeatedly overrides earlier project, cursor, depth, and breakpoint rules | Consolidate by component/state before adding more choreography |
| Medium | Static export unconditionally copies missing postcss.config.mjs | Repair or retire that path after selecting the intended deployment method; do not promise that export currently works |
| Medium | README points to missing design-qa.md; historical docs describe superseded tokens/layouts and old test counts | Create a current status source and clearly label historical reports |
| Lower | PointerHighlight has no application usage; several starter SVGs and hero-showcase.png are not referenced by app source | Confirm usage before later cleanup |
| Unmeasured | Prior reports mention large bundle warnings; current images use unoptimized | Measure current production transfer/render cost before changing adapters or image strategy |

The existing project visuals show public landing pages; they do not demonstrate every dashboard or form interaction described. The owner has chosen to keep existing evidence only. The plan therefore improves presentation of that material and does not require more evidence collection. Existing claims remain existing claims, not newly verified facts.

## Reference interpretation

The supplied [Shadcn Space gallery](https://shadcnspace.com/animated-blocks) is an inspiration and implementation catalog, not an accessibility standard. Opened its [Creative Agency Hero 26 detail](https://shadcnspace.com/animated-blocks/creative-agency-hero-section-26) and [live preview](https://shadcnspace.com/preview/hero-26). The loaded preview uses oversized type, a dark canvas, atmospheric color, sparse navigation, and separated supporting content. This is a useful reference for composition and visual hierarchy. Full motion was not benchmarked under unrestricted motion.

For this portfolio, adapt the bold typographic presence and deliberate spacing while keeping the developer role, Career Nexus, and resume immediately discoverable. Use the existing product screenshot as the principal visual. An enormous brand word filling the viewport would push hiring information down unnecessarily. The detail's Show Code control led toward pricing; no paid source was obtained or copied. Other listed shader/cinematic/cursor blocks are candidates, not individually verified implementations.

## Phases and concrete subphases

### Phase 1 — Reliable baseline

1.1 Reproduce and fix system-reduced-motion hydration in motion-preferences.tsx and affected consumers. Test first load, reload, stored preference, and browser navigation.

1.2 Establish a reachable preview and rerun the existing HTTP regressions. Separate development startup cost from production performance.

1.3 Confirm the deployment route, address the missing static-export input if that route is retained, and reconcile current documentation.

Acceptance: no hydration error in normal/reduced modes; existing route/content/theme checks pass; chosen build path is reproducible. This phase precedes richer motion.

### Phase 2 — Recruiter journey and hierarchy

2.1 Update identity to software developer across profile, hero, title, and social metadata. Keep React/browser automation as supported experience.

2.2 Establish a simple journey: identity → Career Nexus → supporting projects → experience/skills → resume/contact. Keep direct resume access in navigation and the hero.

2.3 Promote Career Nexus using scale, ordering, and clearer existing contribution copy. Retain all current project links and material.

Acceptance: a visitor can identify your role and strongest project without scrolling through secondary content; no new public claims are introduced.

### Phase 3 — Visual system and opening composition

3.1 Consolidate stylesheet overrides into clear tokens and component/state sections. Preserve both themes and stable layout dimensions.

3.2 Design one stronger hero: bold software-developer identity, short existing introduction, prominent Career Nexus panel, quieter supporting project, and two clear actions.

3.3 Refine chapter spacing, readable metadata, screenshot framing, and contrast. Reduce competing depth on supporting skill/credential surfaces so projects remain visually dominant.

Acceptance: review desktop and mobile still layouts before animation tuning; no clipped headline, overflowing navigation, or screenshot obstruction.

### Phase 4 — Signature motion

4.1 Choreograph the opening around identity, headline, Career Nexus visual, and actions. Start with roughly 600–800 ms headline timing and 80–120 ms group stagger; these are tuning targets, not standards.

4.2 Reuse the current 3D renderer. Bring Career Nexus forward, give it a controlled entrance, and match the static fallback's framing to avoid a visual jump when the canvas becomes ready.

4.3 Coordinate project arrival: section label → main visual → summary/action. Keep chapter motion restrained while the visitor reads. A short sticky visual sequence can be prototyped only if it preserves native scrolling and works at short viewport heights.

4.4 Retune hover/focus/cursor feedback so each interaction has a clear primary cue. Keep stable click targets, immediately usable controls, and static touch/reduced-motion alternatives.

Acceptance: motion visibly directs attention to Career Nexus, does not delay clicking, and stops consuming frames once settled or offscreen. Validate actual recordings and frame traces, not still screenshots alone.

### Phase 5 — Navigation and genuine loading feedback

5.1 Prototype a Career Nexus preview-to-case-study image transition. Feature-detect the platform and validate Vinext routing; use the current simple page arrival if continuity cannot be reliable.

5.2 Preserve route focus, browser Back/Forward, deep links, anchor offsets, and modified-click/new-tab behavior.

5.3 Keep a stable poster while 3D loads. Add image/route pending feedback only for measured waits, with recovery if loading fails. Avoid a compulsory intro screen or artificial percentage counter.

Acceptance: fast paths remain instant, slow paths communicate real state, and navigation still works when enhancement fails.

### Phase 6 — Case-study exploration and closing action

6.1 Make the existing Career Nexus summary, personal contribution, technologies, and links easy to scan near the top.

6.2 Improve grouping of existing decisions and tradeoffs; reduce repeated presentation while retaining the existing factual content. Keep a calm reading surface and clear contents navigation.

6.3 Make resume/contact reachable from the end of the featured story as well as the main page. Keep Auto Auth's illustration explicitly labeled.

Acceptance: a recruiter can summarize your existing contribution and find the next action without having to read every section; no new evidence is requested or fabricated.

### Phase 7 — Verification and release readiness

7.1 Check 320, 375, 768, 1024, and 1440 px widths; light/dark/system themes; keyboard, touch, 200% zoom, and system/site reduced motion.

7.2 Test home, all projects, 404, menu, anchors, history, resume, copy success/failure, blocked storage, no JavaScript, and WebGL failure/context loss.

7.3 Run typecheck, lint, theme tests, HTTP tests, and the chosen production build. Measure production loading, responsiveness, layout shift, and animation frames.

7.4 Record fresh screenshots and motion captures, document residual limitations, and prepare the release. Publishing is a separate action from this plan.

Acceptance: no known navigation/hydration regressions; no horizontal overflow in sampled layouts; accessible alternatives remain complete; production performance meets an agreed budget. Aim for LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the 75th percentile when field data is available. Lab checks alone cannot certify field performance.

## Official guidance used

- [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot): matching initial server/client output is a correctness requirement; fix the observed mismatch rather than suppressing it.
- [Motion accessibility](https://motion.dev/docs/react-accessibility): adapt spatial effects to reduced-motion preferences. This informs the static experience and first-load test coverage.
- [web.dev animation performance](https://web.dev/articles/animations-guide): favor transform/opacity for movement and inspect rendering cost for other animated properties. Profile the existing changing cursor dimensions, shadows, and light gradients.
- [W3C pause/stop/hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide): applicable automatic moving content lasting more than five seconds needs a control. Avoid unnecessary continuous decorative loops.
- [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API): provides continuity between views; actual browser and router integration must be verified before committing to a shared-image transition.
- [web.dev Core Web Vitals](https://web.dev/articles/vitals): provides the performance targets above and distinguishes field measurement from lab diagnostics.

The design recommendations are an application of these principles to this repository, not a claim that one particular visual style is the universal best style for 2026.

## File responsibility map

| Files | Responsibility |
| --- | --- |
| app/page.tsx, layout.tsx, not-found.tsx | Home composition, document/providers, recovery page |
| app/projects/[slug]/page.tsx | Project lookup, per-project metadata, cyclic next project |
| app/robots.txt/route.ts, sitemap.xml/route.ts | Search crawl endpoints |
| app/content/portfolio.ts | All typed public profile/project/experience/credential content |
| app/globals.css | Themes, type, layout, components, responsive states, motion fallbacks |
| components/hero.tsx, hero-showcase.tsx, hero-3d-scene.tsx | Hero content, enhancement eligibility/fallback, canvas geometry/camera |
| components/project-card.tsx, project-chapter.tsx, project-workflow.tsx | Work list/actions, chapter progress, labeled Auto Auth illustration |
| components/case-study.tsx, case-study-contents.tsx | Case layout and active contents links |
| components/motion.tsx, motion-scene.tsx | Entrances, page arrivals, static hero wrappers, image parallax |
| components/motion-preferences.tsx, interaction-preferences.ts | Motion provider/toggle and eligible desktop interaction |
| components/use-surface-depth.ts, depth-surface.tsx, interactive-preview.tsx | Shared tilt/light behavior and framed surfaces |
| components/magnetic-content.tsx, cursor-feedback.tsx, pointer-highlight.tsx | Button content response, decorative pointer, unused highlight export |
| components/theme-preferences.tsx; lib/theme.ts | Theme controls, persisted/system state, early initialization |
| components/site-navigation.tsx, mobile-navigation.tsx, section-navigation.tsx | Header, collapsible menu, active section and reading progress |
| components/page-focus.tsx | Route-change heading focus and history guard |
| components/about.tsx, experience.tsx, credentials.tsx | Supporting profile, role, degree/certification sections |
| components/contact.tsx, copy-email.tsx, site-footer.tsx | Contact links, clipboard feedback, footer/motion preference |
| components/icons.tsx | Lucide exports inside a client boundary |
| lib/motion-tokens.ts, metadata.ts, site-origin.ts | Motion constants, metadata builder, public-origin resolution |
| app/chatgpt-auth.ts | Unused optional authentication helpers |
| build/sites-vite-plugin.ts | Build metadata/migration packaging; this build/ folder is source |
| worker/index.ts, worker-env.d.ts | Worker request/image handling and optional binding types |
| db/, drizzle/, drizzle.config.ts, examples/d1/ | Optional database setup, empty migration journal, example notes route/schema |
| scripts/export-static.mjs | Isolated Next static-export adaptation |
| tests/theme.test.mjs | Nine theme state/bootstrap tests |
| tests/rendered-html.test.mjs, dev-server.test.mjs | HTML/route/metadata regressions, production lazy-graph check, dev wrapper |
| package.json, package-lock.json | Scripts and pinned dependency graph |
| vite.config.ts, next.config.ts, vercel.json, tsconfig.json, eslint.config.mjs | Runtime/build/deploy/type/lint configuration |
| public/ | Resume, social preview, favicon, project images, starter SVGs |
| docs/ | Historical plans, reviews, screenshots, and this current audit |
| README.md, .gitignore | Usage guidance and repository exclusions |

Paths abbreviated with components/ or lib/ in this table are relative to app/. See portfolio-file-inventory-2026-10-21.txt for the full tracked path list.
