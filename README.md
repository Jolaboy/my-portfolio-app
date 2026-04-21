# Portfolio (Next.js + TypeScript)

## Local development

- `npm run dev` starts the dev server (<http://localhost:3000>)
- `npm run build` creates a production build
- `npm run start` runs the production server

If you run the repo from a synced OneDrive folder and see errors involving `.next` (for example `EINVAL ... readlink ... .next\\package.json`), run `npm run clean:next` and then start the dev server again.

## Code Tour

Start here to understand how the app is put together:

- App entry (App Router)
  - [`src/app/layout.tsx`](src/app/layout.tsx) — root layout + metadata (favicon)
  - [`src/app/page.tsx`](src/app/page.tsx) — renders the portfolio page
  - [`src/app/globals.css`](src/app/globals.css) — minimal global styles (Tailwind base)

- Main UI
  - [`src/components/FullStackPortfolio.tsx`](src/components/FullStackPortfolio.tsx) — single-page portfolio UI (theme + sections)
  - [`src/components/ContactForm.tsx`](src/components/ContactForm.tsx) — contact form UI (POSTs to `/api/contact`)

- API routes
  - [`src/pages/api/contact.ts`](src/pages/api/contact.ts) — SMTP email sender (Nodemailer)

- Shared types
  - [`src/types/styles.d.ts`](src/types/styles.d.ts) — TypeScript module declarations for styles

## Contact form (SMTP)

This app sends contact email via `/api/contact`.

Environment variables (place them in `.env.local`).

Templates:

- `env.local.example.txt` (recommended starting point for local)
- `env.example.txt` (generic reference)

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true`/`false`)
- `SMTP_USER`
- `SMTP_PASS`

## CI (GitHub Actions)

A basic CI workflow runs on every push and pull request:

- Lint: `npm run lint`
- Build: `npm run build`

Workflow file: `.github/workflows/ci.yml`.

## Deploy (Netlify)

This repo includes `netlify.toml` for Netlify’s Next.js runtime.

Steps:

1) Push the repo to GitHub.
2) In Netlify: **Add new site** → **Import from Git** → select the repo.
3) In Netlify site settings, add the SMTP environment variables listed above.

Note: This site is designed to work reliably on Netlify. The contact form uses a serverless API route and does not rely on long-lived WebSocket servers.
