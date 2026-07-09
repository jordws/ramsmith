# RAMSmith

Compliant RAMS (Risk Assessment & Method Statements) and vehicle load plans for live event production crews — a guided form in, a branded, sign-off-ready PDF out. Built to replace hours of Word and Excel per job.

**Stack:** Next.js 14 (App Router) · TypeScript · Postgres + Prisma · NextAuth v5 · Stripe · @react-pdf/renderer · Tailwind.

> RAMSmith documents are a template aid, not legal advice. Every document carries that notice and is meant to be reviewed and signed off before issue.

---

## What's in the box

- **Auth** — email/password accounts (NextAuth v5, credentials + JWT sessions).
- **Guided document builder** — job details -> hazards -> method statement -> load plan, all editable.
- **Starter hazard library** — 12 event-industry hazards with default controls and risk ratings, fully editable per job.
- **Load plan calculator** — vehicle payload presets flag overloads and show utilisation.
- **Branded PDF export** — server-rendered A4 with risk table, method steps, load plan and document reference.
- **Monetisation, wired end-to-end** — freemium (3 documents), Stripe Checkout, customer portal, and a webhook that syncs subscription status. Features are gated on a live subscription, not just the UI.

Plans: **Free** (3 documents) · **Solo GBP19/mo** (unlimited) · **Team GBP49/mo** (unlimited + branding/seats).

---

## 1. Local setup

Prerequisites: Node 18.18+ and a Postgres database (free options: Neon at neon.tech or Supabase).

```bash
npm install
cp .env.example .env      # then fill in the values (see below)
npm run db:push           # create the tables
npm run db:seed           # optional: demo users + sample documents
npm run dev               # http://localhost:3000
```

Seeded logins (if you ran `db:seed`):

| Account | Email | Password | State |
| --- | --- | --- | --- |
| Free | `demo@ramsmith.app` | `password123` | 2 sample documents, free tier |
| Solo | `pro@ramsmith.app` | `password123` | Active subscription (unlimited) |

### Environment variables

| Variable | What it's for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Session signing secret — `openssl rand -base64 32` |
| `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` | Base URL (`http://localhost:3000` in dev, your domain in prod) |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe API keys (use **test** keys first) |
| `STRIPE_WEBHOOK_SECRET` | Printed by the Stripe CLI or the dashboard webhook |
| `STRIPE_PRICE_SOLO` / `STRIPE_PRICE_TEAM` | The two recurring price IDs |

---

## 2. Stripe setup (test mode first)

1. In the Stripe dashboard (test mode) create **two products**, each with a **recurring monthly GBP price**: Solo (GBP19) and Team (GBP49). Copy each `price_...` ID into `STRIPE_PRICE_SOLO` / `STRIPE_PRICE_TEAM`.
2. Grab your test API keys from Developers -> API keys into `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Forward webhooks to your local app (leave this running in a second terminal):

   ```bash
   npm run stripe:listen
   # copy the printed whsec_... into STRIPE_WEBHOOK_SECRET, then restart `npm run dev`
   ```

4. Test the full loop: sign up -> create 3 documents -> hit the paywall -> upgrade with Stripe test card `4242 4242 4242 4242` (any future expiry/CVC) -> land back on Billing as an active subscriber -> open the customer portal to cancel.

The webhook (`/api/stripe/webhook`) is the source of truth: it writes `plan`, `subscriptionStatus`, `stripePriceId` and `currentPeriodEnd` onto the user. Gating logic lives in `src/lib/plans.ts` (`computeUsage`).

Going live: swap test keys for live keys, create the products again in live mode, and add a webhook endpoint at `https://yourdomain/api/stripe/webhook` for the events `checkout.session.completed` and `customer.subscription.*`.

---

## 3. Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add a Postgres database (Vercel's Neon integration fills `DATABASE_URL`), and set every variable from the table above in Project -> Settings -> Environment Variables. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel URL.
3. Deploy. The build runs `prisma generate` automatically. After the first deploy, run `npx prisma db push` against the production database (locally with the prod `DATABASE_URL`) to create the tables.
4. Add the production Stripe webhook (step 2, "Going live") and paste its signing secret into `STRIPE_WEBHOOK_SECRET`.

The PDF and webhook routes are pinned to the Node runtime (`runtime = "nodejs"`) — required for `@react-pdf/renderer` and Stripe signature verification.

---

## 4. Fastest path to your first paying customer

You already have the full loop working. The remaining work is distribution, not code.

1. **Deploy today** with test Stripe keys and your own company details seeded. You need a live URL to show people.
2. **Pre-load one hazard library edit** for a niche you know (festivals, corporate AV, exhibition build). Being the "RAMS tool that already speaks *your* kind of show" is the wedge.
3. **Line up 5 warm conversations** — production managers and ops leads you already know who currently do this in Word. Ask them to build one real, upcoming job in it while you watch. The three-free-documents limit is designed for exactly this: they feel the value before the wall.
4. **Turn on live payments** once one person says "I'd pay for this." Switch to live Stripe keys, recreate the two prices in live mode, and update the webhook. Nothing else changes.
5. **Charge from day one.** At GBP19/mo the tool pays for itself the first time it saves an hour. Don't over-discount; a paid pilot tells you far more than a free one.
6. **Instrument the funnel** — the moment someone hits the paywall (`402` from `/api/documents`) is your highest-intent signal. Follow up with those users personally.

Priorities after first revenue: password reset, multi-seat for Team, document duplication/versioning, and company-logo upload for PDF branding (the schema already carries a `company` field per document).

---

## Project map

```
prisma/schema.prisma      Data model (User + subscription fields, Document)
prisma/seed.ts            Demo users and sample documents
src/lib/plans.ts          Plans, limits, and the gating source of truth
src/lib/hazards.ts        Starter hazard library + vehicle presets
src/lib/pdf/              Branded PDF template (@react-pdf/renderer)
src/server/               Auth-scoped data access (users, documents)
src/app/api/stripe/       Checkout, customer portal, and webhook
src/app/(app)/            Authenticated app: dashboard, documents, billing, settings
src/app/(auth)/           Login and register
src/app/page.tsx          Marketing landing page
```

## Scripts

`npm run dev` · `build` · `start` · `lint` · `db:push` · `db:seed` · `db:studio` · `stripe:listen`
