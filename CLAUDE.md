# CLAUDE.md — LifeLines

Context for Claude Code working in this repo. Read before making changes.

## What this is
A warm, hopeful app for visualizing the *time you have* — your own remaining
months, summers left with a parent, years before a child is grown — to drive
intention, not dread. Web-first, architected so the domain layer ports to a
future Expo (React Native) app untouched.

## The framing rule
Time is framed as warmth, not dread. The Home grid visualizes remaining time
for **everyone in the household — self included** — as a dot per month / day /
year. Render counts as plain keepsake numerals ("136 months still ahead",
"58 summers still yours"), never as "% of life elapsed" bars, progress sliders,
or explicit "days until you die" copy. Self's grid is bounded by their own
life expectancy; relatives by the shorter of their or your horizon; children
by their 18th birthday. Per-person windows, no single shared timeline.

## Stack & layout
pnpm workspace monorepo. Node 20+, pnpm 9 (`corepack enable`).
- `packages/core` — pure TypeScript domain: types, calculations, storage
  interface, seed data. **ZERO runtime deps, no DOM, no React.** This is the seam
  the native app reuses — keep it platform-neutral (no `window`; the localStorage
  binding goes through a guarded `globalThis`).
- `apps/web` — Next.js 15 App Router, React 19, Tailwind 3.4, Zustand (+persist),
  React Hook Form + Zod, Radix Dialog.

## Run / verify (keep these green)
    pnpm install
    pnpm dev          # http://localhost:3000
    pnpm build        # full build — must pass before committing
    pnpm typecheck

## Conventions
- Design tokens are CSS vars in `apps/web/src/app/globals.css`, mapped in
  `tailwind.config.ts` (canvas / ink-{2,3,4} / brand …). Use the token classes;
  per-person colors are dynamic data → inline style. Single brand accent
  (terracotta), warm palette, **no red**.
- Typography is **sans-only** (Inter, weights 400–900). Numerals are heavy
  (`font-extrabold` + `tabular-nums`) with tight letter-spacing — keepsake
  weight, never progress-bar weight. Use the `Numeral` component for all
  count rendering. Headlines: 34–40px, weight 800, `letter-spacing: -0.025em`.
- Surfaces are generous with whitespace: cards default to `p-5`, sunset
  headers use `pt-8 pb-8 px-6`, gaps between blocks are `gap-4`.
- Domain logic lives in `packages/core`, never in components. UI maps domain
  keys → icons in `apps/web/src/lib/icons.ts` so core stays icon-free.
- Persistence goes through `StorageProvider` (core). Web binding = Zustand
  persist + localStorage in `store/useAppStore.ts`. Don't hardcode storage in
  features.
- Mobile-web essentials already handled — `100dvh`, safe-area insets on the tab
  bar, `theme-color`, hydration gate. Don't regress them.

## Tabs & navigation
Two tabs only: **Home** (the dot grid) and **Moments** (the journal). The center
**+** opens an `AddMenu` bottom sheet with two choices: "Add a person" or
"Keep a moment". Tapping a person block on Home navigates to `PersonDetail`
(back button returns to the grid).

## Immediate tasks
1. **Push:** `git push -u origin main`
   (origin is already set to `git@github.com:kiatyingda/Life-line.git`).
   If rejected because the remote has a README commit:
   `git pull --rebase origin main` then push, or `git push -u origin main --force`.
2. **Deploy to Vercel:** import the repo → **Root Directory = `apps/web`** →
   framework auto-detects Next.js. No env vars. If prompted, enable
   "Include files outside the root directory in the build step".

## Likely next builds
- `apps/mobile` (Expo): depend on `@lifelines/core`, write an AsyncStorage
  adapter (implements `StorageProvider`), reskin `features/` with RN primitives.
- Phase 2: implement `SupabaseStorage` against `StorageProvider`; add accounts +
  TanStack Query for server state.

## Decisions already made — do not reintroduce
- Removed life-progress bars and percentage-elapsed markers. Numerals are
  keepsakes, never progress bars.
- Removed the Timeline tab (the strip-based "Lives, overlapping" view) AND
  the People tab. The Home dot grid is the only time visualization; person
  details reached by tapping a block.
- Dropped Fraunces serif entirely. Sans-only with heavy weights. The
  "keepsake" feel is now carried by font-weight + tabular-nums, not by serif
  characters.
- Renamed the Journal tab to **Moments** (consistent with the per-item
  "moment" copy used everywhere else).
- Moments curated to summers / trips / birthdays (no weekends/days — too
  granular, reads morbid).
- Dropped TanStack Query (no server yet) and Day.js (core stays dep-free).
- `lifeExpectancy` is a labeled rough estimate that shapes the grid window —
  shown as a keepsake count, never as an explicit countdown to death.
- Avatars are initials in the person's color (Fraunces serif). No emoji
  illustrations anywhere — use SVG (`Sunrise`) or lucide icons.
- Sunset gradient header is the shared visual signature across all tabs
  (`SunsetHeader` component).
