# Fair Claim design system ("Option A", 2026-11-06)

Multi-color tiles on a quiet page. Near-black in dark, warm off-white in light. The theme follows the
device by default. Nima approved mockup Option A (`/mockups/a/`) with three changes: a re-tuned
"warm + cool" palette, much less text, and theme by device with a Light / Dark / Auto switch.

- **Styles:** `site/src/styles/global.css` (tokens first, then components, numbered by section).
  `features.css` holds charts, the tile map, stat tiles, the glossary popover and checklists, on the same tokens.
  `legacy.css` holds old page blocks (see "Rebuild status" below); delete rules from it as pages are rebuilt.
- **Layout:** `site/src/layouts/Site.astro`: prototype line, header + nav + mobile menu, theme switch, footer,
  theme script, tabs script. Props: `title`, `description`, `bleed` (page manages its own `.wrap`s),
  `color` (a color slot for the section, e.g. `c-states`).
- **Components:** `site/src/components/`: `ThemeSwitch`, `ToolNotice`, `Breadcrumb`, `SideMenu`, `Cite`,
  `TableFilter`, `UnverifiedNote`, `Term`, `StatTile`, `ChartFrame` (+ `Chart*`, `TileMapLimits`).
  `DisplaySettings` is deprecated and renders nothing.
- **Mockups** stay at `/mockups/a/…` and `/mockups/b/…` for reference (self-contained CSS, untouched).

## Palette

Five tile hues, the same in both themes. They're tuned to sit together: two strong (tomato, deep cobalt) and
three soft (lilac, sage, sand). Contrast is computed with the WCAG formula (body text needs 4.5:1).

| Token | Hex | Text on it (`--on-*`) | Contrast | Light-theme edge |
| --- | --- | --- | --- | --- |
| `--c-tomato` | `#f2583e` | ink `#111112` | 5.6:1 | none |
| `--c-cobalt` | `#2a4bd0` | white `#ffffff` | 7.0:1 | none |
| `--c-lilac` | `#c7b8f2` | ink `#111112` | 10.4:1 | hairline |
| `--c-sage` | `#a7d3b4` | ink `#111112` | 11.3:1 | hairline |
| `--c-sand` | `#ecd6aa` | ink `#111112` | 13.3:1 | hairline |

The soft hues are close to the light page (1.3 to 1.6:1). In light theme, filled lilac, sage and sand tiles
get a 1px inset hairline (`--tile-edge`) so their edge still shows.

**Fixed assignment.** Use the semantic slot class, not the raw hue, so the mapping stays in one place:

| Section | Slot class | Hue |
| --- | --- | --- |
| How it works (`/steps/`) | `.c-learn` | cobalt |
| State rules (`/states/…`) | `.c-states` | tomato |
| Tools hub, cost calculator | `.c-tools`, `.c-calculator` | sage |
| Demand letter | `.c-letter` | lilac |
| Checklists | `.c-checklists` | sand |
| Glossary | `.c-glossary` | lilac |
| About | `.c-about` | sand |

A slot sets `--t` (hue), `--on` (text on it) and `--edge`. Anything inside can use them: `.tile.fill`,
`.dot`, `.t-dot`, `.s-bar`, `.progress .seg.now`, `.btn.color`, `.notice`, `.highlight`, `.mark`.
Raw slots (`.c-tomato`, `.c-cobalt`, `.c-lilac`, `.c-sage`, `.c-sand`) exist for in-page choices, such as
answer tiles. Inside one row, don't put two strong hues (tomato, cobalt) right next to each other unless the
order is the fixed landing order (cobalt, tomato, sage).

## Theme tokens

| Token | Light | Dark | Use / contrast |
| --- | --- | --- | --- |
| `--bg` | `#f3f2ee` | `#0b0b0c` | Page |
| `--bg-2` | `#fbfaf7` | `#121214` | Raised: tab panels, popovers, plain inputs |
| `--panel` | `#e7e6e0` | `#18181a` | Tiles, input panels, cards, dialogs |
| `--panel-2` / `--panel-hover` | `#dedcd5` / `#d8d7cf` | `#202023` / `#26262a` | Selected / hover |
| `--ink` | `#111112` | `#f2f1ec` | Text: 17.6:1 / 18.1:1 on bg |
| `--ink-2` | `#3c3c38` | `#bdbdb7` | Secondary: 9.9:1 / 10.4:1 |
| `--ink-3` | `#55554f` | `#96968f` | Labels, hints, cites: 6.7 / 6.6 on bg; ≥5.1 on `--panel-hover` |
| `--line` / `--line-2` | 11% / 22% ink | 9% / 18% white | Dividers (decorative) |
| `--line-strong` | `#76766f` | `#6a6a65` | Plain input borders: ≥3.3:1 (non-text) |
| `--sel-bg` / `--sel-ink` | ink / bg | ink / bg | Primary button, neutral selected tile |
| `--error-ink` | `#b3261e` | `#ff8a78` | Error text: 5.2+ / 7.7+ on panel |
| `--ok-ink` | `#1f6b3a` | `#8fd3a5` | Success text |
| `--focus` | ink | ink | 2px focus ring |
| `--paper*` | | | Letter preview, paper-colored in both themes |

Old token names (`--accent`, `--surface`, `--muted`, `--border`, `--text-sm`, `--font-body`, …) are kept as
aliases at the end of each token block so unrebuilt markup and `features.css` still work. New code should use
the names above. Links and the "accent" are ink; color comes from the tiles, not from text.

## Type

Inter Tight (display, weight 400, tight tracking), Geist Sans (body 17px / 1.65), Geist Mono (labels, cites).
All self-hosted via @fontsource; no third-party requests.

| Class / token | Size | Use |
| --- | --- | --- |
| `.display-xl` `--fs-display-xl` | 48–120px, lh 0.96, −0.045em | Landing headline only |
| `.display` / `h1` `--fs-display` | 42–84px, lh 1 | Page titles |
| `.h2` / `h2` | 30–52px | Section titles |
| `.h3` / `h3` | 23–30px | Sub-sections, card titles |
| `.h4` / `h4` | 21px | Small headings |
| `.lede` | 19–23px, `--ink-2`, 40ch | One sentence under a title |
| body | 17px | Running text, 66ch max (`.prose`) |
| `.small`, `.hint` | 15px | Secondary |
| `.lbl` | 12px mono caps, +0.06em | Kickers, column heads, metadata |
| `.cite` | 12px mono | Sources + "checked" dates |
| `.num` | display font, tabular | Big figures |

Bare `h1`–`h4`, `p` and lists get zero-specificity defaults (`:where`), so any class overrides them. Any `ul`/`ol`
with a class loses bullets and padding.

**Writing:** short sentences, one idea each. Lead with the answer; put detail in accordions or tabs
(progressive disclosure). The landing page headline is exactly "Small claims, explained."

## Layout

`.wrap` (max 1440px, side padding `--pad` 20–56px) · `.page` (top padding for non-bleed pages) · `.page-hero` ·
`.section` (64–128px top) · `.sec-head` (3/9 split: `.lbl` left, title + `.lede` right) · `.grid-12` · `.grid`,
`.grid.cols-2` · `.two-col` · `.with-sidemenu` · `.rule` · `.stack`, `.cluster`. Stacks to one column under 860px.

## Components (class names)

- **Header** `.hdr` > `.hdr-in` > `.brand` + `.menu-btn` + `.hdr-menu` (`.nav` + `.theme-switch`). Nav: How it works ·
  State rules · Tools (`/tools/` hub) · Glossary · About. Current item: `aria-current="page"` (Tools is current on
  `/tools/`, `/worth-it/`, `/demand-letter/`, `/checklists/`). Under 900px the nav and theme switch move behind a
  **Menu** disclosure button (`aria-expanded`, `aria-controls`; Escape and outside-click close it; focus returns).
  Without JavaScript the nav just wraps under the brand.
- **Theme switch** `ThemeSwitch.astro`: radios Light / Dark / Auto in a pill. Auto (default) follows
  `prefers-color-scheme` live. Saved as `localStorage["fc-theme"]` (try/catch); applied before first paint by the
  head script. `?theme=light|dark|auto` overrides for one view (screenshots), not saved.
- **Footer** `.ftr`: `.ftr-grid` (about + Learn / Tools / Project), `.ftr-base` (checked date, independence line),
  `.ftr-word` (the big "Fair Claim" wordmark, decorative, `aria-hidden`). Carries "Legal information, not legal advice"
  and the no-tracking promise. "How we check" (`/sources/`) is here.
- **Prototype line** `.proto-line`: slim mono line above the header.
- **Tiles** `.tiles` > `.tile` (+ slot class). Parts: `.t-top`, `.key` (circled letter), `.t-dot`, `.t-label`, `.t-sub`,
  `.check`. Selected = `aria-pressed="true"`, `aria-selected="true"`, `aria-checked="true"`, `.is-on`, or a checked
  `<input>` directly inside a `<label class="tile">`. `.tile.fill` = always filled.
- **Doors** `.doors` > `a.tile.fill.door.c-*` with `.door-body` (`.door-title`, `.door-text`) and `.door-foot`
  (`.door-arrow`). Used on `/` and `/tools/`.
- **Cards** `.card` (panel), `.card.raised`, `.card-link` (whole card is a link; arrow bottom-right; `.go` label).
- **Notice card** `.notice` (+ `.n-icon`, `ol` / `.n-list` numbered in mono, `.n-actions`); `.note-strip` for a one-line
  "please note" above a tool. `ToolNotice.astro` is the dialog version (`dialog.modal.tool-notice`).
- **Callouts** `.callout` (+ `.info` cobalt, `.success` sage, `.warning` sand, `.error`, `.quiet`), `.callout-title`;
  `.highlight` (bar only); `.mark` (marker under words).
- **Buttons** `.btn` (ink pill, 52px), `.btn.ghost` (= `.secondary`, `.tertiary`), `.btn.color` (with a slot),
  `.btn.sm` (= `.small`, 40px), `.link-button`, `.kbd`, `.go` (arrow link).
- **Chips / tags** `.chip` / `.tag` (+ `aria-pressed`, `.d` dot), `.tags` row.
- **Badges** `.badge` + `.unverified` / `.warning` (sand), `.verified` / `.success` (sage), `.info` / `.new` (cobalt),
  `.error`. Mono caps.
- **Cite** `.cite` (mono, quiet links), `Cite.astro`.
- **Accordion** `details.acc` > `summary` (+ optional `.pm`) + `.acc-body`. Old `.accordion` / `.accordion-body` and the
  `.accordions` wrapper still work. The +/− mark only changes its line, no rotation.
- **Tabs** `[data-tabs]` > `.tabs.tiles[role=tablist]` > `button.tile.tab[role=tab]` + `.tab-panel[role=tabpanel]`.
  Site.astro wires arrows / Home / End and `hidden` panels.
- **Progress** `.progress` > `.seg` (`.done` ink, `.now` slot hue).
- **Forms** `.fields` grid > `.field` input panel: label inside (`label` / `.f-label`, `.f-req`), big value, `.f-hint`,
  `.f-error`; error state `.field.has-error` or `aria-invalid="true"`. `.field.wide`, `.field.compact`, `.affix`
  (e.g. `$`), `.f-ok`. Plain inputs outside a panel get a bordered style. `.choice` rows, `legend`.
- **Tables** `.table-scroll` > `table` (mono column heads, hairlines, `.num` right-aligned). Add `.table-stack` +
  `data-label` on each `td` to stack rows under 720px. `.facts` > `.fact` (dt mono / dd).
- **Stat strip** `.stats` > `.stat.c-*` (`.s-bar`, `.num` / `.num.word`, `.s-label`, `.s-sub`, `.cite`). `StatTile.astro`
  (`.stat-tiles`) is the smaller list version.
- **Paper** `.paper` for the letter preview.
- **Dialogs** `dialog.modal` (`.modal-body`, `.modal-title`, sticky `.modal-footer`).
- **Breadcrumb** (mono caps, short rule separators), **SideMenu** (mono title, hairline list, dot on the current item),
  **TableFilter**, **UnverifiedNote** (sand-bar callout), **Term** popover (fade only), **ChartFrame** (top rule, display title).

## Motion

Short fades and color changes only: `--t-fast` 160ms, `--t-med` 240ms, `--ease` `cubic-bezier(0.2, 0, 0, 1)`.
No bounce, no overshoot, no springs, no scroll-triggered movement, no transforms on hover except the arrow
line lengthening on `.go`. Dialogs and the mobile menu fade in. Theme changes switch in one step (transitions
paused). `prefers-reduced-motion` turns everything off.

## Print

Header, footer, prototype line, buttons, dialogs and the theme switch are hidden. The palette is forced to black on
white, tiles and panels get a gray outline, and closed `<details>` print their contents.

## Rebuild status (for the page agents)

Done in the new system: `Site.astro`, `global.css`, `features.css` (tokens + chart frame, stat tile, term popover),
`/` (`pages/index.astro`), `/tools/` (`pages/tools/index.astro`), and the shared components listed above.

Still on old markup (render, but look partly unstyled; rebuild on Option A, then delete their rules from `legacy.css`):
- `pages/steps/index.astro` (How it works, `.c-learn`)
- `pages/states/index.astro` (State rules, `.c-states`). **Add a compact state picker here**: it moved off the home page.
- `pages/states/[slug]/index.astro`, `components/CaliforniaDetail.astro`, `pages/states/ca/counties/index.astro`,
  `pages/states/ca/counties/[county].astro`
- `pages/worth-it/index.astro` (`.c-calculator`), `pages/demand-letter/index.astro` (`.c-letter`)
- `pages/checklists/index.astro`, `general.astro`, `[slug].astro`, `components/ChecklistDoc.astro`, `ChecklistForms.astro` (`.c-checklists`)
- `pages/glossary/index.astro` (`.c-glossary`), `pages/about/index.astro` (`.c-about`; holds all the charts),
  `pages/sources/index.astro`, `pages/404.astro`
- `pages/design/index.astro` + `components/design/Samples.astro` (gallery still shows the old components)
