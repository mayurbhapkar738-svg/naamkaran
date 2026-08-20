# Deploying Naamkaran (GitHub Pages + Cloudflare Worker + Gemini) — $0 to run

Two pieces: a static frontend (GitHub Pages) and a tiny backend (Cloudflare
Worker) that holds your Gemini key and the shared adoption counts. Every
piece here has a genuine free tier — no credit card required anywhere.

## 1. Get a free Gemini API key

Go to https://aistudio.google.com/apikey and create a key. No billing
required for the free tier. Keep this tab open — you'll paste the key in
step 2.

**Important:** the free tier applies per-model, and which models are free
changes over time. Before you deploy, check
https://ai.google.dev/gemini-api/docs/pricing and confirm a **Flash** or
**Flash-Lite** model still shows "Free" — Pro models are heavily
rate-limited or paid-only. Use that exact model name in `wrangler.toml`
(see below).

## 2. Backend: Cloudflare Worker

```bash
cd worker
npm install -g wrangler      # if you don't have it
wrangler login
```

Create the KV namespace that stores adoption counts:

```bash
wrangler kv namespace create NAMES_KV
```

This prints an `id`. Paste it into `wrangler.toml` under `[[kv_namespaces]]`.

Set your Gemini key as a secret (never commit this):

```bash
wrangler secret put GEMINI_API_KEY
```

Open `wrangler.toml` and set:
- `GEMINI_MODEL` — the exact free-tier model name you confirmed in step 1
  (default here is `gemini-2.5-flash`, but verify before deploying).
- `ALLOWED_ORIGIN` — your GitHub Pages URL, e.g. `https://yourusername.github.io`

Deploy:

```bash
wrangler deploy
```

Wrangler prints your Worker URL, something like:
`https://naamkaran-backend.yourname.workers.dev`

## 3. Frontend: GitHub Pages

Open `site/index.html` and set `WORKER_URL` near the top of the `<script>`
block to the URL from the step above.

Push `site/index.html` to a GitHub repo (rename it to `index.html` at the
repo root, or in a `/docs` folder — either works with Pages).

In the repo: **Settings → Pages → Deploy from a branch**, pick `main` and
the root (or `/docs`), save. GitHub gives you a URL like
`https://yourusername.github.io/reponame/`.

Go back and double check `ALLOWED_ORIGIN` in `wrangler.toml` matches this
exactly (including whether there's a repo name in the path), then
`wrangler deploy` again if you changed it.

## 4. Test

Open your GitHub Pages URL, generate some names, and check a box. If
nothing loads, open the browser console — CORS errors usually mean
`ALLOWED_ORIGIN` doesn't match your Pages URL exactly. A 502 from
`/api/generate` usually means the Gemini model name is wrong or no longer
free — recheck the pricing page.

## Staying free

- **GitHub Pages** — free, no relevant limits for a personal project.
- **Cloudflare Workers** — free tier: 100k requests/day.
- **Workers KV** — free tier: 100k reads/day, 1k writes/day.
- **Gemini API (Flash/Flash-Lite)** — genuinely free, no card on file,
  but rate-limited per day (reported anywhere from ~250 to 1,500+
  requests/day depending on the exact model — check the pricing page for
  current numbers). If you ever hit a 429 error, you've hit that daily
  cap; it resets, or you can add billing to lift it.
- **Gemini Pro models** — do NOT use these expecting free access; they're
  either heavily capped or paid-only depending on the moment you're
  reading this. Stick to Flash/Flash-Lite.
