# core/ — reusable logic

These three files have **no dependencies on Astro, the browser, or this site's data**. They are plain
TypeScript functions, so they can be copied into (or later shared with) other "everyday legal help" tools,
such as the government letter decoder in `~/Projects/letter-decoder`.

| File | What it does |
| --- | --- |
| `deadlines.ts` | Date math for legal deadlines: calendar/business days, years, weekend roll-forward, "days left", limitation-period estimate. Time-zone safe. |
| `demand-letter.ts` | Builds a calm, factual demand letter from answers. Returns structured parts plus plain text. Stores and sends nothing. |
| `worth-it.ts` | The "is it worth it?" expected-value math, with warnings (over the limit, low collection odds, costs too high). |

Rules that keep them reusable:

- No legal numbers are hard-coded. Day counts, limits, fees and state-specific sentences come from cited data passed in by the caller.
- No storage, no network calls.
