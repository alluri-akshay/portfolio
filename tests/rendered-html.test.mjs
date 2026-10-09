import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const devBaseUrl = process.env.PORTFOLIO_TEST_URL;
const worker = devBaseUrl ? undefined : (await import("../dist/server/index.js")).default;

async function render(path = "/", headers = {}) {
  if (devBaseUrl) {
    return fetch(new URL(path, devBaseUrl), { headers: { accept: "text/html", ...headers } });
  }
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", ...headers },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the portfolio and its hiring information", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="en"/);
  assert.match(html, /<title>Akshay Alluri \| Frontend Developer<\/title>/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const content of ["Akshay Alluri", "Career Nexus", "Auto Auth", "Burger Hut", "TaskLabs", "Pragati Engineering College"]) {
    assert.ok(html.includes(content), `Missing portfolio content: ${content}`);
  }
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
});

test("internal section links lead to rendered sections", async () => {
  const html = await (await render()).text();
  const targets = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const links = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(links.length > 0);
  for (const target of links) {
    assert.ok(targets.has(target), `Broken section link: #${target}`);
  }
});

test("hero provides screenshot links before the decorative scene loads", async () => {
  const html = await (await render()).text();
  assert.match(html, /class="heroEnhancement" data-scene="static"/);
  assert.match(html, /aria-label="Explore Career Nexus"/);
  assert.match(html, /aria-label="Explore Burger Hut"/);
  assert.doesNotMatch(html, /<canvas\b/);
  assert.doesNotMatch(html, /<link[^>]*rel="modulepreload"[^>]*hero-3d-scene/);
});

if (!devBaseUrl) test("3D renderer stays outside the hero's initial dependency graph", async () => {
  const manifest = JSON.parse(await readFile(new URL("../dist/client/.vite/manifest.json", import.meta.url), "utf8"));
  const sceneKey = "app/components/hero-3d-scene.tsx";
  const heroKey = "app/components/hero-showcase.tsx";
  assert.ok(manifest[heroKey].dynamicImports.includes(sceneKey));
  const visited = new Set();
  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    for (const dependency of manifest[key]?.imports ?? []) visit(dependency);
  }
  visit(heroKey);
  assert.ok(!visited.has(sceneKey), "3D renderer must not be an initial static dependency");
});

test("provides a real resume file and direct contact links", async () => {
  const html = await (await render()).text();
  assert.match(html, /<a[^>]*href="\/Akshay-Alluri-Resume\.pdf"[^>]*download/);
  const resume = await readFile(new URL("../public/Akshay-Alluri-Resume.pdf", import.meta.url));
  assert.equal(resume.subarray(0, 5).toString(), "%PDF-");
  assert.match(html, /href="mailto:alluriakshay878@gmail\.com"/);
  assert.doesNotMatch(html, /href="tel:/);
});

test("external links opened in a new tab include noreferrer", async () => {
  const html = await (await render()).text();
  const externalLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)];
  assert.ok(externalLinks.length >= 3);
  for (const [link] of externalLinks) {
    assert.match(link, /rel="[^"]*\bnoreferrer\b/);
  }
});

test("social preview uses the public forwarded origin", async () => {
  const html = await (await render("/", {
    "x-forwarded-host": "portfolio.example.com",
    "x-forwarded-proto": "https",
  })).text();
  assert.match(html, /property="og:image" content="https:\/\/portfolio\.example\.com\/og\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
});

test("unknown routes return a not-found response", async () => {
  assert.equal((await render("/missing-portfolio-page")).status, 404);
});

test("each project links to a directly accessible page with its own metadata", async () => {
  const homeHtml = await (await render()).text();
  const projectPages = [
    ["career-nexus", "Career Nexus"],
    ["auto-auth", "Auto Auth"],
    ["burger-hut", "Burger Hut"],
  ];
  for (const [slug, title] of projectPages) {
    assert.ok(homeHtml.includes(`href="/projects/${slug}"`));
    const response = await render(`/projects/${slug}`);
    assert.equal(response.status, 200, `Could not open ${slug}`);
    const html = await response.text();
    assert.ok(html.includes(`<title>${title} | Akshay Alluri</title>`));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(html.includes("My contribution"));
    assert.ok(html.includes('href="/#work"'));
    assert.ok(html.includes("Next project:"));
    assert.match(html, /property="og:image"/);
    assert.doesNotMatch(html, /href="(?:undefined|null|#)"/);
  }
});

test("unknown project slugs return 404 with recovery navigation", async () => {
  const response = await render("/projects/not-a-project");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.ok(html.includes("Page not found."));
  assert.ok(html.includes('href="/#work"'));
});

test("project section links resolve and canonical URLs match the requested page", async () => {
  for (const slug of ["career-nexus", "auto-auth", "burger-hut"]) {
    const html = await (await render(`/projects/${slug}`, { "x-forwarded-host": "portfolio.example.com", "x-forwarded-proto": "https" })).text();
    const targets = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    for (const [, target] of html.matchAll(/\bhref="#([^"]+)"/g)) {
      assert.ok(targets.has(target), `Broken project anchor: ${slug}#${target}`);
    }
    assert.ok(html.includes(`href="https://portfolio.example.com/projects/${slug}"`));
    assert.ok(html.includes('rel="canonical"'));
  }
});

test("robots and sitemap include the public home and project URLs", async () => {
  const headers = { "x-forwarded-host": "portfolio.example.com", "x-forwarded-proto": "https" };
  const sitemap = await render("/sitemap.xml", headers);
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /application\/xml/);
  const xml = await sitemap.text();
  assert.equal((xml.match(/<url>/g) ?? []).length, 4);
  for (const path of ["/", "/projects/career-nexus", "/projects/auto-auth", "/projects/burger-hut"]) {
    assert.ok(xml.includes(`<loc>https://portfolio.example.com${path}</loc>`));
  }
  const robots = await render("/robots.txt", headers);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/portfolio\.example\.com\/sitemap\.xml/);
});

test("theme initializes in the head and offers an accessible preference on every route", async () => {
  for (const path of ["/", "/projects/career-nexus", "/projects/auto-auth", "/projects/burger-hut", "/missing-portfolio-page"]) {
    const html = await (await render(path)).text();
    const initialization = html.match(/<script[^>]*id="portfolio-theme-init"[^>]*>([\s\S]*?)<\/script>/);
    assert.ok(initialization, "Missing theme initialization: " + path);
    assert.ok(html.indexOf(initialization[0]) < html.indexOf("</head>"), "Theme must initialize before body paint");
    assert.ok(initialization[1].includes("portfolio.theme"));
    assert.ok(html.includes("<legend") && html.includes("Color theme"), "Theme group requires a legend");
    const controls = [...html.matchAll(/<input\b[^>]*type="radio"[^>]*>/g)].map(match => match[0]);
    for (const choice of ["light", "dark", "system"]) {
      const control = controls.find(input => input.includes('value="' + choice + '"'));
      assert.ok(control, "Missing theme choice: " + choice + " on " + path);
      const id = control.match(/\bid="([^"]+)"/)[1];
      assert.ok(html.includes('for="' + id + '"'), "Each radio requires an associated label");
    }
  }
});
