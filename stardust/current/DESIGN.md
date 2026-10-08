---
name: Lowe's Home Improvement — current state
description: Descriptive snapshot of https://main--lowes--jgrosskurth.aem.live/ (home), captured 2026-10-08 by stardust:extract --single
colors:
  background: "#ffffff"
  text-primary: "#17191f"
  interactive-blue: "#0072ce"
  interactive-blue-hover: "#005ba5"
  action-green: "#007a33"
  action-green-hover: "#004b1d"
  action-green-subdued: "#d4f7e3"
  brand-navy: "#012169"
  surface-subdued: "#f4f6fa"
  image-well: "#fafafa"
  action-red: "#971b2f"
  border-strong: "#616670"
  border-subdued: "#cbd1dd"
  rating: "#f3b51b"
typography:
  section-title:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "normal"
  rail-title:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
  card-title:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  body:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  small:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "24px"
  micro:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
rounded:
  sm: "2px"
  md: "4px"
  cta: "6px"
  lg: "8px"
  pill: "20px"
  circle: "128px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "56px"
  section-gap: "32px"
  gutter: "56px"
components:
  button-add-to-cart:
    backgroundColor: "{colors.background}"
    textColor: "{colors.action-green}"
    rounded: "{rounded.cta}"
    height: "48px"
  button-outline-blue:
    backgroundColor: "{colors.background}"
    textColor: "{colors.interactive-blue}"
    rounded: "{rounded.lg}"
    height: "44px"
  pill:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    height: "40px"
  pill-active:
    backgroundColor: "{colors.interactive-blue}"
    textColor: "{colors.background}"
    rounded: "{rounded.pill}"
    height: "40px"
  search-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    height: "48px"
  utility-bar:
    backgroundColor: "{colors.brand-navy}"
    textColor: "{colors.background}"
    height: "32px"
  save-badge:
    backgroundColor: "{colors.action-green}"
    textColor: "{colors.background}"
    typography: "{typography.micro}"
---

_provenance: written by stardust:extract at 2026-10-08T15:40:00Z against https://main--lowes--jgrosskurth.aem.live/ (--single). Descriptive, not a target. Read: `_brand-extraction.json`, `pages/home.json`, live CSS custom properties._

# Design System: Lowe's Home Improvement (current)

## Overview

A dense, white-ground retail homepage set entirely in Fellix (400 / 600). A 148px three-row header (navy utility bar, logo + store selector + search + tools, 13-item department nav) sits over 13 stacked sections separated by a flat 32px gap with no section padding and no background bands. Seven of the 13 sections scroll horizontally. Merchandising is authored as finished raster artwork — the page's biggest type (deal numerals, promo headlines) lives inside images; the largest live heading is 28px.

## Colors

### Primary
- **Interactive blue `#0072ce`** — links, active pill, carousel scroll thumbs, arrow glyphs, tab underline. 92 text uses, 5 fills.

### Secondary
- **Action green `#007a33`** — Add to Cart outline buttons (13), Save-% text and badges. The commerce action color.

### Tertiary
- **Brand navy `#012169`** — logo fill and the 32px utility bar only (≈0.7% of ground area). Deal-panel titles in navy (3).
- **Action red `#971b2f`** — "New" nav badge, "This item is currently unavailable" notes.

### Neutral
- `#ffffff` ground; `#17191f` text; `#f4f6fa` subdued surface (nav row, weather widget); `#fafafa` product image wells; `#616670` strong border (search, pills); `#cbd1dd` subdued border (deal panels); `#f3b51b` rating stars.

Declared but not rendered: `--brand-blue #004990`.

## Typography

Fellix only (heading = body family), served from www.lowescdn.com. Weights 400 and 600 (700 resolves to the SemiBold file).

### Hierarchy
- Section title (h2) 28/40 600 — "Popular Categories", "Explore More for Your Home & Community".
- Rail title (h3) 24/32 600 — "Find Your Next Project", "Items To Explore", "Plan your day…" (at 80% opacity).
- Card title (h4 / small h3) 16/24 600.
- Body 16/24 400; small 14/24; micro 12/16 600 (badges, chips).
- Scale is ad-hoc (28 → 24 → 16; ratios 1.17, 1.5). Token `--heading-font-size-xxl: 40px` is declared but no live heading uses it. No `<h1>`.

## Layout

1440 viewport, 56px gutters → 1328px content. Sections stacked with 32px margin, zero padding, no alternating grounds. Grids: 5-up promo cards, 4-up category tiles, 8×3 department icon grid, 4-up article cards, 3-up deal panels. Rails: search pills, hero carousel, article rail, product carousel, project carousel, tabbed product carousel.

## Elevation & Depth

Flat. Shadows appear only on the circular carousel arrow buttons (Material-style triple shadow) and as a 1px blue tab underline.

### Shadow Vocabulary
- Arrow button: `rgba(0,0,0,.2) 0 2px 4px, rgba(0,0,0,.14) 0 4px 5px, rgba(0,0,0,.12) 0 1px 10px`.

## Shapes

8px is the dominant radius (123 elements: search, buttons, images). 6px on Add to Cart (31), 20px pills (27), circles for arrows (14), 4px on chips/panels (13). Four small-radius values in use.

## Components

### Buttons
- **Add to Cart** — white, 1px green border, green 16px/600 text, 6px radius, 48px tall.
- **Outline blue** ("Shop All") — white, 1px blue border, 8px radius.
- **Text links** ("Shop Now", "Learn More", "Read Article", "Get Details") — blue, underlined, optional leading glyph.

### Chips
- Search / category pills — 40px, 20px radius, 1px `#616670` outline; active = blue fill, white text.
- Velocity chip ("1K+ bought last week") — `#f4f6fa` fill, 12px.
- Save-% badge — green fill, white 12px, 8px-0 corner radius.

### Cards / Containers
- Product card — `#fafafa` image well, brand bold + name 2-line clamp, superscript price, was-price strike, Save %, star rating + count, velocity chip, Add to Cart.
- Deal panel — 1px `#cbd1dd`, 4px radius, title + "View All".
- Promo / article / category cards — raster artwork with baked copy; live link only.

### Inputs / Fields
- Search — 48px, 1px `#616670`, 8px radius, placeholder "What can we help you find?", search + visual-search icons.

### Navigation
- Utility bar (navy, 32px) → main bar (logo, store selector on `#e5e9f1`, search, AI Assist, Sign In, Cart) → department row (Shop All, Services, Deals, Design & Ideas, $99 Maintenance + New badge, 8 departments, Fall Inspo).

### Weather widget (signature component)
- 390px `#f4f6fa` panel "Your Local Weather"; store-gated empty state "Set your store to see the weather forecast for your area." beside a 10-card article rail with a blue progress scrollbar.

## Do's and Don'ts

Descriptive mode — see `brand-review.html § Tensions` for the decision agenda instead of prescriptions.
