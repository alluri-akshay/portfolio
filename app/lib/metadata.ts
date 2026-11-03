import type { Metadata } from "next";
import { headers } from "next/headers";
import { profile } from "../content/portfolio";
import { siteOrigin } from "./site-origin";

export async function pageMetadata(
  title: string,
  description: string,
  type: "website" | "article" = "website",
  path = "/",
): Promise<Metadata> {
  const requestHeaders = await headers();
  const origin = siteOrigin(requestHeaders);
  const image = `${origin}/og.png?v=2`;

  return {
    title,
    description,
    alternates: { canonical: `${origin}${path}` },
    icons: { icon: { url: "/favicon.svg?v=aa-1", type: "image/svg+xml", sizes: "any" } },
    openGraph: {
      title,
      description,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: `${profile.name} - Software Developer` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
