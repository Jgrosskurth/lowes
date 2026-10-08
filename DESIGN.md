---
name: Lowe's Home Improvement — target system
description: Brand-faithful refresh of the Lowe's homepage (Mode A) — shared system for variants A, B, C
colors:
  ground: "#ffffff"
  ink: "#17191f"
  ink-soft: "rgb(23 25 31 / 80%)"
  lowes-blue: "#0072ce"
  lowes-blue-deep: "#005ba5"
  cart-green: "#007a33"
  cart-green-deep: "#004b1d"
  cart-green-pressed: "#003113"
  cart-green-tint: "#d4f7e3"
  lowes-navy: "#012169"
  mist: "#f4f6fa"
  well: "#fafafa"
  store-chip: "#e5e9f1"
  signal-red: "#971b2f"
  rule: "#cbd1dd"
  rule-strong: "#616670"
  star: "#f3b51b"
typography:
  display-numeral:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "96px"
    fontWeight: 600
    lineHeight: "0.9"
    letterSpacing: "-0.02em"
  display:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: "64px"
    letterSpacing: "-0.01em"
  heading-xl:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: "48px"
  heading-l:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "36px"
  heading-m:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
  price:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "28px"
  body:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-sm:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  micro:
    fontFamily: "fellix, fellix-fallback, arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
rounded:
  primary: "8px"
  sm: "4px"
  md: "8px"
  pill: "20px"
  circle: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "56px"
  section: "48px"
  gutter: "56px"
components:
  button-cart:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.cart-green}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 16px"
  button-cart-hover:
    backgroundColor: "{colors.cart-green}"
    textColor: "{colors.ground}"
    rounded: "{rounded.md}"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.lowes-blue}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 20px"
  link:
    textColor: "{colors.lowes-blue}"
    typography: "{typography.body}"
  pill:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 16px"
  pill-active:
    backgroundColor: "{colors.lowes-blue}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    height: "40px"
  input:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "48px"
  badge:
    backgroundColor: "{colors.cart-green}"
    textColor: "{colors.ground}"
    rounded: "{rounded.sm}"
    typography: "{typography.micro}"
  card:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.md}"
    padding: "16px"
  utility-bar:
    backgroundColor: "{colors.lowes-navy}"
    textColor: "{colors.ground}"
    height: "32px"
---

<!-- _provenance: writtenBy stardust:direct (via stardust:uplift) · writtenAt 2026-10-08T16:10:00Z · mode Mode A (brand-faithful) · readArtifacts: stardust/current/_brand-extraction.json, stardust/current/DESIGN.md, stardust/direction.md, stardust/uplift-improvements.md · sidecar DESIGN.json. Per-variant overrides in DESIGN-A/B/C.md. -->

# Design System: Lowe's Home Improvement (target)

## Overview

Lowe's homepage as a well-run aisle: every offer in live Fellix type, every department visible at a glance, the search and the store always one reach away. White ground, navy chrome, blue for wayfinding, green only for the cart. Dense on purpose — a big-box retailer's homepage is inventory — but ordered: one H1, one section-title style, grids before rails.

## Colors

All values inherited from the captured surface (Mode A). Role names are brand-native.

### Primary
- **Lowe's Blue `#0072ce`** — wayfinding: links, active pill, tab indicator, focus ring, arrow glyphs. 4.89:1 on ground, 4.52:1 on mist. Deep `#005ba5` on hover.

### Secondary
- **Cart Green `#007a33`** — commerce action only: Add to Cart, Save %, deal badges. 5.48:1 on ground. Deep `#004b1d` hover, pressed `#003113`, tint `#d4f7e3`.

### Tertiary
- **Lowe's Navy `#012169`** — logo, utility bar, footer band. White on navy 14.76:1.
- **Signal Red `#971b2f`** — "New" badge, unavailable / final-day notes. Never a CTA.

### Neutral
- Ground `#ffffff`, Ink `#17191f`, Ink-soft (80% ink), Mist `#f4f6fa` (nav row, store/weather panel, chips), Well `#fafafa` (product image wells), Store-chip `#e5e9f1`, Rule `#cbd1dd`, Rule-strong `#616670` (inputs, pills), Star `#f3b51b` (rating glyphs only).

### Named Rules
- **Green Means Cart.** `cart-green` appears only on commerce actions and savings.
- **Navy Frames.** Navy is chrome (top bar, footer band), never a card fill.

## Typography

Fellix only (static Regular 400 + SemiBold 600 from www.lowescdn.com). Committed scale: display 56/64 → heading-xl 40/48 → heading-l 28/36 → heading-m 20/28 → body 16/24 → body-sm 14/20 → micro 12/16 (ratios 1.40, 1.43, 1.40, 1.25).

### Hierarchy
- **H1** — the hero offer headline; its offer numeral takes the hero-only display-numeral step (96px), restoring the scale the brand's own promo art used.
- **H2** — every section title, heading-l. One style.
- **H3** — card and panel titles, heading-m or body 600.
- Prices: superscript `$` and cents around a 24px dollar figure (captured treatment).

### Named Rules
- **Say It In Type.** Offer numerals, headlines, qualifiers and end dates are live text. Images carry photography and product cutouts only.

## Layout

1328px content (1440 − 2×56px gutters, captured). 12-column grid, 24px gap. Section rhythm 48px (balanced, commercial-tightened; multi-audience floor 40–64px). Mobile gutter 16px. Grids by default: promo 4-up, departments 8-up, articles 4-up, projects 3-up; one horizontal product rail (Gift Zone). No auto-rotation anywhere.

## Elevation & Depth

Flat by default. Depth only on interactive affordances: the circular icon button shadow (captured), a 2px lowes-blue tab indicator, hover lift on cards in variant C.

### Shadow Vocabulary
- icon-button: `rgba(0,0,0,.2) 0 2px 4px, rgba(0,0,0,.14) 0 4px 5px, rgba(0,0,0,.12) 0 1px 10px`.

## Shapes

8px everywhere (containers, buttons, inputs, images). 20px pill for chips and tabs. Circle for icon buttons. 4px only for the Save-% badge. (Resolves tension T-radius-vocab: 6px and stray 10/12px retired.)

## Components

### Buttons
- **Add to Cart** — ground fill, 1px cart-green border, cart-green 16/600 text, 48px, 8px radius; hover fills green.
- **Outline** — ground fill, 1px lowes-blue border, blue text, 44px.
- **Links** — lowes-blue, 1px underline at 3px offset; "Shop <object>" / "Read <object>" / "See all <object>" / "Offer details".

### Chips
- Pills 40px, 20px radius, 1px rule-strong; active = lowes-blue fill. Velocity chip on mist, micro type. Save-% badge on cart-green.

### Cards / Containers
- Product card: well image, brand bold + name (2-line clamp), price, was-price, Save %, rating + count, velocity chip, Add to Cart.
- Promo tile: captured photo, live offer text, one link.
- Panel: 1px rule, 8px radius, 24px padding.

### Inputs / Fields
- Search: 48px, 1px rule-strong, 8px radius, 2px lowes-blue focus ring with 2px offset.

### Navigation
- Header router: navy utility bar (32px) → main bar (logo, store selector, search, AI Assist, Sign In, Cart; sticky) → department row. Mobile: burger + logo + icons, then store + search full width.
- Footer: navy band, columns built from captured nav labels; legal line as placeholder until Lowe's copy is supplied.

## Do's and Don'ts

### Do:
- Reuse captured images at their semantic position (hero stays hero).
- Keep search + store in the first viewport at every breakpoint.
- Keep Add to Cart on every product card.
- Label sponsored inventory "Sponsored".

### Don't:
- Bake copy into banners.
- Auto-rotate the hero or hide content behind arrow buttons when a grid fits.
- Invent stats, store data, weather, testimonials or legal copy.
- Introduce colors or fonts outside the captured surface; no gradients, no glass.
