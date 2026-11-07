# Publishing Fair Claim

**Where:** Nima's **fedmoney Cloudflare account**, the same one that hosts fedmoney.pages.dev. It deploys the same way: a private GitHub repo, with Cloudflare Pages rebuilding the site on every push.
**Not:** the CongressZ account, the brickvalue2 account, or the friend's Cloudflare token. This Mac is never signed into Cloudflare.

## What's already prepared (in the code)
- **Review-only pages stay out of the public build.** The mockups (`/mockups/`) and screenshot gallery (`/review/`) live in `site/src/dev-pages/` and only appear in `npm run dev`.
- **The launch switch is off.** `PUBLIC_INDEXABLE` isn't set, so every page has `noindex`, `robots.txt` blocks crawlers, and a slim "Early preview" line shows at the top. The site works for anyone with the link but won't show up in search.
- **Added:** `favicon.svg`, a social preview image (`og.png`), canonical links, `sitemap.xml` (172 pages), and `_headers`.
  - The headers set security rules (the site may only load its own files) and long caching for built assets.
- **Privacy:** no analytics, no cookies, no third-party requests. Fonts are served from the site itself.

## Steps

### 1. GitHub (Nima, about 2 minutes)
Create an **empty, private** repository on github.com under `nimammovahedi-del`, named e.g. `fair-claim`. Don't add a README, license or .gitignore. Then tell Claude the name.

### 2. Push the code (Claude, after Nima says go)
```bash
cd ~/Projects/small-claims
git remote add origin https://github.com/nimammovahedi-del/fair-claim.git
git push -u origin main
```
(Git on this Mac signs in through the macOS Keychain, as with the other projects.)

### 3. Cloudflare Pages (Nima, in the fedmoney account's dashboard, about 5 minutes)
1. **Workers & Pages → Create → Pages → Connect to Git**, then pick the `fair-claim` repo. Allow Cloudflare access to just that repo.
2. Project name: `fairclaim`. This gives `https://fairclaim.pages.dev`; if the name is taken, pick another and tell Claude.
3. Build settings:
   - Framework preset: **Astro**
   - Root directory: **`site`**
   - Build command: **`npm run build`**
   - Build output directory: **`dist`**
4. Environment variables (Production):
   - `NODE_VERSION` = `24`
   - `SITE_URL` = `https://fairclaim.pages.dev`, or the real address
   - Leave `PUBLIC_INDEXABLE` **unset** for the quiet preview.
5. **Save and Deploy.** The first build takes a couple of minutes.

### 4. Check the preview (Claude + Nima)
- Claude checks every page type and the robots/noindex settings on the live address.
- Nima opens it **on a real phone**. This is the one check that couldn't be done here.

### 5. Go public (later, when Nima says so)
In Cloudflare, set the environment variable `PUBLIC_INDEXABLE` = `true` and redeploy. That removes `noindex`, opens `robots.txt`, and changes the top line to "Free and neutral". Optionally add a custom domain then, and update `SITE_URL`.

## After launch: keeping it right
- **Upcoming changes (dated in STATUS.md):**
  - Georgia limit $25,000 (2027-01-01)
  - Wisconsin limit $15,000 (2027-01-01)
  - South Carolina fee $105 (2027-01-01)
  - Utah limit $25,000 (2030-01-01)
- **Yearly upkeep plan:** `docs/plan.md`.
- **How to make an update:** edit the research JSON, then run `scripts/build_tables.py`, commit and push. Cloudflare redeploys by itself.
