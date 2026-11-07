// Plain sitemap of every public page (states, counties, checklists included).
import type { APIRoute } from "astro";
import { states, counties } from "../lib/data";

export const GET: APIRoute = ({ site }) => {
  const paths = [
    "/", "/steps/", "/states/", "/tools/", "/worth-it/", "/demand-letter/", "/checklists/", "/checklists/general/",
    "/glossary/", "/about/", "/sources/", "/states/ca/counties/",
    ...states.map((s) => `/states/${s.slug}/`),
    ...states.map((s) => `/checklists/${s.slug}/`),
    ...counties.map((c) => `/states/ca/counties/${c.slug}/`),
  ];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
