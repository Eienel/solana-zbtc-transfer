# TrendStep

Mobile-first web app for learning TikTok dances from community-uploaded
tutorials. Next.js 14 (App Router) + Tailwind + Supabase, deployable to
Vercel.

## How it works

- **Anyone can upload a tutorial — no account.** Paste a public TikTok URL,
  break the dance into numbered steps (title + description + count), done.
- **A trend is defined by its TikTok sound.** We scrape the `music_id` from
  the video you upload and match it to an existing trend, or create a new
  one. That means you *cannot* upload an off-topic video and have it count
  as a dance trend — it'll get filed under a different sound.
- **Upvote + report.** One vote per person per tutorial (IP+UA fingerprint,
  no login). 5 reports auto-hide a tutorial.
- **Cloudflare Turnstile** gates the upload form to keep bots out.
- **Search** trends by name or song on the home page.
- **Mirror mode** swaps "left"/"right" in step text so you can follow along
  facing the screen. **Slow mode** cycles the step highlight on a timer.

## Pages

- `/` — grid of trends (thumbnail, name, song, difficulty, tutorial count) + search.
- `/trend/[slug]` — featured (top-voted) tutorial with embed, steps, mirror
  & slow controls, vote + report. Alternative takes listed below; tap one
  to swap it in via `?t=<id>`.
- `/upload` — two-step flow: paste URL → confirm sound match (or name a new
  trend) → add steps → submit.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional; mock data is used without it
npm run dev
```

Open `http://<your-lan-ip>:3000` on your phone (same Wi-Fi) to test mobile.
Without any env vars the app renders three mock trends with mock tutorials
so the UI is fully interactive.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL editor** and run `supabase/schema.sql`. It sets up:
   - `trends` (unique per `music_id`)
   - `tutorials` (many per trend, with `vote_count` + `report_count`)
   - `steps` (FK to tutorials)
   - `votes` + `reports` (keyed by `(tutorial_id, fingerprint)`)
   - Triggers that bump the denormalized counters and auto-hide at 5 reports
   - RLS policies: public read, service-role writes
3. Put keys in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `FINGERPRINT_SECRET` (any random string)
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET` (optional locally)

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new — framework auto-detects as Next.js.
3. **Environment Variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FINGERPRINT_SECRET`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET`
4. Deploy. `npm run build` / `npm start` work out of the box.

**Turnstile setup:** create a site at
https://dash.cloudflare.com/?to=/:account/turnstile. Add your Vercel domain,
copy the site key + secret into the env vars above.

**Note on the music_id scraper:** TikTok occasionally changes their page
markup. The scraper tries multiple regex patterns and returns a clear error
if it can't find `music_id` — in that case the upload is rejected rather
than silently accepted. Monitor `/upload` errors after launch.

## Project layout

```
app/
  layout.js                 root shell (dark, mobile canvas)
  page.js                   home grid + search
  trend/[slug]/page.js      trend page (featured + alternatives)
  trend/[slug]/actions.js   vote + report server actions
  upload/page.js            upload shell
  upload/UploadForm.js      two-step client form
  upload/actions.js         preview + submit server actions

components/
  SearchBar, TrendCard, DifficultyBadge
  TikTokEmbed               TikTok oEmbed rendering
  TutorialView              featured tutorial (embed + steps + mirror/slow)
  AltTutorialCard           compact card for alternative takes
  VoteButton, ReportButton, Turnstile

lib/
  supabase.js               public + service clients
  data.js                   searchTrends / getTrendBySlug
  tiktok.js                 oEmbed + music_id scraper
  fingerprint.js            IP+UA hash for anti-duplicate votes
  turnstile.js              server-side token verification
  mirror.js                 left<->right swap for mirror mode
  mockData.js               zero-config demo data

supabase/schema.sql         run in Supabase SQL editor
```
