// Fair Claim · static site.
// SITE_URL: the public address (used for canonical links, social previews and the sitemap).
// PUBLIC_INDEXABLE: "true" lets search engines index the site; anything else keeps it a quiet preview (noindex).
import { defineConfig } from "astro/config";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Review-only pages (redesign mockups, screenshot galleries) live in src/dev-pages and are added
// only to `astro dev` (or when INCLUDE_DEV_PAGES=1), so they never ship in the public build.
function devPages() {
  return {
    name: "fair-claim-dev-pages",
    hooks: {
      "astro:config:setup": ({ command, injectRoute }) => {
        if (command !== "dev" && process.env.INCLUDE_DEV_PAGES !== "1") return;
        const root = fileURLToPath(new URL("./src/dev-pages/", import.meta.url));
        const walk = (dir) =>
          readdirSync(dir).flatMap((f) => {
            const p = join(dir, f);
            return statSync(p).isDirectory() ? walk(p) : p.endsWith(".astro") ? [p] : [];
          });
        for (const file of walk(root)) {
          const rel = relative(root, file).replace(/\\/g, "/").replace(/\.astro$/, "");
          const pattern = "/" + rel.replace(/(^|\/)index$/, "");
          injectRoute({ pattern, entrypoint: file });
        }
      },
    },
  };
}

export default defineConfig({
  site: process.env.SITE_URL || "https://fair-claim-706.pages.dev",
  trailingSlash: "always",
  build: { format: "directory" },
  output: "static",
  integrations: [devPages()],
});
