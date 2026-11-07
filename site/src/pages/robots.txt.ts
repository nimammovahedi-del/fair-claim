// robots.txt follows the launch switch: closed while the site is a preview, open once PUBLIC_INDEXABLE=true.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const open = import.meta.env.PUBLIC_INDEXABLE === "true";
  const body = open
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", site).href}\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
