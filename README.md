# Pera Gibbs Movement

Next.js 16 marketing site with a database-backed admin panel.

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Database**: PostgreSQL via Prisma 7
- **Email**: Resend
- **Styling**: Tailwind CSS v4

## What the admin panel controls

Sign in at `/admin`. Every change writes to Postgres and immediately
revalidates the public pages.

| Section | Route | Tabs |
| --- | --- | --- |
| Coaching Offerings | `/admin/offerings` | Section copy, Pricing tiers, How it works, Comparison, In-person |
| Skills | `/admin/skills` | Section copy, Skills (each with its highlights) |
| Testimonials | `/admin/testimonials` | Section copy, Testimonials |
| Programme Guides | `/admin/guides` | Section copy, Guides |
| Guide Leads | `/admin/leads` | Search, status and guide filters, notes, CSV export |
| Contact Messages | `/admin/messages` | Search and status filters, delivery status, retry, CSV export |

Long sections are split into tabs so each tab is one self-contained form. The
active tab lives in the URL (`?tab=tiers`), so saving keeps you where you were
and a tab is a shareable link.

The dashboard charts daily submissions across both forms for the last 30 days,
downloads per guide, and where leads and messages sit in their pipelines. The
chart palette is validated for colour-vision deficiency and every chart has a
table view, so no value is reachable only by hovering.

## Uploading photos and PDFs

Testimonial photos, guide cover images and guide PDFs are uploaded through the
admin panel. There is no path to type in: choose a file, and it is saved under
`public/uploads/` and linked to the record.

| Upload | Accepted | Limit |
| --- | --- | --- |
| Photos | JPG, PNG, WebP, AVIF | 5 MB |
| Guide PDFs | PDF | 25 MB |

Files that are too large are refused in the browser before anything uploads.
Everything else is checked again on the server, where the file's actual
signature must match its claimed type, so an HTML file renamed to `.png` is
rejected. SVG is not accepted, because it can carry script and these files are
served from the site's own origin. The stored filename is generated, and the
extension comes from the detected type rather than the uploaded name.

Replacing a file deletes the one it replaced. Files that were committed to the
repository, such as `/guides/pdf1.pdf`, are never deleted - only files under
`public/uploads/`.

> **Deployment note.** This writes to the filesystem, which works on a
> persistent Node server (a VPS, Render, Railway, Fly, a container). It does
> **not** work on a read-only or ephemeral serverless filesystem such as
> Vercel, where uploads would vanish between deploys. On that kind of host,
> swap `src/lib/uploads.ts` for object storage such as S3, Cloudflare R2 or
> Vercel Blob. Everything else, including the forms, stays as it is.

Raising a limit means changing `UPLOAD_KINDS` in `src/lib/uploads.ts` **and**
`serverActions.bodySizeLimit` in `next.config.ts`, which must stay above the
largest limit plus multipart overhead.

Testimonials have two independent switches. **Published** controls whether a
testimonial appears anywhere. **Pinned** controls whether it also appears in
the scrolling band on the home page. The `/testimonials` page shows every
published testimonial regardless of pinning.

## First-time setup

### 1. Create the database

Using the local PostgreSQL server:

```bash
psql -U postgres -c "CREATE DATABASE peragibbs;"
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then fill in `.env`:

- `DATABASE_URL` — your Postgres connection string.
- `AUTH_SECRET` — at least 32 characters. Generate one with
  `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — the first admin login. The password must
  be at least 10 characters and is hashed with bcrypt before it is stored.
- `RESEND_API_KEY` — optional in development. Without it, contact submissions
  are still saved and the admin panel marks the notification as skipped.

### 3. Create the tables and load the current content

```bash
npm run db:setup
```

This runs the migration and then seeds the database with everything that used
to be hard-coded in the components: three pricing tiers, the how-it-works
steps, the comparison table, in-person rates, six skills with their
highlights, five testimonials (all pinned) and two programme guides.

### 4. Run the app

```bash
npm run dev
```

The site is at `http://localhost:3000` and the admin panel at
`http://localhost:3000/admin`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Generate the Prisma client, then build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:setup` | Migrate and seed in one step |
| `npm run db:migrate` | Create and apply a migration after a schema change |
| `npm run db:deploy` | Apply pending migrations (use in production) |
| `npm run db:seed` | Re-run the seed script |
| `npm run db:studio` | Prisma Studio, a GUI over the data |

The seed is safe to re-run. Tiers and guides upsert on their slug, testimonials
are skipped if any already exist, and skills, steps, in-person rates and the
comparison table are rebuilt from scratch. Re-seeding will therefore discard
admin edits to those rebuilt sections.

## Admin interface notes

The admin panel uses Inter rather than the site's display face, which is not
legible at interface sizes. Its own surface tokens (`shell`, `canvas`, `line`)
are defined alongside the brand palette in `src/app/globals.css`.

List filters are plain GET forms: search plus one select per dimension, with
active filters shown as removable chips. That keeps filter state in the URL and
means the pages work without client JavaScript.

The shell is a fixed sidebar with a scrolling content column. It cannot use
`position: sticky`, because `globals.css` sets `overflow-x: hidden` on
`html, body` for the marketing site, which makes them scroll containers and
disables sticky positioning in every descendant.

## How the data flows

Public pages are server components that read through `src/lib/content.ts` and
pass plain objects into the existing client components, so all the GSAP
animation stays untouched. `/` and `/testimonials` are statically rendered with
a one-hour revalidate window; every admin mutation calls `revalidatePath` on
both, so edits appear on the next request rather than an hour later.

Form submissions go to route handlers, not server actions, because the guide
modal needs the response before it triggers the PDF download:

- `POST /api/leads` — validates, stores a `GuideLead`, then notifies by email.
- `POST /api/contact` — validates, stores a `ContactSubmission`, sends the
  notification through Resend, and records whether delivery succeeded.

Both endpoints are rate limited per IP and carry a honeypot field. A contact
message is written to the database **before** the email is attempted, so an
email outage never loses an enquiry. Failed sends show in
`/admin/messages` with a retry button.

## Seeding, and what production needs

The seed has two modes, and only one of them is safe against a live database.

| Command | Mode | Behaviour |
| --- | --- | --- |
| `npm run db:seed` | fill | Creates only what is missing. Never deletes, never overwrites an existing row. Safe to re-run against production. |
| `npm run db:seed:reset` | reset | Deletes the seeded sections and rebuilds them from the seed file. Local development only. Refuses to run when `NODE_ENV=production` unless `--force` is passed. |

Fill mode leaves a section alone as soon as it has any rows, so tiers, steps,
the comparison table, skills, testimonials and guides all keep whatever the
client edited. It never touches leads or contact messages.

Re-seeding also never changes an existing admin password. Manage logins
explicitly instead:

```bash
npm run admin:list       # who can sign in
npm run admin:create     # create a user from ADMIN_EMAIL / ADMIN_PASSWORD
npm run admin:password   # rotate an existing user's password
```

### Pointing a command at production

An inline variable beats `.env`, so target production per command without
editing anything:

```bash
DATABASE_URL="$PROD_DATABASE_URL" npx prisma migrate deploy
DATABASE_URL="$PROD_DATABASE_URL" npx prisma db seed
```

On Neon, run **migrations** against the direct endpoint by dropping `-pooler`
from the host. The pooled endpoint is PgBouncer, which does not reliably
support the locks and DDL that migrations need. The running app should use the
pooled URL.

### Release checklist

1. `DATABASE_URL="<direct url>" npx prisma migrate deploy`
2. `DATABASE_URL="<pooled url>" npx prisma db seed` (only needed the first
   time, but harmless afterwards)
3. Deploy the app with the environment variables below.

## Deployment notes

Set these in the hosting environment:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | The **pooled** connection string for the app at runtime. |
| `AUTH_SECRET` | 32+ random characters. Use a different value from development. |
| `RESEND_API_KEY` | From resend.com. |
| `CONTACT_FROM_EMAIL` | Must be on a domain verified in Resend, or delivery fails. |
| `CONTACT_TO_EMAIL` | Where enquiry notifications go. |
| `CONTACT_AUTOREPLY` | `true`, or `false` to stop the visitor acknowledgement. |

`ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME` are only needed when you run
the seed or the admin scripts. The app itself does not read them, so they do
not need to live in the hosting environment.

> **File uploads need a persistent disk.** Admin uploads are written to
> `public/uploads/`. That works on a VPS, Render, Railway, Fly or a container.
> On Vercel and similar serverless hosts the filesystem is read-only and
> ephemeral, so uploads will fail or vanish on the next deploy. If you deploy
> there, replace `src/lib/uploads.ts` with object storage (S3, Cloudflare R2 or
> Vercel Blob). Nothing else changes.

The in-memory rate limiter and login throttle are per process. On a
multi-instance deployment, back them with Redis. The call sites in
`src/lib/rate-limit.ts` and `src/lib/auth.ts` are the only places to change.
