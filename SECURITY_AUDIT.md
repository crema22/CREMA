# Security & Implementation Status — Crema Clubhouse

**Last verified:** by running `npm run type-check` and `npm run build` against this
exact codebase. Everything under "Implemented" was checked in a build, not assumed.

The previous version of this document claimed work that did not exist —
middleware, live Whop verification, private checkout logic, and a passing build.
That was wrong. This version separates what is actually in the code from what
still needs building.

---

## Implemented and verified

| # | Item | Notes |
|---|------|-------|
| 1 | Supabase SSR auth | Separate browser / server / service-role clients. No manual cookie parsing. |
| 2 | Auth middleware | `middleware.ts` refreshes the session on every request. Registered in the build output. |
| 3 | `/account` protected server-side | Middleware redirects unauthenticated users to `/login?next=…` before the page renders. |
| 4 | Single membership fetch | One `MembershipProvider` at the root layout. The nested provider in `ProductCardWrapper` has been deleted. |
| 5 | Service-role browser guard | `createServiceRoleClient()` throws if `typeof window !== 'undefined'`. |
| 6 | Private commerce fields separated | `regular_checkout_id`, `clubhouse_checkout_id`, `cj_sku` moved to `product_commerce`, RLS on with **no policies** — unreachable by anon/authenticated. Requires running `migration-01-private-commerce.sql`. |
| 7 | No fake checkout URLs | Both checkout routes return a structured `503 not_configured`. Nothing redirects a customer to a non-existent Whop page. |
| 8 | Server-side price reads | Checkout routes read prices from the database by `productId`. Client payloads cannot set a price. |
| 9 | Request validation | `productId` is validated as a UUID before any query. |
| 10 | No hard-coded catalogue prices | The homepage savings strip is now derived from a Supabase query. |
| 11 | Orders RLS | Users may `SELECT` their own orders only. No user `INSERT`/`UPDATE`/`DELETE`. |
| 12 | Webhook idempotency groundwork | Partial UNIQUE index on `orders.whop_payment_id`, plus a `webhook_events` table keyed on `(provider, event_id)`. |
| 13 | Unsupported claims removed | Free shipping, early access, 30-day guarantee, specific shipping/returns windows all removed. |
| 14 | Legal pages marked draft | Terms and Privacy no longer carry a dynamic `Last updated` date. |

---

## Not implemented — requires Whop

These are **not** security guarantees today. They are the work remaining.

| # | Item | Status |
|---|------|--------|
| A | Live Whop membership verification | **Not built.** `/api/checkout/clubhouse` returns 503. The authorization rule is documented in the route as a TODO: discounted pricing must be authorized by a live Whop API call, never by `customer_profiles.membership_status`, which is a display cache and goes stale on cancellation or failed payment. |
| B | Whop webhook handler | **Not built.** No `/api/webhooks/whop` route exists. `customer_profiles` is therefore never populated, so every user currently resolves as a non-member. |
| C | Order creation | **Not built.** The `orders` table is empty and nothing writes to it. |
| D | Webhook signature verification | **Not built.** Must verify Whop's signature header before trusting any payload. |

---

## Known gaps not yet addressed

Real issues, deliberately deferred. Not claimed as done.

- **Security headers** — no CSP, `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or HSTS configured.
- **Rate limiting** — magic-link login, membership-status and checkout endpoints are all unthrottled. Login in particular can be used to send mail to arbitrary addresses.
- **Images** — still `<img>` with `images.unoptimized: true`. Not using `next/image`.
- **Fonts** — Manrope still loads via CSS `@import` rather than `next/font`.
- **Caching** — catalogue pages are dynamic because the root layout reads auth state. They could be cached with membership layered on separately.
- **SEO** — no sitemap, robots, canonical or OpenGraph metadata. Product pages render a custom "not found" block rather than using `notFound()`.
- **Accessibility** — focus states and gallery keyboard access added; mobile menu `aria-expanded` and a full tap-target audit are outstanding.

---

## Required manual step

`migration-01-private-commerce.sql` **must be run in the Supabase SQL Editor.**
Until it is, `regular_checkout_id`, `clubhouse_checkout_id` and `cj_sku` remain
readable by anyone holding the anon key — which is public by design, since it
ships in the browser bundle.

Verify afterwards:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('regular_checkout_id','clubhouse_checkout_id','cj_sku');
```

Zero rows means the migration worked.

---

## Honest summary

The foundation is sound: auth, session refresh, RLS, server-side price reads,
and no fake checkout paths. **The commerce layer does not exist yet.** Nothing
can currently take a payment, and no user can become a member. That is the
correct state before Whop — but it should not be mistaken for a working store.
