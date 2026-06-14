# Deploying LifeLines

No environment variables, no config — it's a fully client-side Next.js app
(localStorage only), so it deploys clean.

This folder is already a git repo with an initial commit on `main`.

## 1 · Push to GitHub

**Option A — GitHub CLI (creates the repo + pushes in one command):**
```bash
gh repo create lifelines --private --source=. --remote=origin --push
```

**Option B — manual:**
```bash
# create an EMPTY repo at https://github.com/new (no README/.gitignore), then:
git remote add origin https://github.com/<you>/lifelines.git
git push -u origin main
```

## 2 · Deploy to Vercel (dashboard — most reliable for this monorepo)

1. https://vercel.com/new → import the repo you just pushed.
2. **Root Directory → `apps/web`**  ← the one setting people miss in a monorepo.
3. Framework preset auto-detects as **Next.js**. If prompted, enable
   *"Include files outside the root directory in the build step"* — needed so the
   build can reach the `@lifelines/core` workspace package.
4. Click **Deploy**. You get a `*.vercel.app` URL in ~1 minute.

Every `git push` after that auto-deploys.

## CLI alternative
```bash
npm i -g vercel
cd apps/web && vercel        # set Root Directory to apps/web when prompted
```
The dashboard import handles the pnpm workspace more smoothly than the bare CLI.
