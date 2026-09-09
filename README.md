# Healthy Steps Foundation

Website for **Healthy Steps Foundation**, a faith-based nonprofit in Wakiso, Uganda, that partners with families to improve mental health wellness through community programs.

**Live:** https://healthy-steps-foundation.vercel.app *(deployment currently paused pending Vercel account review)*

The organization empowers families in Uganda through mental health support, education, and essential resources — delivered through a holistic, faith-guided, and dignity-first approach. The site presents the foundation's programs (Food Pantry, Clothing Closet, Children's Tuition Support, Adult Vocational Training, Family Medical Assistance, Resource Materials) and carries a full donation pledge flow plus a small admin backend.

## Features

- Marketing pages: home, mission, about, programs (with per-program detail pages), staff, stories, news, get-help, contact, donate
- **Donation pledge flow** — validated with react-hook-form + zod, recorded in Supabase, with a pledge PDF generated server-side and emailed to the donor via Resend
- **Recurring-donation reminders** — a daily Vercel Cron job (plus an admin-triggerable API route) that emails reminders for recurring pledges
- **Admin area** (`/admin`) — cookie-authenticated login, a donations dashboard, and a content editor
- **Lightweight CMS** — page content defaults are declared in code and overlaid with edits stored in a Supabase `site_content` table; if Supabase is unconfigured or unreachable, pages fall back to the in-code defaults instead of failing
- "Add to calendar" (`.ics`) downloads for upcoming events
- Framer Motion animations throughout

## Tech stack

- Next.js (App Router) + TypeScript + React
- Tailwind CSS v4 (`@tailwindcss/postcss`, forms + typography plugins)
- Supabase (Postgres + Storage) — schema in `supabase/schema.sql`
- Resend (transactional email), `@react-pdf/renderer` (server-side PDFs)
- react-hook-form + zod, Framer Motion
- Deployed on Vercel (GitHub integration; cron schedule in `vercel.json`)

## Implementation notes

- **Server-rendered PDF receipts:** `src/lib/pdf/donation-pledge.tsx` builds the donation pledge document with `@react-pdf/renderer` and `renderToBuffer`, so the PDF is composed as React components and attached to the confirmation email — no client-side PDF work.
- **PL/pgSQL invoice numbering:** invoice numbers on the `donations` table are assigned by a `BEFORE INSERT` trigger function in `supabase/schema.sql` (a generated column can't reference the sequence-backed id, a trigger can).
- **Reminders module:** `src/lib/reminders.ts` is shared by the admin "run now" route and the Vercel Cron route (`/api/cron/recurring-reminders`, protected by `CRON_SECRET`), and checks its env vars lazily so importing it never throws at build time.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The site runs without any backend configured (CMS content falls back to in-code defaults). For the full donation/admin flows, provide Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), Resend, and admin credentials via environment variables, and apply `supabase/schema.sql` to your Supabase project.

Other scripts:

```bash
npm run media:manifest   # regenerate the media manifest
npm run test:cms         # run the CMS merge tests
```

## Project structure

```
src/
  app/
    (marketing)/     # public pages: about, programs/[slug], donate, stories, ...
    admin/           # login, content editor, donations dashboard
    api/             # donations, admin content/donations/reminders routes
  components/        # per-section and shared UI components
  lib/
    cms/             # defaults-in-code CMS: schemas, merge/diff, registry
    pdf/             # donation pledge PDF (react-pdf)
    email.ts, reminders.ts, supabase.ts, validations.ts, ics.ts, ...
vercel.json          # cron schedule for /api/cron/recurring-reminders
supabase/schema.sql  # tables, invoice-number trigger function, RLS
```
