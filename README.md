# Resynex

Resynex is a research collaboration marketplace combining Booking-style facility discovery, Facebook-style auth/dashboard flow, and ResearchGate-style community discussions.

## What is included

- Next.js 15 App Router + TypeScript + Tailwind
- PostgreSQL + Prisma schema
- Custom credentials auth with secure bcrypt password hashing
- Real email verification flow using Resend when configured
- Public homepage with logo, colored navbar, and login/register tabs
- Public Facilities, Problems, and Community pages
- Role-aware dashboard/sidebar
- Role-based registration fields
- Academic/university institutional email validation
- Industry company/ABN fields
- Seed data and demo accounts

## Important email note

If `RESEND_API_KEY` is not set, verification links are printed in the terminal during registration. This is useful for local testing.
For real users, configure Resend and a verified sending domain.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create PostgreSQL database named `resynex` or change `.env`.

3. Copy environment file:

```bash
cp .env.example .env
```

4. Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resynex?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
EMAIL_FROM="Resynex <noreply@yourdomain.com>"
RESEND_API_KEY=""
```

5. Prepare database:

```bash
npx prisma generate
npx prisma db push
npm run seed
```

6. Run locally:

```bash
npm run dev
```

Open: http://localhost:3000

## Demo accounts

Password for all seeded users:

```text
Password123!
```

- Admin: `admin@resynex.io`
- Industry: `demo@company.com`
- University: `facilities@demo.edu.au`
- Academic: `researcher@demo.edu.au`

## Production notes

Before launching publicly:

- configure Resend with a real verified domain
- use a hosted PostgreSQL database such as Neon/Supabase/Vercel Postgres
- replace local logo if desired at `public/logo.png`
- add real upload storage for verification documents, e.g. S3/Supabase Storage
- complete payment integration with Stripe if you need paid bookings
- run a full build and fix any environment-specific errors

## Commands

```bash
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
npm run build
```
