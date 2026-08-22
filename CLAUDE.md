# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                    # install JS dependencies
npm run dev                    # start dev server (http://localhost:3000, auto-bumps to 3001 if busy)
npm run build                  # production build
npm start                      # run the production build (run `build` first)
npm run lint                   # ESLint
npx tsc --noEmit                # typecheck (no separate script in package.json — run directly)

npx prisma migrate dev         # apply/create migrations against dev.db
npx prisma generate             # regenerate the Prisma client after any schema.prisma change
npx prisma studio                # browse/edit the SQLite DB at http://localhost:5555

npm run ml:predict              # start the optional Python ML prediction service (port 5000)
```

There is no test suite in this repo (no Jest/Vitest/Playwright config, no `test` script). If asked to add tests, ask the user which framework they want before scaffolding one.

Only `npm run lint` and `npx tsc --noEmit` are available as static checks — run both after any non-trivial change.

## High-level architecture

Next.js 14 App Router + TypeScript, Prisma/SQLite, NextAuth v5 (beta), Tailwind. An optional Python/FastAPI sidecar provides ML-based screening predictions.

**Request flow:** browser → `src/middleware.ts` (delegates to `src/auth.config.ts`'s `authorized` callback for route protection) → an App Router page (Server Component, queries Prisma directly) or a Server Action in `src/app/actions/*.ts` for mutations. Two API routes exist outside this pattern: `src/app/api/chat/route.ts` (calls the Anthropic SDK) and `src/app/api/therapy-plans/route.ts`; NextAuth itself is mounted at `src/app/api/auth/[...nextauth]/route.ts`.

**Route protection is declared in two places that must be kept in sync:**
1. `src/auth.config.ts` — the `isDashboardPage` check in the `authorized` callback (edge middleware gate).
2. `src/components/layout/Navbar.tsx` — the path-prefix list that hides the public marketing nav on authenticated pages.

Both currently need to include: `/dashboard`, `/screening`, `/results`, `/chatbot`, `/monitoring`, `/therapy`, `/feedback`. Every protected page/server action also independently calls `auth()` and `redirect("/login")` itself — this is intentional defense in depth, not redundant, so don't remove those checks even if middleware coverage looks sufficient. When adding a new top-level authenticated route, update both lists.

**Data model** (`prisma/schema.prisma`): `User` → `Child[]` → `Screening[]` / `TherapyPlan[]` (→ `TherapySession[]`) / `ProgressReport[]`. `ChatMessage` belongs to `User` and optionally references a `Child` by id (no FK enforced on `childId`, just an optional string). All child-scoped tables cascade-delete with their parent `Child`.

**Screening scoring is dual-path** (`src/app/actions/screening.ts`): a rule-based score always computes first (`totalScore >= 7` → High, `>= 4` → Medium, else Low). The action then attempts a `fetch` to the ML service at `ML_API_URL` (default `http://localhost:5000/predict`); on success it overwrites `aiPrediction`/`confidence` and sets `mlModelUsed: true`, on any failure (including the service simply not running) it silently falls back to the rule-based estimate with `mlModelUsed: false`. The results page (`src/app/results/[screeningId]/page.tsx`) reads this flag to honestly label which one produced the shown number — never assume `confidence` came from the ML model without checking `mlModelUsed`.

**AI Doctor chatbot** (`src/app/api/chat/route.ts`): requires `ANTHROPIC_API_KEY`; without it the route returns a clear "not configured" JSON error rather than throwing. It loads the child's latest screening + up to 3 active therapy plans as system-prompt context when a `childId` is provided.

**ML service** (`ml/`): a separate FastAPI app (`ml/predict_api.py`) loading a scikit-learn model (`ml/autism_model.pkl`, trained by `ml/train_model.py` from `Autism-Child-Data.csv` at the repo root). It's entirely optional and decoupled from the Next.js process — start it with `npm run ml:predict` (uses the venv at `ml/venv`). Nothing in the Next.js app breaks if it's absent.

**Design system** (`src/app/globals.css`, `tailwind.config.ts`): semantic CSS-var tokens (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-secondary`, `bg-accent`) plus a custom `pine` color scale (deliberately not Tailwind's stock `emerald`) as the primary/growth color and `amber-*` as a secondary warm accent. `font-display` (Fraunces, a variable Google font) is reserved for marketing/hero/display headings only — dense functional UI (forms, dashboards, games) intentionally stays in the default `font-sans` (Inter). The shared `Button` primitive (`src/components/ui/button.tsx`) was deliberately sized up from the original shadcn defaults (`h-10` default, `h-11` for `lg`) for touch-friendliness — don't shrink it back down without a specific reason.

**Games** (`src/components/games/*`, `src/app/therapy/[childId]/games/*`): client components that play a short round-based game, then call the `submitInteractiveGameFeedbackAction` server action (`src/app/actions/therapy.ts`), which writes a `ProgressReport` with a JSON `milestones` blob (`{ source: "interactive_game", game, roundsCorrect, roundsTotal, feedbackAgent }`). The monitoring/feedback pages parse this JSON to render history — if you change the shape written here, update the parsing in `src/app/monitoring/page.tsx` and `src/app/feedback/[childId]/page.tsx` too.

## Common setup errors and fixes

- **"Port 3000 is in use"** — a previous `next dev` (or an orphaned `next-server` process) is still bound. `lsof -nP -iTCP:3000 -sTCP:LISTEN` to find the PID, then `kill -9 <pid>`. `pkill -f "next dev"` alone sometimes misses the underlying `next-server` process.
- **Prisma type errors after editing `schema.prisma`** (e.g. "Property 'x' does not exist on type ...") — the generated client is stale. Run `npx prisma generate` (and `npx prisma migrate dev` first if the schema change needs a new migration/table).
- **"Table does not exist" / P2021 errors at runtime** — migrations haven't been applied to `dev.db` yet. Run `npx prisma migrate dev`.
- **AI Doctor chatbot returns "not configured"** — `ANTHROPIC_API_KEY` is missing from `.env`. This is by design (no crash), not a bug. Env vars are only read at process start, so restart `npm run dev` after adding the key.
- **Screening results always show "Rule-based estimate," never "AI model prediction"** — the ML service isn't running (this is the graceful-fallback path, not an error). Start it with `npm run ml:predict` and confirm with `curl http://localhost:5000/health`.
- **`next/font` build error "Axes can only be defined for variable fonts"** — happens if `axes` and an explicit `weight` array are both passed to a variable Google font (e.g. Fraunces) in `next/font/google`. Only pass one or the other.
- **NextAuth throws at runtime about a missing secret** — `AUTH_SECRET` isn't set in `.env`. Generate one with `openssl rand -base64 32`.
- **Registering a fresh account or adding a child silently 500s** — almost always one of the two migration/generate issues above; check the terminal running `npm run dev` for the actual Prisma error rather than guessing from the browser.
