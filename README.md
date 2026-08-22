# Early Autism Screening & AI-Powered Child Monitoring

A full-stack web application for early autism screening, therapy tracking, and AI-powered developmental support for children aged 4–11.

## Features

- **Autism Screening** — 10-question M-CHAT-R/F-style screening with rule-based risk scoring, optionally backed by an ML prediction service
- **AI Doctor Chatbot** — Personalised assistant (Anthropic Claude) with full knowledge of the child's screenings, therapy plans, and progress
- **Therapy Management** — Create plans, log sessions, track improvement scores
- **Interactive Games** — Pattern recognition and emotion identification games, playable on screen, with results feeding into progress tracking
- **Progress Monitoring** — Charts tracking screening scores and therapy trends over time
- **Feedback Reports** — Progress snapshots per child, generated from therapy sessions and games

## Tech Stack

- **Frontend/Backend** — Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui-style components
- **Database** — SQLite via Prisma ORM (`better-sqlite3` driver)
- **Auth** — NextAuth v5 (credentials provider, bcrypt-hashed passwords)
- **AI** — Anthropic Claude API (`@anthropic-ai/sdk`)
- **ML** — Optional Python/FastAPI prediction service (falls back to rule-based scoring when not running)

## Setup

Requires Node.js 18+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required env vars (see `.env.example` for the full annotated list):
   - `AUTH_SECRET` — generate with `openssl rand -base64 32`
   - `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com). Without this, the AI Doctor chatbot responds with a clear "not configured" message instead of crashing — everything else in the app works fine without it.

   `DATABASE_URL` is set directly in `next.config.mjs` (points at the local `dev.db` SQLite file) and does not need to go in `.env`.

3. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   App runs at [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, Next.js will automatically try 3001 — check the terminal output for the actual URL.

## Available scripts

| Command               | What it does                                              |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Start the Next.js dev server                                |
| `npm run build`        | Production build                                            |
| `npm start`            | Run the production build (run `build` first)                |
| `npm run lint`         | Run ESLint                                                   |
| `npm run ml:predict`   | Start the optional Python ML prediction service (see below)  |

## Optional: ML prediction service

By default, autism risk prediction uses simple rule-based scoring (total questionnaire score ≥ 7 → High risk, ≥ 4 → Medium, else Low). If you want the ML-based prediction instead:

1. Create and activate a virtual environment, then install dependencies:

   ```bash
   cd ml
   python3 -m venv venv
   source venv/bin/activate      # Windows: venv\Scripts\activate
   pip install fastapi uvicorn joblib pandas scikit-learn
   cd ..
   ```

2. Start the service:

   ```bash
   npm run ml:predict
   ```

   This starts the FastAPI service on `http://localhost:5000` using the venv already checked into `ml/venv` (or the one you just created). Health check: `curl http://localhost:5000/health`.

3. Override the URL if needed by setting `ML_API_URL` in `.env` (defaults to `http://localhost:5000`).

If the ML service isn't running, screening requests fall back to rule-based scoring automatically and the results page honestly labels which one produced the result ("AI model prediction" vs "Rule-based estimate") — it never claims AI confidence it doesn't have.

`ml/train_model.py` was used to train the shipped `ml/autism_model.pkl` from `Autism-Child-Data.csv` (repo root) — re-run it if you want to retrain on different data.

## Viewing the database

To browse the SQLite database visually:

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555) — lets you view and edit all tables (Users, Children, Screenings, TherapyPlans, TherapySessions, ProgressReports, ChatMessages) directly in the browser.

## Project structure

```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Login / register (public)
    dashboard/            # Parent dashboard, child profiles, therapy management
    screening/[childId]/  # 10-question screening flow
    results/[screeningId]/
    therapy/[childId]/    # Activities page + games
      games/pattern/      # Pattern recognition game
      games/emotion/      # Emotion matching game
    monitoring/           # Charts + progress reports
    feedback/[childId]/   # Feedback/progress history
    chatbot/              # AI Doctor chat UI
    api/                  # Route handlers (chat, therapy-plans, NextAuth)
    actions/              # Server actions (auth, child, screening, therapy)
  components/             # Shared React components (ui/ = design-system primitives)
  auth.ts, auth.config.ts, middleware.ts   # NextAuth v5 setup + route protection
  lib/                    # Prisma client, utils
prisma/                   # Schema + migrations (SQLite)
ml/                       # Optional Python/FastAPI ML prediction service
```

## Demo flow

1. Register an account
2. Add a child profile
3. Run a screening (10 questions)
4. View risk results (rule-based estimate, or AI model prediction if the ML service is running)
5. Create a therapy plan and log a session
6. Play a therapy game (pattern play or emotion matching) from the child's Activities page
7. Chat with the AI Doctor about the child's progress
8. View monitoring charts and feedback reports

## Notes

- `.env`, `dev.db`, `node_modules/`, `.next/`, and `ml/venv/` are all gitignored — never commit secrets or the local database.
- Auth routes are protected in two places for defense in depth: `src/middleware.ts` (via `src/auth.config.ts`'s `authorized` callback) and a `redirect("/login")` check inside each protected page/server action.
