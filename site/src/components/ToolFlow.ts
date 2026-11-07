// Guided "one question at a time" flow for the tools (Option A). Browser-only, no dependencies.
//
// Markup (see ToolFlow.css):
//   <section class="fl-q" data-q="1" data-state="now" aria-labelledby="q1-t">
//     <div class="fl-q-head"><span class="fl-q-n">01 / 06</span><h2 class="fl-q-title" id="q1-t" tabindex="-1">…</h2></div>
//     <div class="fl-q-body"> …fieldset.fl-group[data-keys] > .tiles > label.tile > input[type=radio]… </div>
//     <div class="fl-q-foot"><button data-next>Continue</button></div>
//   </section>
//   Rail / progress (optional, anywhere in the page): [data-jump="k"], [data-seg="k"], [data-count].
//
// Behaviour
// - Answered questions stay open and editable; focusing or clicking one makes it current.
// - The question after the furthest answered shows its heading only ("next"); later ones are quieter still.
// - Continue / Enter validates the current question (optional callback), then opens the next one.
// - Letter keys pick an option in the focused question's tile group (A = first tile …). Never while typing.
// - A pointer tap on a tile in a [data-auto] group, on the furthest question, moves on by itself.
// - Keyboard moves focus straight to the next question's first control (no smooth scroll).
//   Pointer moves scroll the next question into view (smooth unless reduced motion) and focus its heading.

export type How = "key" | "pointer" | "silent";

export interface FlowOptions {
  root: HTMLElement;
  /** Number of question sections. A section with data-q = total + 1 (a result) may follow. */
  total: number;
  /** Return the first control that needs fixing in question k, or null when it's fine to go on. */
  validate?: (k: number) => HTMLElement | null;
  onStep?: (at: number, max: number) => void;
  countText?: (at: number, total: number) => string;
}

export interface Flow {
  goTo(k: number, how?: How): void;
  next(how?: How): void;
  open(k: number): void;
  readonly at: number;
  readonly max: number;
}

const TYPING = /^(text|search|email|tel|url|number|date|password)$/;
export const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function isTyping(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  if (el instanceof HTMLInputElement) return TYPING.test(el.type);
  return el.isContentEditable;
}

export function createFlow(o: FlowOptions): Flow {
  const { root, total } = o;
  const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-q]"));
  const byNum = (k: number) => sections.find((s) => Number(s.dataset.q) === k);
  let at = Number(sections.find((s) => s.dataset.state === "now")?.dataset.q) || 1;
  let max = at;
  const last = sections.some((s) => Number(s.dataset.q) === total + 1) ? total + 1 : total;

  function paint() {
    for (const s of sections) {
      const k = Number(s.dataset.q);
      if (k > total) continue; // result: always open
      s.dataset.state = k === at ? "now" : k <= max ? "done" : k === max + 1 ? "next" : "later";
    }
    document.querySelectorAll<HTMLElement>("[data-jump]").forEach((j) => {
      const k = Number(j.dataset.jump);
      j.dataset.state = k === at ? "now" : k <= max ? "done" : "todo";
      if (k === at) j.setAttribute("aria-current", "step");
      else j.removeAttribute("aria-current");
    });
    document.querySelectorAll<HTMLElement>("[data-seg]").forEach((g) => {
      const k = Number(g.dataset.seg);
      g.className = "seg" + (k === at ? " now" : k <= max ? " done" : "");
    });
    const count = at > total ? "All answered" : o.countText ? o.countText(at, total) : `Question ${at} of ${total}`;
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => (c.textContent = count));
    o.onStep?.(at, max);
  }

  function firstControl(s: HTMLElement): HTMLElement | null {
    const checked = s.querySelector<HTMLInputElement>(".fl-q-body input[type=radio]:checked");
    if (checked) return checked;
    return s.querySelector<HTMLElement>(
      ".fl-q-body :is(input:not([type=hidden]):not([disabled]), textarea, select, button:not([disabled]))",
    );
  }

  function reveal(s: HTMLElement, how: How) {
    if (how === "silent") return;
    if (how === "key") {
      // Keyboard: no animated scroll. Jump the question into view and focus its first control.
      s.scrollIntoView({ block: "start", behavior: "auto" });
      const c = s.dataset.q && Number(s.dataset.q) > total ? null : firstControl(s);
      (c ?? s.querySelector<HTMLElement>("[tabindex='-1']"))?.focus({ preventScroll: true });
    } else {
      s.scrollIntoView({ block: "start", behavior: reduceMotion() ? "auto" : "smooth" });
      s.querySelector<HTMLElement>(".fl-q-title, [tabindex='-1']")?.focus({ preventScroll: true });
    }
  }

  function goTo(k: number, how: How = "silent") {
    k = Math.max(1, Math.min(last, k));
    at = k;
    max = Math.max(max, Math.min(k, total));
    paint();
    const s = byNum(k);
    if (s) reveal(s, how);
  }

  function next(how: How = "pointer") {
    if (at <= total && o.validate) {
      const bad = o.validate(at);
      if (bad) {
        bad.focus();
        return;
      }
    }
    if (at >= last) return;
    goTo(at + 1, how);
  }

  // Focus or click inside a question makes it current (lets people go back and edit, or skip ahead).
  for (const s of sections) {
    const k = Number(s.dataset.q);
    if (k > total) continue;
    s.addEventListener("focusin", () => {
      if (k !== at) {
        at = k;
        max = Math.max(max, k);
        paint();
      }
    });
    s.querySelector(".fl-q-head")?.addEventListener("click", () => {
      if (s.dataset.state === "next" || s.dataset.state === "later") goTo(k, "pointer");
    });
  }

  // Continue buttons
  root.querySelectorAll<HTMLButtonElement>("[data-next]").forEach((b) =>
    b.addEventListener("click", (e) => {
      const k = Number(b.closest<HTMLElement>("[data-q]")?.dataset.q);
      if (k && k !== at) {
        at = k;
        paint();
      }
      next((e as MouseEvent).detail === 0 ? "key" : "pointer");
    }),
  );

  // Rail / index jumps
  document.querySelectorAll<HTMLElement>("[data-jump]").forEach((j) =>
    j.addEventListener("click", (e) => goTo(Number(j.dataset.jump), (e as MouseEvent).detail === 0 ? "key" : "pointer")),
  );

  // Keyboard: Enter continues; letters pick tiles.
  root.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
    const t = e.target as HTMLElement;
    const s = t.closest<HTMLElement>("[data-q]");
    if (!s || Number(s.dataset.q) > total) return;
    if (e.key === "Enter") {
      if (t instanceof HTMLTextAreaElement || t instanceof HTMLButtonElement || t instanceof HTMLAnchorElement) return;
      if (t.closest("[data-no-enter]")) return;
      if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement) {
        e.preventDefault();
        if (Number(s.dataset.q) !== at) {
          at = Number(s.dataset.q);
          paint();
        }
        next("key");
      }
      return;
    }
    if (e.key.length !== 1 || !/[a-z]/i.test(e.key) || e.shiftKey || isTyping(t)) return;
    const group = t.closest<HTMLElement>("[data-keys]") ?? s.querySelector<HTMLElement>("[data-keys]");
    if (!group) return;
    const radios = Array.from(group.querySelectorAll<HTMLInputElement>("input[type=radio]"));
    const r = radios[e.key.toLowerCase().charCodeAt(0) - 97];
    if (!r) return;
    e.preventDefault();
    if (!r.checked) r.click();
    r.focus();
  });

  // Pointer taps on [data-auto] groups move on by themselves, but only on the furthest question.
  let pointerAt = 0;
  root.addEventListener("pointerup", () => (pointerAt = Date.now()));
  root.querySelectorAll<HTMLElement>("[data-auto]").forEach((g) =>
    g.addEventListener("change", (e) => {
      const input = e.target as HTMLInputElement;
      if (input.type !== "radio" || input.dataset.noauto !== undefined) return;
      if (Date.now() - pointerAt > 600) return;
      const k = Number(g.closest<HTMLElement>("[data-q]")?.dataset.q);
      if (k !== at || k !== max || k >= total + 1) return;
      // Let the tile fill register before moving on.
      window.setTimeout(() => {
        if (at === k) next("pointer");
      }, 220);
    }),
  );

  paint();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("fl-ready")));
  return {
    goTo,
    next,
    open(k: number) {
      if (k > max) {
        max = Math.min(k, total);
      }
      at = k;
      paint();
    },
    get at() {
      return at;
    },
    get max() {
      return max;
    },
  };
}

/** Debounced polite announcer: speaks once typing pauses, never on page load. */
export function announcer(el: HTMLElement, wait = 900) {
  let timer: number | undefined;
  let last = "";
  let on = false;
  return {
    enable() {
      on = true;
    },
    say(text: string, now = false) {
      window.clearTimeout(timer);
      if (!on || text === last) return;
      const go = () => {
        last = text;
        el.textContent = text;
      };
      if (now) go();
      else timer = window.setTimeout(go, wait);
    },
  };
}

export interface PickerState {
  slug: string;
  name: string;
}

/**
 * State question: featured radio tiles + an "Another state" tile that opens a searchable list of all states.
 * Calls onChange(slug) ("" when skipped). Returns set(slug) to preselect.
 */
export function initStatePicker(
  box: HTMLElement,
  states: PickerState[],
  onChange: (slug: string) => void,
): { set(slug: string): void; get(): string } {
  const radios = Array.from(box.querySelectorAll<HTMLInputElement>("input[type=radio]"));
  const other = radios.find((r) => r.value === "other");
  const pick = box.querySelector<HTMLElement>("[data-pick]");
  const search = pick?.querySelector<HTMLInputElement>("input[type=search]");
  const list = pick?.querySelector<HTMLElement>("ul");
  const empty = pick?.querySelector<HTMLElement>(".p-empty");
  const count = pick?.querySelector<HTMLElement>("[data-pick-count]");
  const otherSub = box.querySelector<HTMLElement>("[data-other-sub]");
  const otherSubDefault = otherSub?.textContent ?? "";
  const buttons = Array.from(list?.querySelectorAll<HTMLButtonElement>("button[data-slug]") ?? []);
  let current = radios.find((r) => r.checked && r.value !== "other")?.value ?? "";
  const say = count ? announcer(count, 600) : null;
  say?.enable();

  const showPicker = (on: boolean) => {
    if (pick) pick.hidden = !on;
  };

  function mark(slug: string) {
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.slug === slug)));
    const featured = radios.find((r) => r.value === slug);
    if (otherSub) otherSub.textContent = !featured && slug ? states.find((s) => s.slug === slug)?.name ?? otherSubDefault : otherSubDefault;
  }

  function set(slug: string, fromList = false) {
    const featured = radios.find((r) => r.value === slug && r.value !== "other");
    if (featured) {
      featured.checked = true;
      if (!fromList) showPicker(false);
    } else if (slug && other) {
      other.checked = true;
      showPicker(true);
    }
    current = slug;
    mark(slug);
    onChange(slug);
  }

  radios.forEach((r) =>
    r.addEventListener("change", () => {
      if (!r.checked) return;
      if (r.value === "other") {
        showPicker(true);
        const featured = radios.some((x) => x.value === current);
        if (featured || !current) {
          // Nothing picked from the list yet: keep the last state until they choose.
          mark("");
        }
      } else {
        showPicker(false);
        current = r.value;
        mark(current);
        onChange(current);
      }
    }),
  );

  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let n = 0;
    for (const b of buttons) {
      const name = (b.textContent || "").toLowerCase();
      const abbr = (b.dataset.abbr || "").toLowerCase();
      const hit = !q || name.includes(q) || abbr === q;
      (b.parentElement as HTMLElement).hidden = !hit;
      if (hit) n++;
    }
    if (empty) empty.hidden = n > 0;
    say?.say(n === 0 ? "No states match." : n === 1 ? "1 state matches." : `${n} states match.`);
  });
  // Enter in the search box picks the first match.
  search?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    e.stopPropagation();
    const first = buttons.find((b) => !(b.parentElement as HTMLElement).hidden);
    if (first) {
      set(first.dataset.slug!, true);
      first.focus();
    }
  });
  buttons.forEach((b) => b.addEventListener("click", () => set(b.dataset.slug!, true)));

  return {
    set: (slug: string) => set(slug),
    get: () => current,
  };
}
