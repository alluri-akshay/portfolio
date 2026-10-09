export function siteOrigin(requestHeaders: Pick<Headers, "get">): string {
  if (process.env.PORTFOLIO_SITE_URL) return new URL(process.env.PORTFOLIO_SITE_URL).origin;
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000").split(",")[0].trim();
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const forwarded = requestHeaders.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol = forwarded === "https" || forwarded === "http" ? forwarded : local ? "http" : "https";
  return new URL(`${protocol}://${host}`).origin;
}
