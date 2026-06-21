# Project Handoff — Ramilography Marketing System

_Use this to continue in a new session started on the correct repo
(`ramilography`, or a new `ramilography-marketing` repo). Paste the summary
section into the new chat so it can pick up with full context._

---

## Who & what
- **Client:** Ramil (ramil.namazov@gmail.com), photography side hustle.
- **Website:** ramilography.com (Next.js app on Git + Vercel).
  - Website repo: `ramilnamazov/Ramilography` — **now connected** to the working
    session. `main` → production (ramilography.com); feature branches → previews.
  - Active work branch: `claude/ramilography-marketing-rg3c2u`.
- **Goal:** Build a full marketing + ops system so one person + an AI agency can
  run ads, website, content, automated posting, and lead follow-up.
- **Role split:** Ramil = photographer + approver. AI = strategy, production, dev, ops.

## Locked decisions
- **Primary goal:** All of it — bookings (first priority), audience, email list,
  products (later). Sequence: bookings → audience/list as byproduct → products.
- **Niches:** Everything EXCEPT weddings. Target money-makers: portraits/family,
  branding/product/food, real estate/spaces. **Sports stays** as a core offer.
- **Budget:** Organic first; start paid ads later based on results.
- **Market:** New Jersey primary; NYC reachable; will travel if worth it or if
  client pays a travel fee; national is opportunistic/inbound.
- **Brand:** Keep the premium, cinematic positioning — "Sculpting with light.
  Defining with shadow." Umbrella art brand + dedicated service pages underneath.

## Business facts gathered
- **Live pricing (from /book):** Consultation free (15 min); Portraits from $200;
  Couples from $250; Family from $275; Events from $300; Sports from $275.
  $50 non-refundable deposit; balance at session. Contact = Instagram DM only.
- **Pricing is variable** by hours booked and number of edited photos; "from $X"
  is the entry point.

## Website audit (CORRECTED 2026-06-21 after reading the code)
The first audit was an outside guess and was wrong on several points. Reality:
the site already has Cal.com booking, Stripe deposits, full pricing tables,
package inclusions (duration + # images), location (Newark NJ + schema), schema
markup, OG images, robots + sitemap. See `website-audit.md` for the full rewrite.

**Real gaps that remained:**
1. ✅ Homepage was nearly empty (hero image + quote only) — **REBUILT** (see below).
2. ✅ No analytics/Meta Pixel — **ADDED** env-driven GA4 + Pixel scaffold (see below).
3. ⬜ No testimonials/reviews → no trust signal (needs content from Ramil).
4. ⬜ No `/about` page (needs a photo + bio).
5. ⬜ Branding/product/food + real-estate service pages don't exist and have no
   photos — strategic decision + assets needed before building.

## Work completed (2026-06-21)
- **Homepage rebuilt** (`pages/index.js` + `styles/CinematicMockup.module.css`):
  kept the cinematic animated hero, added a NJ/NYC positioning line + a primary
  "Book a Session" CTA in the hero, a "What I Shoot" service-tile row
  (auto-generated from `public/images/*` folders), a featured-work strip, and a
  closing CTA. Home title/description/schema now include New Jersey & NYC.
  Footer now renders on the homepage.
- **Analytics scaffold** (`components/Analytics.js`, wired in `pages/_app.js`):
  GA4 + Meta Pixel driven by env vars `NEXT_PUBLIC_GA_ID` /
  `NEXT_PUBLIC_FB_PIXEL_ID`, with SPA route-change pageview tracking. No-ops
  (renders nothing) until the IDs are set, so it was safe to ship immediately.
- Status: committed + pushed to `claude/ramilography-marketing-rg3c2u`.
  **Not yet merged to `main`**, so not live on ramilography.com yet — awaiting
  Ramil's review of the Vercel preview.

## Recommended site structure
`/` (brand hero + niche tiles + featured work + proof + CTA), `/portraits`,
`/branding`, `/real-estate`, `/portfolio`, `/about`, `/contact` (working form).
Each service page: own headline, gallery, "who it's for," "from $X," inquiry CTA.

## Roadmap (phases)
0. Foundation (brand/strategy, claim+optimize Google Business Profile)
1. Convert (website fixes, GA4 + Search Console + Meta Pixel, fast inquiry replies, local SEO)
2. Content engine (pillars, monthly calendar, automated scheduling via free Meta Business Suite)
3. Paid ads (start with retargeting + local lead ads, once funnel converts)
4. Follow-up & retention (reviews, referrals, light email list, reactivation)
5. Measure monthly (inquiries, bookings, revenue, spend → do more/less)

## Files produced (in fleetpatch:marketing/ — recreate in new repo)
- `README.md` — system overview + diagram
- `00-intake-brand-brief.md` — fill-in intake form (still mostly blank)
- `01-access-checklist.md` — accounts/access needed + safe-sharing steps
- `strategy.md` — locked decisions + positioning per niche
- `website-audit.md` — prioritized fix list
- `offers-pricing.md` — live pricing + gaps + variable-pricing decision
- `roadmap.md` — phased plan

## OPEN QUESTIONS / still needed from Ramil
1. **Review the homepage preview + decide to merge to `main`** (go live).
2. **Tracking IDs:** GA4 Measurement ID (`G-XXXX`) and/or Meta Pixel ID — to set
   as Vercel env vars and turn analytics on.
3. **Testimonials/reviews** (screenshots fine) for a social-proof section.
4. **About page** content: a photo + a few lines of bio.
5. **Branding/Real-estate niches:** approve building those service pages, and
   provide sample photos (5–8 each) — no assets exist yet.
6. **Google Business Profile** — add AI as Manager (highest free ROI; not yet done).
7. **Fill in the brand brief** (`00-intake-brand-brief.md` — still mostly blank).

## Immediate next actions
- Get Ramil to preview the rebuilt homepage, then merge branch → `main` to go live.
- Once tracking IDs arrive: set `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_FB_PIXEL_ID`
  in Vercel → analytics live, no code change.
- Then: testimonials section, `/about` page, optional tile deep-links.
- Optimize Google Business Profile in parallel (free, high impact).
