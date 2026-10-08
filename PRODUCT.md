<!-- _provenance: writtenBy stardust:direct (via stardust:uplift) · writtenAt 2026-10-08T16:05:00Z · againstInput "uplift presales redesign — three variants per stardust/direction.md" · mode: Mode A target, shared across variants A/B/C · readArtifacts: stardust/current/PRODUCT.md, stardust/current/_brand-extraction.json, stardust/direction.md, stardust/uplift-improvements.md -->

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Register

brand — the Lowe's Home Improvement homepage: a merchandising landing page with embedded commerce (Add to Cart, ratings, prices). Inherited from `stardust/current/PRODUCT.md`.

## Users

<!-- _provenance: inferred — basis: captured nav, utility links and section copy -->

- **DIY homeowners and renters** planning a project — the page's helper voice ("Plan your day and your next project!", "Find Your Next Project").
- **Deal shoppers** — seasonal and category offers, Save-% deals, Gift Zone.
- **Pros** — Lowe's PRO in the utility bar, myLowe's Pro Rewards.
- **Members and credit holders** — MyLowe's Money, MyLowe's Rewards, Lowe's Credit Center.
- **Service buyers** — Home Care+ ($99 Maintenance), installation services.

## Product Purpose

Get every visitor from the homepage to the right aisle fast — a search, a store, a deal, a department or a project — and let them add a product to cart without leaving the page. Scope: one homepage; header search, store context and the department router stay the spine.

## Positioning

The one homepage that pairs a national deal calendar with the local store (store selector, local weather for project planning) and the how-to content to finish the job.

## Brand Personality

<!-- _provenance: inferred — basis: captured voice samples and layout primitives; carried from stardust/current/PRODUCT.md -->

- **Practical-helpful** — plain, second-person helper copy; how-to content beside products.
- **Transactional / modular-catalogue** — tiles, cards, pills and product cards are the vocabulary.
- **Deal-forward** — offer numerals are the loudest thing Lowe's says.
- **Seasonal** — the page turns with the calendar (fall, Halloween, holiday).
- **Community-minded** — first-responder thanks, community impact; secondary voice.

## Anti-references

- Generic-2026-SaaS landing silhouette (oversized sans hero + solid/outline CTA pair + sticky nav + serial footer).
- Luxury / editorial-airy retail (96px+ section padding, serif display, sparse grids).
- Editorial vocabulary on a commerce brand ("the journal", "field guide", "atelier").
- Invented proof: trust bars, stat rows, testimonials or store data not present on the captured page.
- Dark-mode "tech" commerce.

## Design Principles

1. **Say the offer in type, not pixels** — every promotional claim is live, searchable Fellix text (expressive axis).
2. **Show the aisle, don't hide it** — default to visible grids; a horizontal rail must earn its place (density / distinctiveness).
3. **Search and store stay first** — the header router (search, store, Pro, credit, cart) is the page's spine in every variant (IA priority).
4. **One voice per job** — "Shop …" for commerce, "Read …" for content, Add to Cart for the cart (tone).
5. **Motion explains the grid** — where motion appears it shows structure (cascade, lift, indicator), never decorates (variant C).

## Evidence on Hand

- Captured on 2026-10-08 from https://main--lowes--jgrosskurth.aem.live/: 111 images (`stardust/current/assets/media/`), logo SVG, favicon, Fellix Regular/SemiBold, 28 product cards with real names, prices, Save %, ratings and velocity chips, 24 departments, 10 how-to projects.
- Absent — do not fabricate: live weather data, store names/addresses, testimonials, Lowe's legal footer copy, any hero tagline beyond the promo copy recorded in image alt text.

## Accessibility & Inclusion

WCAG 2.2 AA as the floor: one H1, ordered headings, live text for all offers (alt text preserved for images), 4.5:1 text contrast (captured `#0072ce` on white = 4.89:1, on `#f4f6fa` = 4.52:1; `#007a33` on white = 5.48:1; `#17191f` on white = 17.57:1), `prefers-reduced-motion` neutralises all motion (variant C).
