# CLAUDE.md — LifeLines

Context for Claude Code working in this repo. Read before making changes.

## What this is
A warm, hopeful app for visualizing the *remaining shared time* with people you
love — summers left with a parent, years before a child is grown — to drive
intention, not dread. Web-first, architected so the domain layer ports to a
future Expo (React Native) app untouched.

## The one rule that defines the product
NEVER frame time as a death countdown. No "% of life elapsed" bars, no
end-of-life markers. Time is the **shared window**: bounded by the shorter of two
lives; for a child, by childhood (age 18), not death. Say "12 summers left with
Dad", never "Dad is 86% through life". If a feature implies a death clock, it is
wrong — push back.

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
- Serif numerals (Fraunces) are the signature — counts rendered as keepsakes.
  UI text in Inter.
- Domain logic lives in `packages/core`, never in components. UI maps domain
  keys → icons in `apps/web/src/lib/icons.ts` so core stays icon-free.
- Persistence goes through `StorageProvider` (core). Web binding = Zustand
  persist + localStorage in `store/useAppStore.ts`. Don't hardcode storage in
  features.
- Mobile-web essentials already handled — `100dvh`, safe-area insets on the tab
  bar, `theme-color`, hydration gate. Don't regress them.

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
Removed life-progress bars / end-of-life markers (death-clock). Moments curated
to summers / trips / birthdays (no weekends/days — too granular, reads morbid).
Dropped TanStack Query (no server yet) and Day.js (core stays dep-free).
`lifeExpectancy` is a labeled rough estimate that only shapes framing — never a
visible countdown.
