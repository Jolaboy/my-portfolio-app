# Portfolio (Next.js + TypeScript)

## Local development

- `npm run dev` starts the dev server (http://localhost:3000)
- `npm run build` creates a production build
- `npm run start` runs the production server

## Contact form (SMTP)

This app sends contact email via `/api/contact`.

Environment variables (place them in `.env.local`):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true`/`false`)
- `SMTP_USER`
- `SMTP_PASS`
- `TO_EMAIL` (optional)

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

Note: the Socket.IO-based realtime admin panel typically won’t work reliably on Netlify (serverless functions aren’t a long-lived WebSocket host). The main site and contact form can still be deployed.
