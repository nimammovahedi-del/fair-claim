// Location search for <LocationSearch />. Matching runs entirely in the browser: the search text is never sent
// anywhere. The lookup tables are static files on our own domain (site/public/geo/, built by
// scripts/build_places.py from U.S. Census Bureau files), fetched lazily the first time they're needed.
//
// A destination ("dest") is a state slug ("tx") or, in California, "ca/{county-slug}".

type Target = "states" | "checklists";
interface Names {
  s: [slug: string, name: string, abbr: string][];
  c: Record<string, string>; // CA county slug -> name ("alameda" -> "Alameda")
}
interface Hit {
  kind: "state" | "county" | "place" | "zip";
  name: string;
  dest: string;
  score: number; // lower is better
}
interface Option {
  url: string;
  name: string;
  sub: string;
  score: number;
}

const files = new Map<string, Promise<unknown>>();
function load<T>(name: string): Promise<T> {
  if (!files.has(name)) {
    const p = fetch(`/geo/${name}.json`, { credentials: "same-origin" }).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
    p.catch(() => files.delete(name)); // allow a retry later
    files.set(name, p);
  }
  return files.get(name) as Promise<T>;
}

/** Lowercase, no accents or punctuation, "Saint" = "St.", single spaces. */
export function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bsaint\b/g, "st")
    .trim();
}
const COUNTY_WORDS = /\s(county|parish|borough|census area|city and borough|municipality|city)$/;

// Normalized copies of the loaded lists, made once per file.
type Row = [name: string, dest: string, n: string, base: string];
const prepared = new Map<string, Row[]>();
async function rows(name: string): Promise<Row[]> {
  if (!prepared.has(name)) {
    const raw = await load<[string, string][]>(name);
    prepared.set(
      name,
      raw.map(([nm, d]) => {
        const n = norm(nm);
        return [nm, d, n, n.replace(COUNTY_WORDS, "")];
      }),
    );
  }
  return prepared.get(name)!;
}

export function initLocationSearch(form: HTMLFormElement) {
  if (form.dataset.ready) return;
  form.dataset.ready = "1";
  const names: Names = JSON.parse(form.dataset.names || '{"s":[],"c":{}}');
  const target = (form.dataset.target as Target) || "states";
  const stateHref = form.dataset.stateHref || "/states/#all-states";
  const input = form.querySelector<HTMLInputElement>("input[type=search]")!;
  const pop = form.querySelector<HTMLElement>("[data-pop]")!;
  const list = form.querySelector<HTMLUListElement>("[role=listbox]")!;
  const msg = form.querySelector<HTMLElement>("[data-msg]")!;
  const live = form.querySelector<HTMLElement>("[data-live]")!;

  const stateName = new Map(names.s.map(([slug, name]) => [slug, name]));
  const stateRows = names.s.map(([slug, name, abbr]) => ({ slug, name, n: norm(name), abbr: abbr.toLowerCase() }));
  const byAbbr = new Map(stateRows.map((s) => [s.abbr, s.slug]));
  const byStateName = new Map(stateRows.map((s) => [s.n, s.slug]));

  let options: Option[] = [];
  let active = -1;
  let seq = 0;
  let timer = 0;

  // ---- destinations
  const stOf = (dest: string) => dest.split("/")[0];
  function url(dest: string) {
    const [st, county] = dest.split("/");
    if (target === "checklists") return `/checklists/${st}/`;
    return county ? `/states/${st}/counties/${county}/` : `/states/${st}/`;
  }
  function where(dest: string) {
    const [st, county] = dest.split("/");
    const s = stateName.get(st) ?? st.toUpperCase();
    return county ? `${names.c[county] ?? county} County, ${s}` : s;
  }

  // ---- matching
  async function textHits(q: string): Promise<Hit[]> {
    const hits: Hit[] = [];
    const letter = q.replace(/[^a-z]/g, "")[0];
    const [counties, places] = await Promise.all([
      rows("counties"),
      letter ? rows(`places-${letter}`).catch(() => [] as Row[]) : Promise.resolve([] as Row[]),
    ]);
    for (const s of stateRows) {
      if (s.n === q || s.abbr === q) hits.push({ kind: "state", name: s.name, dest: s.slug, score: 0 });
      else if (s.n.startsWith(q)) hits.push({ kind: "state", name: s.name, dest: s.slug, score: 3 });
    }
    const qBase = q.replace(COUNTY_WORDS, "");
    for (const [nm, d, n, base] of counties) {
      if (n === q) hits.push({ kind: "county", name: nm, dest: d, score: 1 });
      else if (base === q || base === qBase) hits.push({ kind: "county", name: nm, dest: d, score: 2.2 });
      else if (n.startsWith(q)) hits.push({ kind: "county", name: nm, dest: d, score: 4 });
    }
    for (const [nm, ds, n] of places) {
      const score = n === q ? 2 : n.startsWith(q) ? 5 : -1;
      if (score < 0) continue;
      for (const d of ds.split(" ")) hits.push({ kind: "place", name: nm, dest: d, score });
    }
    return hits;
  }

  /** "Oakland, CA", "springfield illinois": the place part and the state slug, if the end names a state. */
  function splitState(q: string): [string, string] | null {
    const t = q.split(" ");
    if (t.length < 2) return null;
    for (const k of [1, 2]) {
      if (t.length <= k) break;
      const tail = t.slice(-k).join(" ");
      const slug = byStateName.get(tail) ?? (k === 1 ? byAbbr.get(tail) : undefined);
      if (slug) return [t.slice(0, -k).join(" "), slug];
    }
    return null;
  }

  async function search(raw: string): Promise<{ opts: Option[]; note?: string; exact: boolean }> {
    const trimmed = raw.trim();
    const digits = trimmed.replace(/\s/g, "");
    if (/^\d{1,4}$/.test(digits)) return { opts: [], note: "zip-short", exact: false };
    const zip = digits.match(/^(\d{5})(-?\d{4})?$/);
    if (zip) {
      const table = await load<Record<string, string>>(`zip-${zip[1][0]}`);
      const v = table[zip[1]];
      if (!v) return { opts: [], note: "zip-none", exact: false };
      return {
        opts: dedupe(v.split(" ").map((d) => ({ kind: "zip", name: `ZIP ${zip[1]}`, dest: d, score: 0 }) as Hit)),
        exact: true,
      };
    }
    const q = norm(trimmed);
    if (!q) return { opts: [], exact: false };
    let hits = await textHits(q);
    const split = splitState(q);
    if (split) {
      const [rest, st] = split;
      const scoped = (await textHits(rest)).filter((h) => stOf(h.dest) === st && h.kind !== "state");
      // Ranked just after an exact state name, so "West Virginia" still means the state.
      hits = hits.concat(scoped.map((h) => ({ ...h, score: h.score + 0.5 })));
    }
    hits.sort((a, b) => a.score - b.score);
    const opts = dedupe(hits);
    return { opts, exact: opts.length > 0 && opts[0].score <= 2.9 };
  }

  function dedupe(hits: Hit[]): Option[] {
    const seen = new Map<string, Option>();
    for (const h of hits) {
      const u = url(h.dest);
      if (seen.has(u)) continue;
      const sub =
        h.kind === "state"
          ? target === "checklists" ? "State checklists" : "State"
          : h.kind === "county" ? (stateName.get(stOf(h.dest)) ?? "") : where(h.dest);
      seen.set(u, { url: u, name: h.name, sub, score: h.score });
    }
    return [...seen.values()];
  }

  // ---- popup
  function open() {
    pop.hidden = false;
    input.setAttribute("aria-expanded", options.length ? "true" : "false");
  }
  function close() {
    pop.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }
  function setActive(i: number) {
    const items = list.children;
    if (active >= 0 && items[active]) items[active].setAttribute("aria-selected", "false");
    active = i;
    if (i < 0 || !items[i]) {
      input.removeAttribute("aria-activedescendant");
      return;
    }
    items[i].setAttribute("aria-selected", "true");
    input.setAttribute("aria-activedescendant", items[i].id);
    (items[i] as HTMLElement).scrollIntoView({ block: "nearest" });
  }
  function say(text: string) {
    live.textContent = "";
    window.setTimeout(() => (live.textContent = text), 50);
  }
  function setMessage(html: string) {
    msg.innerHTML = html;
    msg.hidden = !html;
  }
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  const pickLink = `<a href="${esc(stateHref)}">Pick your state</a>`;

  function render(opts: Option[], limit: number) {
    options = opts.slice(0, limit);
    active = -1;
    list.replaceChildren(
      ...options.map((o, i) => {
        const li = document.createElement("li");
        li.id = `${list.id}-${i}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", "false");
        const a = document.createElement("span");
        a.className = "loc-name";
        a.textContent = o.name;
        const b = document.createElement("span");
        b.className = "loc-sub";
        b.textContent = o.sub;
        li.append(a, b);
        return li;
      }),
    );
    list.hidden = options.length === 0;
  }

  function noteText(note: string | undefined, q: string) {
    if (note === "zip-short") return "Keep typing: a ZIP code has 5 digits.";
    if (note === "zip-none") return `No ZIP code ${esc(q.trim().slice(0, 5))} on file. Try your city, or ${pickLink.replace("Pick", "pick")}.`;
    return `Nothing matches “${esc(q.trim())}”. Check the spelling, or ${pickLink.replace("Pick", "pick")}.`;
  }

  // Live suggestions while typing.
  async function suggest() {
    const q = input.value;
    const my = ++seq;
    if (!q.trim()) {
      render([], 0);
      setMessage("");
      close();
      return;
    }
    let res;
    try {
      res = await search(q);
    } catch {
      if (my === seq) failed();
      return;
    }
    if (my !== seq) return;
    render(res.opts, 8);
    if (res.opts.length) {
      setMessage(res.opts.length > 8 ? `<span class="loc-more">${res.opts.length} matches. Keep typing to narrow it down.</span>` : "");
      open();
      say(`${res.opts.length} ${res.opts.length === 1 ? "match" : "matches"}. Use the up and down arrows to choose.`);
    } else if (res.note === "zip-short") {
      setMessage("");
      close();
    } else {
      setMessage(noteText(res.note, q));
      open();
      say(msg.textContent || "");
    }
  }

  function failed() {
    render([], 0);
    setMessage(`The search couldn't load. ${pickLink} instead.`);
    open();
    say(msg.textContent || "");
  }

  // Enter / Find: go straight to one clear match, otherwise show the choices.
  async function resolve() {
    window.clearTimeout(timer);
    const q = input.value;
    const my = ++seq;
    if (!q.trim()) {
      render([], 0);
      setMessage(`Type a ZIP code, city, county or state, or ${pickLink.replace("Pick", "pick")}.`);
      open();
      say(msg.textContent || "");
      return;
    }
    let res;
    try {
      res = await search(q);
    } catch {
      if (my === seq) failed();
      return;
    }
    if (my !== seq) return;
    let opts = res.opts;
    if (opts.length) {
      const best = opts[0].score;
      // An exact state name or abbreviation wins outright ("tx", "Texas").
      if (best === 0 && opts[0].sub.startsWith("State") && !/^ZIP/.test(opts[0].name)) return go(opts[0].url);
      // Otherwise keep only the best tier of matches: exact names before prefixes.
      const tier = res.exact ? opts.filter((o) => o.score <= 2.9) : opts;
      opts = tier;
      if (opts.length === 1) return go(opts[0].url);
      render(opts, 60);
      const what = /^ZIP/.test(opts[0].name) ? `ZIP ${q.trim().slice(0, 5)} crosses ${opts.length} areas` : `${opts.length} places match`;
      setMessage(`<strong>${esc(what)}.</strong> Choose one:`);
      open();
      say(`${what}. Use the up and down arrows to choose, then Enter.`);
      return;
    }
    if (res.note === "zip-short") {
      render([], 0);
      setMessage("A ZIP code has 5 digits.");
      open();
      say("A ZIP code has 5 digits.");
      return;
    }
    render([], 0);
    setMessage(noteText(res.note, q));
    open();
    say(msg.textContent || "");
  }

  function go(u: string) {
    close();
    location.href = u;
  }

  // ---- events
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (active >= 0 && options[active]) go(options[active].url);
    else resolve();
  });
  input.addEventListener("focus", () => {
    rows("counties").catch(() => {}); // warm the small county list
  });
  input.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(suggest, 140);
  });
  input.addEventListener("keydown", (e) => {
    const n = list.hidden ? 0 : options.length;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!n) {
        if (e.key === "ArrowDown" && input.value.trim()) {
          e.preventDefault();
          suggest();
        }
        return;
      }
      e.preventDefault();
      if (pop.hidden) open();
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive(active < 0 ? (d > 0 ? 0 : n - 1) : (active + d + n) % n);
    } else if (e.key === "Escape") {
      if (!pop.hidden) {
        e.preventDefault();
        close();
      }
    } else if (e.key === "Tab") {
      close();
    }
  });
  list.addEventListener("pointerdown", (e) => e.preventDefault()); // keep focus in the box
  list.addEventListener("click", (e) => {
    const li = (e.target as HTMLElement).closest("[role=option]");
    const i = li ? Array.prototype.indexOf.call(list.children, li) : -1;
    if (i >= 0 && options[i]) go(options[i].url);
  });
  form.addEventListener("focusout", (e) => {
    const to = e.relatedTarget as Node | null;
    if (!to || !form.contains(to)) close();
  });
  document.addEventListener("pointerdown", (e) => {
    if (!form.contains(e.target as Node)) close();
  });

  // Arrived here from a search sent before the script ran (or without it): finish the search.
  const action = new URL(form.action, location.href);
  const sent = new URLSearchParams(location.search).get("q");
  if (sent && action.pathname === location.pathname && !form.dataset.readOnce) {
    form.dataset.readOnce = "1";
    // Drop ?q= first, so Back from the result page doesn't land here and redirect again.
    const clean = new URL(location.href);
    clean.searchParams.delete("q");
    history.replaceState(history.state, "", clean);
    input.value = sent;
    input.focus({ preventScroll: true });
    resolve();
  }
}
