# Fair Claim design system

One calm, accessible look for every page. Light is the default, and dark is a dim gray rather than black.
The live gallery is at **`/design/`**: every token and component, shown in light and dark side by side.

- **Styles:** `site/src/styles/global.css`. Tokens are at the top, then the components, numbered by section.
- **Layout:** `site/src/layouts/Site.astro` holds the header, main nav, footer, theme script and display settings.
- **Components:** `site/src/components/`
  - `Breadcrumb.astro`, `SideMenu.astro`, `ToolNotice.astro`, `DisplaySettings.astro`, `Cite.astro`
  - `design/Samples.astro` (gallery only)

## Where it comes from

Nima picked the French state design system (DSFR) as the inspiration. **Its terms reserve it for French
government sites**: the code, the Marianne typeface and the state's visual identity. So Fair Claim borrows its
*qualities*, never its assets.

**Borrowed in spirit**
- A calm white page with a crisp header: the service name plus a one-line tagline on the left, quick tools on the right.
- A horizontal main nav bar under the header. The current page gets an accent underline.
- One strong blue accent, used for links, primary buttons and focus.
- Generous spacing on an 8px grid, and a clear type scale.
- Cards with a full-card link and an arrow, plus an accent line along the bottom.
- Tags and badges, a breadcrumb, and callouts and highlights with a colored left bar.
- Accordions, a side menu on long pages, and a rich footer.
- A "Display settings" dialog with Light / Dark / System.
- A consent-style "please read" card before each tool.

**Deliberately not copied**
- No `@gouvfr/dsfr` package and no DSFR CSS, class names or icons. Every rule here was written from scratch.
- No Marianne font. We use **Public Sans** (open license) and **IBM Plex Mono**.
- No "bloc marque", no Marianne logo, no tricolor, and no "bleu France" `#000091`.
  - Our accent is **claim blue `#2b44ae`**: lighter and less saturated, with a slight violet lean.
- Our own logo mark: a simple balance scale in a rounded square.
- Our own shapes: 4px/8px corners where the DSFR is square, pill tags, and our own form-field style.

## Tokens

All tokens are CSS custom properties on `:root`. Dark values apply when `<html data-theme="dark">`. Any element
with `data-theme="light|dark"` re-themes its subtree (the gallery uses this).

### Color

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#23262c` | Page |
| `--surface` | `#f4f5f8` | `#2b2f36` | Tinted cards, bands, table headers |
| `--surface-2` | `#e9ebf1` | `#353a43` | Hover on surfaces |
| `--raised` | `#ffffff` | `#2b2f36` | Cards, dialogs |
| `--ink` | `#1b1d22` | `#eceef2` | Body text |
| `--ink-2` | `#3d424b` | `#ccd0d7` | Secondary text |
| `--muted` | `#5a606a` | `#a5abb5` | Hints, captions, citations |
| `--border` | `#d6d9e0` | `#3f444d` | Dividers (decorative) |
| `--border-strong` | `#858b96` | `#858c97` | Form-control borders |
| `--accent` | `#2b44ae` | `#a8b5ff` | Links, primary buttons, focus ring |
| `--accent-hover` / `--accent-active` | `#22388f` / `#1b2e78` | `#c0caff` / `#d3daff` | States |
| `--on-accent` | `#ffffff` | `#1a1d23` | Text on accent |
| `--accent-soft` / `--accent-soft-2` | `#eceffb` / `#dde3f8` | `#333a57` / `#3d4566` | Tags, chips, selected, hover |
| `--info-*`, `--success-*`, `--warning-*`, `--error-*` | `-bg`, `-ink`, `-border` each | | Callouts, badges, form errors |
| `--paper`, `--paper-ink` | | | Letter preview (stays paper-colored in both themes) |

Older names still work as aliases: `--rule`, `--rule-strong`, `--link`, `--warn-bg`, `--warn-ink`, `--warn-rule`,
`--ok`, `--bad`, `--accent-ink`. Don't use them in new code.

### Contrast (WCAG 2.2 AA)

The `/design/` page recomputes these at build time.

| Pair | Light | Dark |
| --- | --- | --- |
| Body text (`--ink` on `--bg`) | 16.9 | 13.1 |
| Hints (`--muted` on `--bg`) | 6.3 | 6.6 |
| Hints, worst case (`--muted` on `--surface-2`) | 5.3 | 4.9 |
| Links (`--accent` on `--bg`) | 8.3 | 7.7 |
| Primary button text | 8.3 | 8.6 |
| Tag text (`--accent` on `--accent-soft`) | 7.2 | 5.7 |
| Status text on status backgrounds | 6.5–7.8 | 7.3–8.7 |
| Input borders (non-text, needs 3:1) | 3.4 | 4.5 |

### Type

- **Fonts:** Public Sans Variable for everything; IBM Plex Mono for citations, dates and ledger figures.
- **Self-hosted** through `@fontsource-variable/public-sans` and `@fontsource/ibm-plex-mono`, imported at the top of `global.css`.
  - No Google Fonts, no third-party requests.

| Token | Size / line-height | Phones |
| --- | --- | --- |
| `--text-h1` | 40 / 48, weight 800 | 32 / 40 |
| `--text-h2` | 28 / 36, 700 | 24 / 32 |
| `--text-h3` | 22 / 28, 700 | 20 / 28 |
| `--text-lg` (h4, legends) | 18 / 28 | |
| `--text-xl` (`.lede`) | 20 / 32 | 18 / 28 |
| `--text-md` (body) | 16 / 24 | |
| `--text-sm` (`.hint`, nav, tables) | 14 / 24 | |
| `--text-xs` (`.cite`, badges) | 12 / 20 | |
| `--text-display` (`.stat`) | 56 / 64, 800 | 40 / 48 |

### Spacing, shape, layout

- **Spacing:** `--space-N` = N × 8px. Available: `--space-half` (4), `-1` (8), `-1h` (12), `-2` (16), `-3` (24), `-4` (32), `-5` (40), `-6` (48), `-8` (64), `-10` (80).
- **Corners:**
  - `--radius-sm` 4px: buttons, inputs, badges
  - `--radius` 8px: cards, tables, dialogs
  - `--radius-pill`: tags and chips
- **Colored bars:** `--bar-width` 4px.
- **Container:** `.wrap` (max 78rem, about 1248px) with `--gutter` of 16px on phones, 24px from 768px and 32px from 992px.
- **Reading width:** `.narrow` / `.prose` (46rem).
- **Breakpoints:** 30em (480px), 48em (768px), 62em (992px). The nav collapses below 62em.

## Components (class names)

| Component | Markup |
| --- | --- |
| Header + nav | Built into `Site.astro`. Nav items are in the `nav` array there. Under 62em the nav hides behind a **Menu** button (`aria-expanded`; Escape closes it). |
| Breadcrumb | `<Breadcrumb items={[{ href: "/states/", label: "States" }, { label: "California" }]} />`. "Home" is added for you. |
| Side menu | `<div class="with-sidemenu"><SideMenu title="On this page" items={[{href:"#id",label:"…"}]} /><div>…content…</div></div>`. It marks the section in view with `aria-current`. |
| Buttons | `.btn` (primary), `.btn.secondary` (outlined), `.btn.tertiary` (quiet gray outline), `.btn.ghost` (no border). Sizes: `.small`, `.large`, `.block`. Groups: `.btn-group` or `.actions`. Also `.link-button` (a button that looks like a link) and `a.link-arrow` (a link with a trailing arrow). |
| Cards | `.card` (white + hairline) and `.card.tinted` (gray, no border). Full-card link: `<a class="card card-link">…<h3>Title</h3><p>…</p><span class="go">Action</span></a>`, or `<div class="card card-link"><h3><a href>Title</a></h3>…</div>`. Optional `.card-detail` line above the title. Lay out with `.grid` or `.grid.cols-2`. |
| Tags | `.tag` (pill), `.tag.small`. Use `<button class="tag" aria-pressed="true">` for filters and wrap a list in `ul.tags`. |
| Badges | `.badge` plus `.info`, `.success` / `.verified`, `.warning` / `.unverified`, `.error`, `.new`. |
| Citation | `.cite` (mono, muted), or the `<Cite sources checked unverified />` component. |
| Callouts | `.callout` (neutral, accent bar) plus `.info`, `.success`, `.warning`, `.error`. Optional `<p class="callout-title">`. |
| Highlight | `.highlight`: a left bar only, for one key sentence. |
| Accordion | `<div class="accordions"><details class="accordion"><summary>Q</summary><div class="accordion-body">A</div></details>…</div>` |
| Forms | `.form-grid` > `.field` (`.field.full` spans the row). Use `<label>` (with an optional `<span class="hint">` inside) and native inputs; they are styled globally. Wrap a group in `fieldset` + `legend`. |
| Form errors | Add `.has-error` to the `.field`, `aria-invalid="true"` and `aria-describedby` to the input, and a `<p class="error-text" id>` message. Success messages use `.success-text`. |
| Choices | `<label class="choice"><input type="checkbox">Text</label>`. Rich radio cards: `.choice-cards` > `label.choice-card` (see the display settings). |
| Tables | Wrap in `.table-scroll`. Number columns get `.num`, dates get `.mono`, and `table.striped` is optional. **Responsive pattern:** `table.table-stack` with `data-label="Column"` on each `<td>`; under 768px each row becomes a block of "Label: value" lines. |
| Facts list | `dl.facts` > `div.fact` > `dt` + `dd` (`.big` for the headline value, `.value` for the text). |
| Dialog | `<dialog class="modal">` with `.modal-header`, `.modal-body` (`.modal-title`) and `.modal-footer`. The footer stays visible when a long dialog scrolls. |
| Display settings | Built in. Any element with `data-open-display-settings` opens it. |
| Tool notice | See below. |
| Text helpers | `.eyebrow`, `.lede`, `.hint`, `.small`, `.stat`, `.mono`, `.sr-only`, `.no-print`, `.print-only` |
| Layout helpers | `.wrap`, `.narrow`, `.prose`, `.two-col`, `.aside`, `.grid`, `.stack`, `.cluster`, `.band`, `.section` |
| Page blocks | Hero: `.hero`, `.hero-grid`, `.state-picker`. Steps: `.steps`, `.step-num`, `.step-meta`, `.strip`. Calculator: `.calc`, `.result`, `.verdict.good/.bad`, `.ledger`, `.range-row`, `.presets`, `.chip`. Letter: `.letter-wrap`, `.paper`, `.privacy`. |

### Tool notice ("please read" card)

```astro
<ToolNotice id="worth-it" target="worth-it-tool" toolName="the calculator" />
<div id="worth-it-tool">…the tool…</div>
```

**How it behaves**
- **Opening:**
  - `mode="onload"` (the default) opens a modal `<dialog>` on page load.
  - `mode="ondemand"` shows a "This tool is paused · Read the notice" bar instead. Use it when the tool is a small part of a long page.
- **Until "I understand":** the tool is `inert` and dimmed.
- **Escape or "Not now":** closes the notice without accepting. The paused bar stays, with a button to reopen it.
- **Focus:** on open, focus goes to the dialog title. After accepting, it moves to the tool's first control. After closing without accepting, it moves to the reopen button.
- **Remembered:** each tool's acceptance is stored in `localStorage` as `fc-notice-v1:<id>`. If storage is blocked, the notice shows on every visit.
  - To show a notice to everyone again after rewording it, bump `v1`.
  - `/design/` has a button that resets all notices on this device.
- **Content:** the props are `title`, `intro`, `points` (replaces the default list), `extraPoints` (adds to it), `readMoreHref` (default `/sources/#not-advice`; point it at the About page once that exists) and `readMoreLabel`.
- **Where it's used:**
  - `/worth-it/` (`worth-it`)
  - `/demand-letter/` (`demand-letter`, with letter-specific points)
  - the California page's "last day to sue" estimator (`ca-deadline`, on demand)

The demand letter also carries a neutral line at the foot of the PDF and the printed copy. It's the `PRINT_NOTE`
constant in `src/pages/demand-letter/index.astro`.

## Themes

- **Before first paint:** an inline script in `Site.astro` reads `localStorage["fc-theme"]` (`light` | `dark` | `system`; missing means light). It then sets `data-theme` and `data-theme-pref` on `<html>`, so the page never flashes.
- **Changing it:** `DisplaySettings.astro` saves the choice (inside try/catch) and applies it immediately.
  - With System, it follows the device's setting live.
- **During a switch,** transitions are paused for one frame, so everything changes together.
- **Print** always uses the light tokens, because the dark tokens are inside `@media screen`.

## Motion

- **What can move:** only color, background, border and opacity change. Nothing slides, scales, bounces or overshoots, and nothing moves on scroll.
- **Timing:**
  - `--dur-fast` 150ms: hovers
  - `--dur` 200ms: the dialog fade and the accordion chevron turn
- **Curve:** one only, `--ease-out` = `cubic-bezier(0.22, 0.61, 0.36, 1)`. It has no overshoot.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, all transitions and animations are effectively off.

## Print

Print hides the following:
- the header, nav, footer, prototype banner and side menu
- buttons, dialogs and tool gates, plus anything marked `.no-print`

`.print-only` elements appear. External links inside `.prose` print their URL. Cards, callouts and tables avoid
breaking across pages. The letter prints as plain paper.

## Rules of thumb for new pages

- Wrap the page in `<Site title description>`. Start with a `Breadcrumb` (except on the home page), then `.eyebrow`, `h1` and `.lede` inside `.narrow`.
- Use one primary button per view. Everything else is secondary, tertiary or a link.
- Mark unconfirmed facts with `.badge.unverified`, and put sources in `.cite`.
- Use tokens, never raw hex values. If a new color is needed, add a token in both themes and check its contrast.
- Keep the tone neutral. Nothing in the UI should nudge people toward suing.

## Feature components (added 2026-11-06)

Styles for these live in `site/src/styles/features.css`, which each component imports itself. They use the same
tokens as `global.css`, so they work in both themes.

| Component | What it is |
| --- | --- |
| `ChartFrame` | Wrapper for every chart: a title that states the takeaway, a source and checked date, an unverified tag, and an expandable data table |
| `TileMapLimits` | US tile map (one square per state + DC) colored by small claims limit; each square links to the state page |
| `ChartLimitChanges`, `ChartFees`, `ChartRules`, `ChartCollect`, `ChartPhilly` | Static HTML/SVG charts built from cited data; no chart library, no client JS |
| `StatTile` | A big number with its source |
| `Term` | Glossary word: a link to `/glossary/#slug` that also shows the definition on hover, keyboard focus or first tap (props documented in the file) |
| `ChecklistDoc`, `ChecklistForms` | Printable per-state checklists (`/checklists/{slug}/`) |
| `TableFilter` | Client-side filter box for the states and counties tables |
| `UnverifiedNote` | Explains "unverified" once per page |

Glossary data: `site/src/lib/glossary.ts`. Chart numbers: `site/src/lib/stats.ts` (derived from `src/data/*.json`) and `site/src/lib/odds.ts`.
