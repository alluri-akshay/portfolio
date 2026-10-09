import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const stage = path.join(root, ".static-export");
const output = path.join(root, "out");
const origin = new URL(process.env.PORTFOLIO_SITE_URL || "https://apple-eta-liard.vercel.app").origin;
function cleanGenerated(target, name) {
  // Resolve and check every recursive cleanup before touching the filesystem.
  if (path.dirname(path.resolve(target)) !== root || path.basename(target) !== name) throw new Error("Unsafe export path");
  rmSync(target, { recursive: true, force: true });
}
cleanGenerated(stage, ".static-export");
mkdirSync(stage);
cpSync(path.join(root, "app"), path.join(stage, "app"), { recursive: true, filter: source => {
  const relative = path.relative(path.join(root, "app"), source).split(path.sep)[0];
  return !["robots.txt", "sitemap.xml", "chatgpt-auth.ts"].includes(relative);
} });
cpSync(path.join(root, "public"), path.join(stage, "public"), { recursive: true });
for (const name of ["package.json", "package-lock.json", "postcss.config.mjs", "tsconfig.json"]) cpSync(path.join(root, name), path.join(stage, name));
writeFileSync(path.join(stage, "next.config.mjs"), 'export default { output: "export", trailingSlash: true, images: { unoptimized: true } };\n');
const metadataPath = path.join(stage, "app/lib/metadata.ts");
const metadata = readFileSync(metadataPath, "utf8");
if (!metadata.includes("const requestHeaders = await headers();")) throw new Error("Metadata export adapter needs updating");
writeFileSync(metadataPath, metadata.replace('import { headers } from "next/headers";\n', "").replace("const requestHeaders = await headers();", "const requestHeaders = new Headers();"));
const projectsPath = path.join(stage, "app/projects/[slug]/page.tsx");
writeFileSync(projectsPath, readFileSync(projectsPath, "utf8") + '\nexport function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }\n');
const require = createRequire(import.meta.url);
const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), "build", stage, "--webpack"], {
  cwd: root, stdio: "inherit", env: { ...process.env, PORTFOLIO_SITE_URL: origin, NEXT_TELEMETRY_DISABLED: "1" },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const built = path.join(stage, "out");
for (const name of ["index.html", "projects/career-nexus/index.html", "projects/auto-auth/index.html", "projects/burger-hut/index.html", "Akshay-Alluri-Resume.pdf"]) {
  if (!existsSync(path.join(built, name))) throw new Error(`Missing export: ${name}`);
}
cleanGenerated(output, "out");
cpSync(built, output, { recursive: true });
writeFileSync(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
const routes = ["/", "/projects/career-nexus/", "/projects/auto-auth/", "/projects/burger-hut/"];
writeFileSync(path.join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${origin}${route}</loc></url>`).join("")}</urlset>`);
console.log(`\nUpload this folder to Vercel Drop: ${output}\nCanonical site URL: ${origin}`);
