// Fair Claim · static site prototype (local only; nothing deployed).
import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  trailingSlash: "always",
  build: { format: "directory" },
  output: "static",
});
