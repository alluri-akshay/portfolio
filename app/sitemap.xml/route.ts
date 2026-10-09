import { projects } from "../content/portfolio";
import { siteOrigin } from "../lib/site-origin";

export function GET(request: Request) {
  const origin = siteOrigin(request.headers);
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const entries = ["/", ...projects.map((project) => `/projects/${project.slug}`)].map((path) => `<url><loc>${escape(`${origin}${path}`)}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
