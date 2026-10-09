import { siteOrigin } from "../lib/site-origin";

export function GET(request: Request) {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${siteOrigin(request.headers)}/sitemap.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
