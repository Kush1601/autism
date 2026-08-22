# Early Autism Screening & AI-Powered Child Monitoring

A full-stack web application for early autism screening, therapy tracking, and AI-powered developmental support for children aged 4–11.

## Features

- **Autism Screening** — 10-question M-CHAT-R/F screening with ML-based risk prediction
- **AI Doctor Chatbot** — Personalised assistant with full knowledge of the child's screenings, therapy plans, and progress
- **Therapy Management** — Create plans, log sessions, track improvement scores
- **Interactive Games** — Pattern recognition and emotion identification therapy games
- **Progress Monitoring** — Charts tracking screening scores and therapy trends over time
- **Feedback Reports** — AI-generated progress reports per child

## Tech Stack

- **Frontend/Backend** — Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Database** — SQLite via Prisma ORM
- **Auth** — NextAuth v5
- **AI** — Anthropic Claude API
- **ML** — Optional Python/FastAPI prediction service (falls back to rule-based scoring)

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required env vars:
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)

(`DATABASE_URL` is configured directly in `next.config.mjs`, not `.env`.)

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Start the dev server:

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

## Optional: ML Prediction Service

If you want ML-based autism risk prediction instead of rule-based scoring:

```bash
cd ml
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install fastapi uvicorn joblib pandas scikit-learn
cd ..
npm run ml:predict
```

This starts the FastAPI service on `http://localhost:5000` (override with `ML_API_URL` in `.env`). If it isn't running, the app falls back to rule-based scoring automatically.

## Viewing the Database

To browse the SQLite database visually:

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555) — lets you view and edit all tables (Users, Children, Screenings, TherapyPlans, etc.) directly in the browser.

## Demo Flow

1. Register an account
2. Add a child profile
3. Run a screening (10 questions)
4. View risk results and AI prediction
5. Create a therapy plan
6. Log therapy sessions
7. Play a therapy game (pattern play or emotion matching) from the child's Activities page
8. Chat with the AI Doctor about the child's progress
9. View monitoring charts and feedback reports
