---
_provenance:
  writtenBy: stardust:extract
  writtenAt: 2026-10-08T15:40:00Z
  againstInput: https://main--lowes--jgrosskurth.aem.live/ --single
  mode: descriptive (current state, not target)
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - stardust/current/assets/screenshots/home.png
  synthesizedInputs:
    - Users, Brand Personality, Anti-references, Design Principles are inferred from captured copy and layout (marked inferred below)
---

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Register

brand — a merchandising / marketing landing page (promo hero, deals, category entry points, no authentication). It carries heavy product-catalogue texture (Add to Cart, ratings, prices, tabbed product rails), so it sits at the brand end of the register with commerce widgets embedded. Source: `_brand-extraction.json#register`.

## Users

_provenance: inferred — basis: captured nav, utility links and section copy._

- **DIY homeowners and renters** planning projects: "Plan your day and your next project!", "Find Your Next Project" (10 how-to cards), "Start a New DIY Project", "Home Improvement Projects Made Easy".
- **Deal-seeking shoppers**: sponsored DEWALT Days banner, "Up to 35% off Select Major Appliances", "Top Trending Deals", "We Picked These Deals for You", Save-% badges.
- **Pros**: "Lowe's PRO" in the utility bar; myLowe's Pro Rewards lockup in the hero tile.
- **Loyalty / credit members**: MyLowe's Money Days (utility bar + hero tile), Lowe's Credit Center.
- **Service buyers**: "$99 Maintenance" (Home Care+ subscription), blinds installation, "Services" nav.

## Product Purpose

The Lowe's Home Improvement homepage: route shoppers from one surface into departments, deals, seasonal promotions, services and DIY content, and let them start a search or add a product to cart directly. Meta description: "Shop tools, appliances, building supplies, carpet, bathroom, lighting and more. Pros can take advantage of Pro offers, credit and business resources."

## Brand Personality

_provenance: inferred — basis: captured voice samples, tone guess `professional-warm`, layout primitives._

- **Practical-helpful** — second-person helper copy ("Plan your day and your next project!", "Find great gifts for everyone on your list"), how-to content ("How to Repair Cracked Concrete").
- **Transactional / modular-catalogue** — the page is a stack of tiles, cards, pills and product carousels; 13 Add to Cart buttons, 24 department tiles, 4 category tiles, 3 deal panels.
- **Deal-forward** — big numerals live in the promos ("35% off", "$99 a year", "Up to 65% off"), Save-% badges, was-prices.
- **Seasonal** — Fall Inspo, Holiday Decorations, Halloween DIY, Gift Zone.
- **Community-minded (margin tone)** — "Thank you, first responders.", "Discover Lowe's Community Impact" — present but only inside raster cards.

## Anti-references

_provenance: inferred._

- Luxury / editorial-airy retail (generous whitespace, serif display) — the brand is utilitarian and dense.
- Dark-mode "tech" commerce — the captured ground is white with a navy utility bar.
- Playful illustration-led DIY brands — Lowe's imagery is product cutouts + real-home photography.

## Design Principles

_provenance: inferred — descriptive of what the current page optimizes for._

1. Every section ends in a shopping action (Shop Now / Add to Cart / Learn More).
2. Search and store context are first-class: search field + "Find a Store Near Me" in the header, recommended searches directly beneath.
3. Merchandising is image-led: offers are authored as finished raster artwork.
4. Breadth over depth: 13 sections, 7 of which scroll horizontally to fit more inventory.

## Evidence on Hand

- 111 captured images (`stardust/current/assets/media/`), all resolve; 12 have empty alt (decorative SVG icons); merchandising rasters carry descriptive alt text.
- Logo: `stardust/current/assets/logo.svg` (navy #012169 house mark, 72×72). Favicon: `stardust/current/assets/favicon.ico`.
- Brand font files: Fellix Regular / SemiBold (`stardust/current/assets/fonts/`, from www.lowescdn.com, licensing private).
- Real product data on the page: names, prices, was-prices, Save %, rating counts, purchase-velocity chips ("1K+ bought last week").
- **Absences future work must not fabricate:** no testimonials, no store addresses, no live weather data (widget is store-gated and empty), no Lowe's footer content (footer is AEM boilerplate with an Adobe copyright), no hero tagline in live text.

## Accessibility & Inclusion

No product-specific standard captured. Observed: no `<h1>` on the page; most promotional copy exists only as image pixels + alt text.
