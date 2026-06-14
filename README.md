# LifeLines

> See the time you still have with the people who matter.

A warm, hopeful app for visualizing remaining *shared* time — summers left with a parent, years before a child is grown — and turning that into intention, not dread. Web-first, built so the domain layer ports directly to a future Expo (React Native) app.

---

## Quickstart

Requires **Node 20+** and **pnpm 9** (`corepack enable` ships it with Node).

```bash
corepack enable          # if pnpm isn't already on your PATH
pnpm install
pnpm dev                 # http://localhost:3000
```

Other scripts (run from repo root):

```bash
pnpm build               # builds @lifelines/core then @lifelines/web
pnpm start               # serve the production build
pnpm lint                # next lint
pnpm typecheck           # tsc --noEmit across the workspace
```

It is **mobile-web first** — open it on a phone (or DevTools device mode). On a desktop it renders as a centered phone-width surface so you can preview the eventual app.

---

## Why a monorepo

The whole point of "scalable to mobile" is that the logic that decides *12 summers left with Dad* should never be rewritten for a second platform. So it lives in a standalone, **zero-dependency, DOM-free TypeScript package** that both web and native consume.

```
lifelines/
├─ packages/
│  └─ core/                  @lifelines/core — pure TS, NO React, NO platform deps
│     └─ src/
│        ├─ types.ts         Person, Milestone, Memory, AppData …
│        ├─ constants.ts     ADULT_AGE (the childhood window — not a death age)
│        ├─ calculations/    the engine: dates, moments, insights
│        ├─ storage/         StorageProvider interface + InMemory + LocalStorage
│        └─ data/seed.ts     first-launch sample household
└─ apps/
   └─ web/                   @lifelines/web — Next.js 15 App Router
      └─ src/
         ├─ app/             layout (fonts, viewport, theme-color), globals, page
         ├─ store/           Zustand store + persist (the web storage binding)
         ├─ lib/             cn(), icon maps (keeps core icon-free)
         ├─ components/ui/   primitives (Card, Sheet, Numeral, Avatar, …)
         ├─ components/      app-shell (responsive frame), tab-bar
         └─ features/        home · people · timeline · journal screens + sheets
```

### The seam that makes native cheap

Three boundaries are deliberate:

1. **`@lifelines/core` is platform-neutral.** No `window`, no React, no `import` of anything with a runtime. Drop it into an Expo app and every calculation, type, and the seed data work untouched.
2. **`StorageProvider` is an interface** (`packages/core/src/storage/provider.ts`). Web uses `LocalStorageStorage`; native implements the same three methods over `AsyncStorage`; Phase 2 swaps in `SupabaseStorage`. Nothing above the interface changes.
3. **The Zustand store is bound to storage by one factory.** In `store/useAppStore.ts`, `createJSONStorage(webStorage)` is the only web-specific line — native swaps it for `createJSONStorage(() => AsyncStorage)`. Same actions, same selectors, same components.

So an Expo build is: reuse `packages/core` as-is → reskin the `features/` and `components/ui/` with RN primitives → write one `AsyncStorage` adapter. The product logic does not get touched.

---

## Mobile-web details handled

- **`100dvh`** layout (not `100vh`) so it doesn't break under the iOS URL bar.
- **Safe-area insets** — the bottom tab bar pads with `env(safe-area-inset-bottom)` to clear the home indicator; `viewport-fit=cover` is set.
- **`theme-color`** + `apple-web-app` meta so it tints the status bar and feels installable.
- **Touch ergonomics** — 44px+ targets, `-webkit-tap-highlight-color: transparent`, `overscroll-contain` to kill rubber-banding, `text-size-adjust` locked.
- **Responsive shell** — full-bleed on phones, centered phone-frame on desktop.
- **No hydration flash** — first paint is gated on store rehydration to avoid an SSR/localStorage mismatch.

---

## What changed from the original spec (and why)

- **Removed the "Life Progress" bar and the timeline's "end-of-life marker."** A bar filling toward a death age is a death clock regardless of the copy around it — it contradicts the product's own "never morbid" rule. Replaced with the **shared window**: time you can share is bounded by the shorter of two lives; for children, by childhood (`18 − age`), not death. Same math, opposite feeling.
- **Curated the Moments engine** to low-frequency, resonant units (summers, trips, birthdays). Dropped weekends/days — counting weekends tips straight into the death-clock feeling.
- **No fake "147 memories."** A fresh install has none; ~4 sample moments are seeded so it feels alive without lying.
- **Trimmed the stack.** Dropped **TanStack Query** (no server in the MVP — add it with Supabase in Phase 2) and **Day.js** (kept `core` dependency-free with plain `Date` math, which is better for RN portability). Kept Zustand, React Hook Form, Zod.
- **`lifeExpectancy` is a rough, editable estimate** and is labeled as such in the UI — it only shapes framing, never appears as a countdown.

## Roadmap hooks already in place

- **Phase 2 (accounts + cloud):** implement `SupabaseStorage` against the existing `StorageProvider`; add TanStack Query for server state. UI unchanged.
- **Phase 5 (native):** add `apps/mobile` (Expo), depend on `@lifelines/core`, write the `AsyncStorage` adapter.

---

## Notes

- Forms use native `<input type="date">` for speed; production would swap a custom calendar popover (OS date pickers can't be styled).
- Fonts (Fraunces + Inter) are self-hosted via `next/font` — no external requests at runtime.
