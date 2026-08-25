# Range Physiotherapy — site

Astro + Decap CMS. Static output, no server, no database. Every content
edit is a git commit. Bilingual: Czech (default) and English.

## Structure

```
src/
  data/*.json               → editable page copy — each file has a "cs" and
                               "en" object (site, home, about, contact, faq,
                               services)
  i18n/
    routes.js                → route-key → path map, shared by nav + switcher
    ui.js                    → static UI chrome text (nav labels, footer)
  components/
    pages/                   → one component per page (Home, About,
                               Services, Faq, Contact) — the actual markup,
                               written once, driven by a `lang` prop
    Header.astro, Footer.astro, Arc.astro
  layouts/Layout.astro       → shared <head> + header/footer wrapper
  pages/                     → thin per-locale route files, e.g.:
    index.astro               → <Home lang="cs" />   → served at /
    about.astro                → <About lang="cs" />  → served at /about/
    en/index.astro             → <Home lang="en" />   → served at /en/
    en/about.astro              → <About lang="en" /> → served at /en/about/
public/
  admin/                     → Decap CMS config (the editing UI, at /admin)
```

Czech is the default locale and lives at the root paths (`/`, `/about/`,
...). English lives under `/en/` (`/en/`, `/en/about/`, ...). This is
configured in `astro.config.mjs` via Astro's built-in `i18n` routing.

**Why one component per page instead of duplicating content twice:** each
page's markup and layout logic is written once in `src/components/pages/`;
the thin wrapper files in `src/pages/` just pick a language. Content itself
lives in `src/data/*.json`, one file per page, each with a `cs` and `en`
key — so translating a page means editing one JSON file, not two templates.

## Local development

```sh
npm install
npm run dev       # localhost:4321  →  /  and  /en/
npm run build     # outputs static files to ./dist
npm run preview   # serve the built ./dist locally
```

## Editing content

Two ways:

1. **Directly**: edit the `.json` files in `src/data/` — each has a `cs`
   and `en` object side by side, so both languages stay in sync in one
   place. Commit when done. No build config to touch.
2. **Through the CMS**: once deployed (see below), visit `/admin` on the
   live site. Decap CMS shows a "Czech" and "English" tab per page, and
   commits changes to git for you — this is what you'd hand to the
   physiotherapist if they want to update copy themselves.

## Adding a third language later

If you ever need more than Czech/English:

1. Add the locale to `astro.config.mjs` → `i18n.locales`.
2. Add a matching key (e.g. `"de"`) next to `cs`/`en` in every file under
   `src/data/`.
3. Add the locale's strings to `src/i18n/ui.js`.
4. Create the route files under `src/pages/de/` mirroring the existing
   `en/` folder.
5. Add a "German" tab to each collection in `public/admin/config.yml`,
   mirroring the existing Czech/English tabs.

## Running in a container (local testing)

Two ways to run it, both via `docker compose`:

```sh
docker compose up dev       # http://localhost:4321 — hot-reloading dev server
docker compose up preview   # http://localhost:4322 — actual production build
```

- **`dev`** bind-mounts this folder into the container, so editing files on
  your machine hot-reloads the page immediately — this is what you want for
  day-to-day testing.
- **`preview`** runs the real `astro build` + `astro preview` inside the
  image, matching what you'd actually deploy. It doesn't live-reload; after
  changing source, re-run `docker compose up --build preview`.

Both need only Docker Desktop installed — no local Node.js required.

## Running without Docker

Just Node.js (LTS) installed — no other dependency:

```sh
npm install
npm run dev
```

Then open `http://localhost:4321`.

## Deploying + wiring up the CMS

Decap CMS needs a git-based auth backend. The path of least resistance:

1. Push this repo to GitHub.
2. Deploy on **Netlify** (free tier is plenty): connect the repo, build
   command `npm run build`, publish directory `dist`.
3. In Netlify: **Site settings → Identity → Enable Identity**, then
   **Enable Git Gateway** underneath it. This lets Decap authenticate
   without you managing GitHub tokens.
4. Invite yourself (and the physiotherapist, if they'll edit content) as an
   Identity user from the Netlify dashboard.
5. Visit `yoursite.netlify.app/admin`, log in, and the CMS is live.

`public/admin/config.yml` is already set to `backend: git-gateway`, which
matches this flow. If you'd rather deploy on Cloudflare Pages or Vercel
instead of Netlify, swap the backend to:

```yaml
backend:
  name: github
  repo: your-username/your-repo
  branch: main
```

— this needs a GitHub OAuth app instead of Netlify Identity. Decap's docs
cover both: https://decapcms.org/docs/backends-overview/

## Contact form

`src/data/contact.json` has a top-level `formEndpoint` field (shared by
both languages) pointing at a Formspree placeholder. Sign up at
formspree.io (free tier), create a form, and drop your real endpoint URL
in there (via the CMS, under **Contact Page**, or directly in the file).
No backend code needed — the `<form>` posts straight to Formspree.

## What's intentionally not here

No CSS framework, no JS framework, no client-side JavaScript beyond a
~10-line mobile-menu toggle. The FAQ accordion is native `<details>`. No
i18n library either — Astro's built-in routing plus plain JSON objects
cover a 2-language, 5-page site without adding a dependency. This keeps
the maintenance surface to: Astro itself, and whatever you put in `src/`.
