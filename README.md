# Innomium Talent

Verified AI/ML talent network — consultation, proprietary advisory, 1:1 tasks, and live competitions.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (light theme)
- Supabase (Auth, Postgres, Storage, Realtime)
- Stripe (Checkout + Connect)
- Lucide React icons + Innomium brand icon

## Setup

### 1. Install dependencies

```bash
cd innomium_talent
pnpm install
```

### 2. Environment

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3001
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

Use the same Supabase project credentials as `innomium_agency`.

### 3. Database migration (destructive)

Run `supabase/migrations/001_reset_talent_platform.sql` in the **Supabase SQL Editor**.

This **drops all agency tables and data** and creates the full talent platform schema with skill taxonomy seed data.

### 4. Supabase Auth

Add redirect URL: `http://localhost:3001/auth/callback`

### 5. Stripe

Create a webhook pointing to `/api/stripe/webhook` for `checkout.session.completed`.

### 6. First admin user

```sql
UPDATE profiles SET account_type = 'admin' WHERE id = '<your-user-uuid>';
```

### 7. Run

```bash
pnpm dev
```

Open http://localhost:3001
