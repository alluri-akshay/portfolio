# Akshay Alluri Portfolio

A public software developer portfolio highlighting React projects,
browser automation experience, education, certifications, and contact details.
The home page contains Career Nexus, Auto Auth, and Burger Hut, each with a
shareable project overview at `/projects/career-nexus`, `/projects/auto-auth`,
and `/projects/burger-hut`.

## Local development

Requires Node.js **22.13.0 or later** and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

The default preview is `http://localhost:3000/`. Use the URL printed by the
server if that port is occupied. Keep the terminal running while inspecting
the portfolio. The resume is served at `/Akshay-Alluri-Resume.pdf`.

## Checks against the running development server

```sh
npm run typecheck
npm run lint
npm run test:dev
```

`test:dev` runs ten regression tests against `http://localhost:3000/` and
does not build or load production output. Set `PORTFOLIO_TEST_URL` to use a
different running server. The checks cover portfolio content, navigation,
resume/contact links, metadata, project routes, not-found responses, canonicals,
robots, and the sitemap.
Browser layout, keyboard behavior, and downloads need browser verification in
addition to the HTML tests.

For a future production verification, `npm test` builds and runs the same
checks against the production worker. `npm run build` and `npm run start`
remain available for release work; routine development uses the checks above.

## Project structure

| Location | Responsibility |
| --- | --- |
| `app/page.tsx` | Home-page composition using shared sections |
| `app/content/portfolio.ts` | Typed profile, projects, experience, skills, and credentials |
| `app/components/` | Reusable navigation, footer, sections, cards, and project layout |
| `app/projects/[slug]/page.tsx` | Project lookup, metadata, and shareable overview routes |
| `app/not-found.tsx` | Recovery links for unknown pages/projects |
| `app/globals.css` | Palette, typography, layout, and responsive styles |
| `app/layout.tsx` | Document shell and social/search metadata |
| `app/lib/metadata.ts` | Shared home/project metadata with forwarded-origin images |
| `public/` | Resume PDF, social preview image, and static assets |
| `worker/index.ts` | Cloudflare worker and image optimization entry point |
| `worker-env.d.ts` | Optional project binding types |
| `vite.config.ts` | Vinext/Vite and Cloudflare development/build integration |
| `.openai/hosting.json` | Existing Sites project identity and optional bindings |
| `tests/` | Production rendered-HTML regression checks |
| `docs/` | Content evidence checklist and browser baseline |

React 19 and TypeScript run through Vinext's Next-compatible routing on Vite.
Tailwind CSS 4 is imported, while the current design primarily uses custom CSS.
Cloudflare runtime types come from the pinned `@cloudflare/workers-types`
development dependency.

## Optional starter infrastructure

The public page does not use a database or sign-in. `db/`, `drizzle/`, and
`examples/d1/` are retained optional database infrastructure; D1 and R2 bindings
are currently disabled. `app/chatgpt-auth.ts` contains optional authentication
helpers and is not used by the portfolio. Add database tables and run
`npm run db:generate` only if a later feature actually needs persistence.
Do not add authentication to public portfolio content.

## Content and design baseline

See [the content evidence checklist](docs/content-evidence-checklist.md) for the
information required before writing project case studies or publishing stronger
outcome claims. [The Phase 1 baseline](docs/phase-one-baseline.md) records the
technical fixes and browser observations.

All five implementation phases are now represented: a working baseline, typed
content and shared sections, a refined responsive home page, three case studies,
and motion/accessibility/SEO polish. Edit portfolio content in
`app/content/portfolio.ts`. Repository, demo, screenshot, and certificate
verification controls render only when supplied. Project screenshots for Career
Nexus and Burger Hut were captured from their public demos; Auto Auth uses its
public frontend documentation and the existing resume contribution details.
Unverified quantitative outcomes have been omitted.

The small client components own mobile navigation, email-copy feedback, section
entrances, and pointer-responsive hero tilt. Main content stays server-rendered.
Motion respects reduced-motion preferences and coarse pointers. Manrope is
self-hosted through Fontsource, icons use Lucide, and the existing favicon and
social graphic retain the portfolio branding.

`/robots.txt` and `/sitemap.xml` use the public request origin. Set
`PORTFOLIO_SITE_URL` to the final HTTPS origin to pin canonical/social/sitemap
URLs when deploying behind a proxy. The dev server needs to be restarted when
changing environment variables. Local development does not require this setting.

See [the final QA report](design-qa.md) for browser evidence and
remaining verification limits. Personal dates, certification verification,
Auto Auth demo imagery, and measured outcomes still need owner confirmation.

## Troubleshooting

- Keep `.openai/hosting.json` encoded as UTF-8 **without a byte-order mark**.
  A leading BOM caused the configuration bundler to fail with `JSON_PARSE`.
- If the process cannot spawn child processes (`EPERM`), run the development
  command in a shell that permits Vite and Cloudflare's local runtime to start.
- If Cloudflare types are missing, run `npm ci`; do not replace Worker APIs
  with untyped shims.
- Vite/Cloudflare local state is stored in `.vinext/` and `.wrangler/`; builds
  are written to `dist/`. These generated directories are not source files.

## Creative showcase refinement

The October 2026 refinement includes a fresh [Phase 1 audit](docs/creative-phase-one/README.md) and implemented [Phase 2 typography and layout](docs/creative-phase-two.md), with before/after screenshots and validation details.

[Phases 3 and 4](docs/creative-phase-three-four.md) add distinctive project chapters, a labeled workflow illustration, and richer motion with reduced-motion alternatives.

[Phase 5 content and cursor refinement](docs/creative-phase-five.md) explains the decisions, research, validation, and remaining evidence needs.
