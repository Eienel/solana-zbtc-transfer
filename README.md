# TrendStep

Mobile-first web app that teaches TikTok dance trends, step by step.
Next.js 14 (App Router) + Tailwind CSS + Supabase, built for Vercel.

## Pages

- `/` — grid of dance trend cards (thumbnail, name, difficulty).
- `/trend/[slug]` — TikTok embed + numbered steps with **Mirror mode** and
  **Slow** mode (highlights one step at a time on a timer).
- `/admin` — password-gated form to add a new trend + repeatable steps.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional; mock data is used without it
npm run dev
```

Open `http://<your-lan-ip>:3000` on your phone (same Wi-Fi) to test mobile.

Without any env vars the app renders four built-in mock trends so you can
test the UI immediately. Admin form requires Supabase + `ADMIN_PASSWORD`.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL editor** and run `supabase/schema.sql`.
3. Put your keys in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, used by `/admin`)
   - `ADMIN_PASSWORD`

Schema:

- `trends(id, slug unique, name, tiktok_url, difficulty, thumbnail_url, created_at)`
- `steps(id, trend_id fk, order, title, description, count)`

RLS allows public `SELECT`; writes go through the service role via
server actions in `/admin`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add the four env vars above in Project Settings → Environment Variables.
4. Deploy. The default `npm run build` / `npm start` work out of the box.

## Design notes

- Mobile-first, dark theme (`#0b0b10`), `max-w-md` canvas, 48px tap targets.
- System fonts only (no web font downloads).
- No component libraries — just Tailwind utilities.
- **Mirror mode** swaps `left`/`right` (and casing variants) in step text so
  the user can follow along facing the screen.
- **Slow mode** cycles through steps on a 1x / 0.75x / 0.5x timer; tap any
  step to jump to it.

## Project layout

```
app/
  layout.js            root shell (dark, mobile canvas)
  page.js              home grid
  trend/[slug]/page.js tutorial page (server-fetches oEmbed)
  admin/               login + trend form (server actions)
components/
  TrendCard, DifficultyBadge, TikTokEmbed, TutorialView
lib/
  supabase.js          public + service clients
  data.js              getAllTrends / getTrendBySlug (falls back to mocks)
  tiktok.js            oEmbed fetch + id extraction
  mirror.js            left<->right swap
  mockData.js          built-in trends for zero-config demo
supabase/schema.sql    run in Supabase SQL editor
```
