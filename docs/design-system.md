# Fair Claim design system ("Option A", 2026-11-06)

Multi-color tiles on a quiet page. Near-black in dark, warm off-white in light. The theme follows the
device by default. Nima approved mockup Option A (`/mockups/a/`) with three changes: a re-tuned
"warm + cool" palette, much less text, and theme by device with a Light / Dark / Auto switch.

- **Styles:** `site/src/styles/global.css` (tokens first, then components, numbered by section).
  `features.css` holds charts, the tile map, stat tiles, the glossary and checklists, on the same tokens.
  `states.css` holds the state-rules pages (`/states/`, state pages, CA counties, `/sources/`, 404); those pages
  import it. `components/ToolFlow.css` holds the guided tool flow. The old `legacy.css` is gone (2026-11-06):
  every page is on Option A.
- **Layout:** `site/src/layouts/Site.astro`: prototype line, header + nav + mobile menu, theme switch, footer,
  theme script, tabs script. Props: `title`, `description`, `bleed` (page manages its own `.wrap`s),
  `color` (a color slot for the section, e.g. `c-states`).
- **Components:** `site/src/components/`: `ThemeSwitch`, `ToolNotice`, `Breadcrumb`, `SideMenu`, `Cite`,
  `TableFilter`, `UnverifiedNote`, `Term`, `StatTile`, `ChartFrame` (+ `Chart*`, `TileMapLimits`), `ToolFlow`
  (`.ts` + `.css`), `ToolStatePicker`, `CaliforniaDetail`, `Checklist*`. (`DisplaySettings` and the old
  `design/Samples` were deleted; the `/design/` gallery uses `design/GallerySamples`.)
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
| `--ink-4` | `#6b6b64` | `#7c7c76` | Quietest text (upcoming tool questions): 4.8 / 4.7 on bg |
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
- **Tool flow** (`ToolFlow.ts` + `ToolFlow.css`, used by `/worth-it/` and `/demand-letter/`): one question at a
  time inside `.fl`. Each `section.fl-q[data-q]` has `data-state` `now` / `done` / `next` / `later`; answered
  questions stay open and editable, upcoming ones show only their heading (`next` in `--ink-3`, `later` in
  `--ink-4`, both ≥4.5:1). Parts: `.fl-q-head` (`.fl-q-n` "01 / 06", `.fl-q-title`), `.fl-q-body`, `.fl-q-foot`
  (Continue + Enter hint), side rail `.fl-rail` (`.fl-index` > `.fl-jump`, `.fl-mini` result), `.fl-dock` (sticky
  phone summary, pads for the home indicator), `.fl-toggles` (switch rows), `.fl-out` (read-only looked-up
  number). `createFlow({ root, total, validate, onStep })` wires Continue, Enter, letter keys (A = first tile) and
  auto-advance on pointer taps in `[data-auto]` groups. `announcer()` is a debounced polite live region.
- **ToolStatePicker** (`ToolStatePicker.astro` + `initStatePicker()` in `ToolFlow.ts`): featured states as lettered
  radio tiles, then "Another state", which opens `.fl-pick`, a searchable list of all 50 states + DC (Enter picks
  the first match).
- **Tables** `.table-scroll` > `table` (mono column heads, hairlines, `.num` right-aligned). Add `.table-stack` +
  `data-label` on each `td` to stack rows under 720px. `.facts` > `.fact` (dt mono / dd).
- **Stat strip** `.stats` > `.stat.c-*` (`.s-bar`, `.num` / `.num.word`, `.s-label`, `.s-sub`, `.cite`). `StatTile.astro`
  (`.stat-tiles`) is the smaller list version.
- **Paper** `.paper` for the letter preview.
- **Dialogs** `dialog.modal` (`.modal-body`, `.modal-title`, sticky `.modal-footer`).
- **Breadcrumb** (mono caps, short rule separators), **SideMenu** (mono title, hairline list, dot on the current item),
  **TableFilter**, **UnverifiedNote** (sand-bar callout), **Term** popover (fade only), **ChartFrame** (top rule, display title).

## Motion

Rules from Emil Kowalski's design-engineering skills (github.com/emilkowalski/skills: `emil-design-eng`,
`improve-animations`, `remove-animations`, `find-animation-opportunities`, `animate`, `choreograph`), applied
in the 2026-11-06 polish pass. Nima doesn't want bouncy or overshooting motion, so none is used anywhere.

| Token | Value | Use |
| --- | --- | --- |
| `--ease` (= `--ease-out`) | `cubic-bezier(0.23, 1, 0.32, 1)` | Everything. A strong ease-out: moves at once, settles softly, never overshoots |
| `--t-press` | 120ms | `:active` press feedback |
| `--t-fast` | 160ms | Hovers, color changes, the mobile menu, the "Another state" list, pointer tab switches, `.go` arrow |
| `--t-med` | 200ms | A tool question's body appearing, dialogs, the result bars, the dimmed tool |

- **Only `opacity`, `transform` and colors animate.** Never `width`/`height`/`top`/`margin`, never `transition: all`.
- **Transitions, not keyframes**, for anything that can be re-triggered (mobile menu uses `@starting-style`);
  only the modal dialog fade is a keyframe.
- **Press feedback:** `.btn:active` scale 0.97, link/button/label `.tile:active` 0.98, `.door:active` 0.99 (big
  surfaces need less), `.card-link:active` a color step. Fires on press, so taps feel immediate.
- **Hover is color only** and every `:hover` rule sits inside `@media (hover: hover) and (pointer: fine)`, so
  touch screens never get stuck hover states. Table rows change instantly (no fade: people sweep across them).
  The one hover movement is the `.go` arrow line, now a `scaleX` from the left instead of a width change.
- **Keyboard actions never animate.** Arrow-key tab switches swap instantly (`.tabs-fade` is set only for pointer
  clicks); a keyboard "Continue" or Enter in the tools opens the next question with no fade (`.fl-instant`) and
  jumps focus without smooth scrolling. Pointer hand-off: the next question scrolls into view (smooth) while its
  body fades in, one motion, no stagger.
- **No stagger, no scroll reveals, no count-ups, no chart draw-ins.** The calculator's two result bars move
  (`scaleX`, `--t-med`) only when the numbers change.
- **Theme changes** switch in one step (transitions paused by `.theme-switching`).
- **`prefers-reduced-motion: reduce`** turns all of it off: durations go to ~0, smooth scroll is off, and the
  press scale is removed.

## Mobile

From Emil Kowalski's `mobile-native` skill. Verified in device emulation; sticky hover, tap delay and safe areas
still need a check on a real phone.
- `viewport-fit=cover`; `.wrap` pads with `max(--pad, env(safe-area-inset-left/right))` so landscape content
  clears the notch; the header pads `env(safe-area-inset-top)`, the footer and the tools' `.fl-dock`
  `env(safe-area-inset-bottom)`. Zoom is never disabled.
- `-webkit-tap-highlight-color: transparent` on `html` (every control has its own `:active`/focus state).
- `touch-action: manipulation` on links, buttons, labels, summaries, tabs and tiles (no double-tap delay).
- `user-select: none` on controls only (buttons, summaries, tabs, tiles, `.btn`, chips), never on content.
- Every input, select and textarea is ≥16px, so iOS doesn't zoom on focus. Number fields use `inputmode`.
- `theme-color`: `#f3f2ee` (light) / `#0b0b0c` (dark), one meta per color scheme; the head script and
  `ThemeSwitch` pin both to the chosen theme so the browser chrome matches the page.
- `[hidden]` always wins (`display: none !important`), so filtered rows and closed panels stay hidden even
  where a component sets `display`.
- Long text: 1fr grid tracks are `minmax(0, 1fr)` so long words wrap instead of widening the page; `.cite` links
  break anywhere; chips wrap inside their pill. Stress-tested at 320px with long names, 67-character terms,
  $9,999,999.99 amounts and long letter text.

## Print

Header, footer, prototype line, buttons, dialogs and the theme switch are hidden. The palette is forced to black on
white, tiles and panels get a gray outline, and closed `<details>` print their contents.

## Rebuild status

All pages are on Option A (2026-11-06). `legacy.css` was emptied and deleted; its last live bits moved into
`global.css` (`[hidden]`) and the demand-letter page (the letter's Georgia face, `pre-wrap`, paper border).
The `/design/` gallery still shows some older component states.
