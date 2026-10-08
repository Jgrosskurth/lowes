---
_provenance:
  writtenBy: stardust:uplift
  writtenAt: 2026-10-08T15:52:00Z
  againstInput: https://main--lowes--jgrosskurth.aem.live/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/home.json
    - stardust/current/brand-review.html
    - stardust/current/PRODUCT.md
  referencesUsed:
    - source: webfetch
      title: Target homepage
      url: https://www.target.com/
      grounds: "B's compositional anchor — oversized live deal numerals ('30%', '$100', 'BOGO50') as the visual lead of deal cards, sans-serif hierarchy, numerals as structural voice"
      tag: off-toolbox
    - source: webfetch
      title: IKEA US homepage
      url: https://www.ikea.com/us/en/
      grounds: "C register check — big-box home retail uses motion as interface behaviour (video hero with pause control, skip-able product carousels), not scroll-cinema; supports a UI-transition register (kinetic-grid) over parallax-led arrival / editorial"
      tag: off-toolbox
    - source: webfetch
      title: Best Buy homepage
      url: https://www.bestbuy.com/
      grounds: "C register check — category browsing as a fixed 24-tile grid; the grid is the protagonist, which is what kinetic-grid choreographs"
      tag: off-toolbox
  cinematicRegister:
    picked: kinetic-grid
    registerSource: heuristic
    rationale: "PRODUCT.md Brand Personality lists 'Transactional / modular-catalogue' (13 Add to Cart, 24 department tiles, 4 category tiles, 3 deal panels, 28 product cards) → motion-registers.md § Selection heuristic row `transactional OR modular-catalogue` → kinetic-grid. No other row matches (no civic-formal, no signage/monogram, no operational dashboard claim, no editorial pacing). kinetic-grid's refuses list (page parallax, letter-by-letter reveals, tickers) conflicts with no captured trait."
    secondChoice: arrival (ambiguous-default row)
---

# "What if…" candidates — https://main--lowes--jgrosskurth.aem.live/

## Picked

### Variant C · Motif vocabulary swap (#8)
Source: catalog
What if: "What if Lowe's tile grid — the department grid, the category tiles, the deal panels — became the moving part of the page, instead of rails that slide content out of sight?"
Cinematic register: kinetic-grid
Evidence: `_brand-extraction.json § motifs.patterns` — the dominant primitive is the horizontal rail (`motifs.carouselShare`: 7 of 13 sections scroll horizontally — pills, hero, weather rail, Gift Zone, project carousel, tabbed product carousel); the alternate primitive, the static tile grid, appears in only three sections (`department-icon-grid` 24 tiles 8×3, `category-tiles-4up`, `deal-panels-3up`). Brand Personality: "Transactional / modular-catalogue".
Motion bet: the grid becomes the protagonist through motion — tiles cascade in row by row (left→right stagger 70ms), cards lift −4px with a lifted shadow on hover, the category-tab indicator slides between tabs, the search field's focus ring draws in, and Add to Cart gains a sheen; nothing parallaxes, nothing ticks, headings stay still.

### Variant B · Display-typography amplification (#1)
Source: catalog
What if: "What if the Fellix deal numerals locked inside the banners — '35% off', '$99 a year', 'Up to 65% off' — came out as live type and became the page's structural voice?"
Captured trait amplified: Fellix SemiBold display register (currently exercised only inside rasters)
Evidence: `_brand-extraction.json § type.displayInRaster` — ≈80–110px Fellix numerals and headlines exist only in merchandising rasters (hero slides 1580×480, promo cards 400×420 ×5, columns-promo 1200×257 / 1138×500, category tiles 600×130 ×4); `type.scaleAudit` — no live heading exceeds 28px; `--heading-font-size-xxl: 40px` declared, unused (tension `T-scale`, `T-tokens-unrendered`). Fellix is a licensed brand face (`type.files[].licensingFlag: private`), not a generic sans.
Composition bet: a type-led page — the hero becomes a giant live "35% off" numeral set against the appliance cutout, promo cards lead with their offer numeral at display size over a smaller photo, section titles step up to a true display scale, and prices on product cards get the same superscript-numeral treatment the site already uses at 24px, scaled to lead the card. Static.

## Disqualified

- **Photography re-foregrounding (#2)** — disqualified because the captured photography is small and text-baked: lifestyle images are 400×225 / 300×169 natural, products are 276×276 cutouts, and the largest photographic rasters (hero 1580×480, columns-promo 1200×257) carry baked headline text. Amplifying them to editorial scale would expose the low resolution and the baked copy.
- **Signature-gesture extension (#4)** — disqualified because there is no captured signature gesture beyond the header logo lockup (`logo` 72×72 SVG); no monogram, illustration system or recurring motif appears anywhere else on the page. Extending one would mean inventing shapes.

## Considered but not picked

- **Live-data promotion (#3)** — the page has operational signals (velocity chips "1K+ bought last week", rating counts, "This item is currently unavailable", store-gated weather widget), so it is not disqualified; but the weather widget captured empty and the velocity chips are static counts, so a live-systems hero would have to fake liveness. Its natural register (live-systems) is also not C's register.
- **Voice-register pivot (#5)** — a real tonal contrast exists (deal numerals vs helper / community copy: "Plan your day and your next project!", "Thank you, first responders.", "Discover Lowe's Community Impact"), but most of the helper/community copy lives only in raster alt text; B's display-type bet addresses the `T-scale` tension more directly.
- **Color-ladder re-weighting (#6)** — brand navy `#012169` covers ≈0.7% of ground area (utility bar + logo), well under the 10% trigger; strong candidate, but B and C differentiate better on type vs motion. Recorded for a future variant.
- **Audience-routing reframe (#7)** — > 4 distinct CTA verbs above the fold (Find a Store, AI Assist, Sign In, Cart, Shop Now, Get Details, More Suggestions); not picked because the multi-audience header (store, search, Pro, credit) is Lowe's IA priority and must be preserved, so a single-audience reframe would fight the IA-priority audit.
