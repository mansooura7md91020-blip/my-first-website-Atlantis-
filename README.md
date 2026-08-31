# Atlantis General Supplies — Website (Frontend Foundation)

أطلنتس للتوريدات العموميه — a bilingual (Arabic/English) B2B + retail
website for a cleaning, plastics, cups, and general-supplies distributor
in Egypt.

This is **v1: the frontend foundation**. It is a real, working Next.js
app — not a static mockup — built so that a backend (Supabase) can be
plugged in without reworking the UI.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** (CSS-variable based theme — see `src/app/globals.css`)
- **No external UI kit** — small hand-built primitives in `src/components/ui`
- Ready for **Supabase** (DB + Auth) and **Vercel** (hosting) — no AWS, no paid infra required

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build (already verified to pass)
npm run start     # run the production build locally
```

Visiting `/` redirects to `/ar` or `/en` based on browser language (see
`src/middleware.ts`). The admin dashboard lives at `/admin` and is
English-only in v1 (see "What's intentionally not done yet" below).

## Project structure

```
src/
  app/
    [locale]/            ← every public page, under /ar or /en
      layout.tsx          root layout: <html lang dir>, providers, header/footer
      page.tsx             Home
      products/            Products listing + [slug] detail
      categories/           Categories listing + [slug] detail
      cart/, checkout/, supply-request/
      about/, contact/, login/, register/, account/
    admin/                ← NOT localized in v1 (English only)
      layout.tsx           sidebar + mobile nav
      page.tsx              dashboard
      products/, categories/, orders/, supply-requests/,
      quotations/, customers/, settings/
    globals.css           design tokens (light/dark), Tailwind import
    icon.svg              favicon (Atlantis mark)
  components/
    ui/                   Button, form fields, Card, Badge, Container…
    layout/               Header, Footer, Logo, LanguageSwitcher, ThemeToggle, WhatsAppButton
    products/             ProductCard, CategoryCard, PriceTiers (depth bands), AddToCartForm
    admin/                AdminPageHeader, StatCard, AdminTable, StatusPill
  lib/
    types/                shared TypeScript interfaces — mirror the planned DB schema
    data/                 mock "repository" functions (see below)
    i18n/                 dictionaries (ar.json/en.json), locale config, providers
    context/              CartContext (localStorage), ThemeContext (localStorage)
    utils/                pricing.ts (tier resolution), whatsapp.ts (wa.me links), cn.ts
middleware.ts            locale detection & redirect
```

## How data will connect to Supabase later

Every file in `src/lib/data/` exports **async functions** that currently
return static arrays — e.g. `getProducts()`, `getCategoryBySlug()`,
`getCompanySettings()`. Most components call these functions, never the
arrays directly. This means the migration path is:

1. Create a Supabase project, define tables matching `src/lib/types/index.ts`
   (`products`, `product_price_tiers`, `categories`, `orders`, `order_lines`,
   `supply_requests`, `supply_request_items`, `quotations`,
   `quotation_lines`, `customers`, `company_settings` — one row).
2. Replace the body of each function in `src/lib/data/*.ts` with a Supabase
   query (`supabase.from('products').select(...)`), keeping the same
   function signatures.
3. No page or component needs to change, because they already call these
   functions and already handle `Promise`-based data (`await
   getProducts()` in server components).
4. Add Supabase Auth for Login/Register/Account (currently UI-only, see below).

A couple of client components (`cart/page.tsx`, `checkout/page.tsx`,
`supply-request/page.tsx`, admin list pages) import the static
`products`/`companySettings` arrays directly for simplicity in this
first version — when wiring Supabase, switch these to fetch through a
route handler or `use()`-wrapped promise the same way `products/page.tsx`
does.

## How quantity-based pricing works

`src/lib/types/index.ts` defines `PriceTier`:

```ts
{ minQty: number; maxQty: number | null; pricePerUnit: number | null }
```

A product has an array of tiers, e.g.:

```
1–99    → 1.50 EGP
100–499 → 1.30 EGP
500–999 → 1.15 EGP
1000+   → null  (= "Request a Quote")
```

`src/lib/utils/pricing.ts` → `resolvePrice(tiers, quantity)` finds the
matching tier and returns the unit price + line total, or flags
`requiresQuote: true` when the matched tier's price is `null`. This one
function is used everywhere a price is shown (product card, product
page, cart, checkout) so the logic never lives twice. Tiers are fully
data-driven — editing them in `src/lib/data/products.ts` today, or in
Supabase later, changes pricing everywhere automatically.

The tiers are visualized as "depth bands" (Surface/Reef/Deep/Abyss) —
the signature visual tying the Atlantis name to the pricing model.

## Normal orders vs. supply requests

These are two intentionally separate flows, per the brief:

| | Normal order | Supply request |
|---|---|---|
| Entry point | Add to Cart → Checkout | "Request Supply Quote" button (header + home) |
| Who it's for | Anyone buying in-stock quantities with a resolvable tier price | Institutions needing quantities above the top tier, or a custom/recurring arrangement |
| What happens on submit | Creates an `order` (status `received`) — **no payment is taken on the site** | Creates a `supply_request` (status `new`) for admin review |
| Pricing | Automatic, from tiers | Manually quoted by admin as a `quotation` |
| Payment terms | Confirmed with the customer after order placement (never a fixed policy) | Set per-quotation by admin (deposit / full payment / bank transfer / etc.) |

If a cart contains a line whose quantity requires a quote, the cart page
blocks checkout for that line and redirects the customer to the supply
request form instead — the two flows never get confused.

## WhatsApp integration (current state)

- `src/lib/utils/whatsapp.ts` builds a `wa.me` deep link with a
  pre-filled message. **This is the only WhatsApp integration that
  exists.** There is no WhatsApp Business API call anywhere in the code.
- Message templates (order received/confirmed/preparing, supply request
  received, general inquiry) live in `CompanySettings.whatsappTemplates`
  and are editable in `/admin/settings`.
- When you're ready to send automatic status messages (e.g., when an
  admin changes an order to "confirmed"), that requires applying for
  WhatsApp Business API access (via Meta or a BSP like Twilio/360dialog)
  and replacing the relevant `buildWhatsAppLink()` call with a server-side
  API call. Nothing in this codebase pretends that already works.

## Admin dashboard (current state)

`/admin` is a working UI over the same demo data, built to the same
design system. In this version:

- All admin screens display data from `src/lib/data/admin.ts` (demo
  orders, supply requests, quotations, customers) and
  `src/lib/data/products.ts` / `categories.ts`.
- `/admin/settings` is a real, controlled form — editing it updates
  local component state and shows a "Saved" confirmation, but **does
  not persist** yet (no backend). Wiring it to Supabase means the
  `handleSave` function writes to the `company_settings` table instead
  of just calling `setSaved(true)`.
- There's no authentication guarding `/admin` yet — that must be added
  (Supabase Auth + a role check) before this goes to production, since
  right now anyone with the URL can view it.

## Theme & language

- Theme: `ThemeProvider` in `src/lib/context/theme-context.tsx` toggles a
  `.dark` class on `<html>`, persisted to `localStorage`, with a
  no-flash inline script in the layout `<head>`.
- Language: locale is a URL segment (`/ar/...`, `/en/...`), detected on
  first visit via `Accept-Language` in `src/middleware.ts`. All UI
  strings live in `src/lib/i18n/dictionaries/{ar,en}.json` — there is no
  hard-coded UI text in components. RTL/LTR is driven by the `dir`
  attribute on `<html>`, set per-locale in the layout.

## Fonts

To keep this buildable without internet access to Google Fonts during
development, `globals.css` currently defines `--font-heading` /
`--font-body` as system-font stacks that *reference* Manrope/Inter/Tajawal
but fall back gracefully. Once deployed (Vercel has full internet
access), swap these for `next/font/google`:

```ts
import { Manrope, Inter } from "next/font/google";
// Arabic: import { Tajawal } from "next/font/google";
```

and apply the generated CSS variables in `app/[locale]/layout.tsx`.

## What's intentionally NOT done yet (by design, per the brief)

- **No database** — everything is static/demo data in `src/lib/data/`.
- **No authentication** — Login/Register/Account pages are UI only.
- **No payment integration** — checkout never asks for card details;
  it collects an order and payment terms are agreed afterward.
- **No WhatsApp Business API** — only `wa.me` deep links.
- **No fixed 30-day payment term anywhere** — payment terms are always
  either a general (editable) note, or set explicitly per order/quotation.
- **Admin is not localized** and has no access control yet.
- **Demo products, prices, and stock are placeholders**, clearly marked
  `isDemo: true` and shown with a "DEMO" badge — replace them via
  `/admin/products` once that's wired to a database.

## Next steps (suggested order)

1. Create the Supabase project + schema (see table list above).
2. Add Supabase Auth; protect `/admin` with a role check.
3. Replace `src/lib/data/*.ts` function bodies with Supabase queries.
4. Wire `/admin/settings` save, and `/admin/products` create/edit forms.
5. Wire order/supply-request submission to insert real rows.
6. Add `next/font/google` (Manrope + Tajawal) once deployed.
7. Push to GitHub, connect the repo to Vercel, add Supabase env vars.
