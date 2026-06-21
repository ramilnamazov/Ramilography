# Website Audit — ramilography.com

_Originally drafted 2026-06-20 from an outside view. **Rewritten 2026-06-21
after reading the actual site code** (repo `ramilnamazov/Ramilography`, now
connected). Several claims in the first draft were wrong — corrected below._

The site is a Next.js app on Vercel. `main` → ramilography.com (production);
feature branches → Vercel preview URLs.

## ✅ Correction notice — the first audit was guessing

The original audit was written before I could see the code and got several
things wrong. For the record, here's what's **actually already on the site**:

- **Booking is real and good.** Cal.com scheduling (`cal.com/ramilography`) per
  session type, plus **Stripe** `$50` deposit checkout links per package.
- **Pricing is fully published.** A `/book` page (expandable pricing per
  session) and a `/pricing` page with a duration→images→price table, **add-ons**
  (rush delivery, extra person, NJ sales tax), and a **travel-fee table** from
  Newark, NJ.
- **Location is present.** Footer ("New Jersey, USA"), schema
  (`areaServed: New Jersey`), and "From Newark, NJ" on pricing.
- **Schema markup exists** on multiple pages: `ProfessionalService` (home),
  `ContactPage` (contact), `CollectionPage` (portfolio).
- **Contact has multiple channels** — email, phone, Instagram, plus the booking
  flow. (The first audit's "Instagram DM only" was false.)
- **SEO basics present:** per-page titles/descriptions, OpenGraph + Twitter
  cards, a dynamic OG image (`/api/og`), `robots.txt`, and `sitemap.xml`.

So the starting point was much stronger than the first draft implied.

## What's genuinely strong
- Distinctive premium brand voice ("Sculpting with light. Defining with shadow.")
  with a rotating set of cinematic one-liners.
- Cinematic dark design system, custom fonts (Bodoni Moda + Manrope), tasteful
  Framer Motion animation.
- A polished, filterable portfolio with a full lightbox (keyboard + swipe).
- Transparent, well-structured pricing — better than most working pros show.

## The real gaps (what was actually worth fixing)

### 🔴 Done — shipped 2026-06-21 (on branch, pending go-live)
1. **The homepage was nearly empty.** It rendered only a fullscreen hero image +
   a rotating quote — no statement of what he shoots, no location, no featured
   work, and **no CTA button in the hero** (only the nav). → **Rebuilt** into a
   real landing page: hero now adds a "New Jersey & NYC" positioning line + a
   primary "Book a Session" CTA, followed by a "What I Shoot" service-tile row
   (auto-generated from the image folders), a featured-work strip, and a closing
   CTA. Home title/description/schema updated to include NJ & NYC for local SEO.
2. **No analytics or tracking at all** (no GA4, no Meta Pixel). → **Added** an
   env-driven `Analytics` component (GA4 + Meta Pixel, with SPA pageview
   tracking). It's dormant until the IDs are set, so it's safe to ship now.

### 🟡 Open — still worth doing
3. **No testimonials / social proof** anywhere. → Add 3–5 client quotes (a home
   section + maybe a dedicated block) and wire up a one-tap Google review link.
   _Needs: real testimonials from Ramil._
4. **No `/about` page.** A face, a short story, and "why me" build trust fast for
   a premium brand. _Needs: a photo + a few lines of bio._
5. **Tracking IDs not yet provided.** Analytics goes live the moment we set
   `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_FB_PIXEL_ID` in Vercel.

### 🟢 Polish / later
6. **Deep-link the "What I Shoot" tiles** to a pre-filtered portfolio view
   (click "Family" → portfolio already filtered to family). Small enhancement.
7. **Lead capture / email list** (e.g. "NJ mini-session dates" or a brand-shoot
   guide) to catch visitors not ready to book.
8. **Image optimization** — portfolio currently uses plain `<img>`; could move to
   `next/image` for responsive sizes and faster loads.

## Bigger strategic question (not a quick code fix)
The strategy doc targets **branding/product/food** and **real estate/spaces** as
money-makers, but the live site's services are portraits / couples / family /
events / sports, and there are **no photos** for those new niches. Standing up
`/branding` and `/real-estate` service pages needs sample work first. Decision +
assets required before building.

## Current page structure (live)
```
/           home — REBUILT: hero + positioning + CTA + service tiles + featured + CTA
/portfolio  filterable gallery + lightbox (strong)
/book       session types with expandable pricing + Cal.com + Stripe deposit
/pricing    full pricing tables + add-ons + travel fees
/contact    email / phone / Instagram + booking CTA
```
Not yet built: `/about`, `/branding`, `/real-estate`.
