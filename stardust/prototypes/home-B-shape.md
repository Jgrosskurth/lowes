<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-08T17:05:00Z
  page:             home
  variant:          B
  pageUrl:          https://main--lowes--jgrosskurth.aem.live/
  againstDirection: stardust/direction.md (Active 2026-10-08T16:00:00Z)
  consumedBy:       impeccable:craft
  canonFrom:        stardust/prototypes/home-A-proposed.html (header, footer, product card, pills, department grid, article/project/plan sections inherited unchanged)
  readArtifacts:
    - stardust/current/pages/home.json (rasterCopy)
    - DESIGN-B.md / DESIGN-B.json
    - stardust/uplift-questions.md (Variant B · Display-typography amplification)
  stardustVersion:  0.14.0
  variantDeclaration: "This variant amplifies the Fellix SemiBold display register (captured only inside merchandising rasters: ≈80–110px '35% off', '$99 a year', 'Up to 65% off'; no live heading above 28px — _brand-extraction.json#type.displayInRaster, #type.scaleAudit) in service of the PRODUCT.md Brand Personality trait 'Deal-forward'."
  surfaceConceptSeed: { key: 4e3589f7, assignedIndex: 3, groundedList: ["weekly-ad numeral wall", "numeral-led hero + offer ledger", "split billboard tiles (one giant live numeral per offer, cutout beside)", "department index set as display type", "shelf-edge price-tag motif", "end-date countdown calendar"], built: "split billboard tiles", challengers: ["multiplane cel-animation dawn — fuses poorly: gouache palette + painted serif title cards break Mode A palette/type pins", "hand-cranked paper menagerie — fuses poorly: kraft/crimson palette and letterpress caps outside the captured surface"] }
  capturedSourceLineage:
    site-header: "canon from A (pages/home.json#landmarks[header])"
    hero: "carousel-hero slide 1 (rasterCopy['carousel-hero'][1]) — numeral set as live display type"
    member-offers: "carousel-hero static tile (MyLowe's Money, '$20') + slide 2 (backsplash) — children[2]"
    popular-searches: "carousel-pills — children[0] (canon from A)"
    offers: "cards-promo + hero slides 3–5 — children[3], children[2]; numerals from rasterCopy"
    sponsored: "sponsored-banner — children[1]; '$100' from rasterCopy"
    projects-made-easy: "columns-promo — '$99 a year', '$10 MyLowe’s Money' from rasterCopy['columns-promo']"
    plan-your-day / gift-zone / categories / explore-more / next-project / items-to-explore: "canon from A"
    deals: "carousel-deals — children[10]; Save-% badges promoted to display figures"
    site-footer: "canon from A (direction-authorized new, improvement 7)"
  antiTemplatePass:
    - pattern: hero composition
      defaultReflex: "Generic-2026-SaaS oversized sans hero + two-button CTA pair"
      alternatives: ["billboard tile: giant live offer numeral + qualifier + one action + product cutout", "photo-led split (A)", "type-only centered stack"]
      picked: "billboard tile with the captured numeral as the hero"
      rationale: "the numeral is the brand's own loudest artifact (promo art); one action only — no dual-CTA pair, cutout keeps product truth"
      reference: { source: webfetch, title: Target homepage, url: "https://www.target.com/", grounds: "live oversized deal numerals lead deal cards" }
    - pattern: promo cards
      defaultReflex: "5-up image-card grid"
      alternatives: ["2×2 numeral billboards + seasonal text-led row", "ledger list with numeral column", "photo cards (A)"]
      picked: "2×2 numeral billboards (65% / 40% / 30% / $120) + 4 seasonal headline tiles"
      rationale: "separates numeral deals from seasonal messages the critique of A flagged as ragged; photos shrink to square cutout crops"
    - pattern: deal panels
      defaultReflex: "product tile grid with corner badge (captured)"
      alternatives: ["Save-% figure leads each tile at display size", "badge kept"]
      picked: "figure-led tiles"
      rationale: "amplifies the trait on real captured values only (Save 25%, 24%, 50% …)"
  substrateTransitions:
    default: "ground #ffffff"
    exceptions:
      - "site-footer on lowes-navy (canon)"
      - "plan-your-day store panel on mist (canon)"
  voiceClassification:
    - { section: hero, classification: captured-verbatim, source: "rasterCopy['carousel-hero'][1]" }
    - { section: member-offers, classification: captured-verbatim, source: "rasterCopy['carousel-hero'][0,2]" }
    - { section: offers, classification: captured-verbatim; note: "CTA objects direction-authorized (imp. 8)" }
    - { section: sponsored, classification: captured-verbatim }
    - { section: projects-made-easy, classification: captured-verbatim }
    - { section: deals, classification: captured-verbatim; note: "'Save 25%' split into 'Save' + '25%' — same captured string" }
    - { section: "all canon sections", classification: "as A" }
  signatureElements: []
  surpriseTier_typeScaleYields:
    - { rule: "DESIGN.md committed scale (display 56 / heading-l 28)", variantDominantDimension: "typography/display-numeral-voice", capturedTraitAmplified: "Fellix display register", yieldedTo: "DESIGN-B drenched scale (144 / 72 / 40 / 24)", rationale: "the trait IS display scale; DESIGN-B.md records the yield" }
  compositionDelta_vs_A: ["hero-layout: split photo lead + 2 side tiles → full-width type-led billboard with numeral as H1", "section-sequence: MyLowe's Money + backsplash leave the hero for a member-offers row beneath it", "offers layout: 4×2 photo-first cards → 2×2 numeral billboards + 4-up seasonal headline row", "deals layout: badge tiles → Save-% figure-led tiles", "services layout: copy panels → $99 / $10 numeral billboards"]
  compositionDelta_vs_C: ["same five structural deltas as vs A (C holds A's IA)", "motion: static vs kinetic-grid choreography"]
-->
---
slug: home
variant: B
url: https://main--lowes--jgrosskurth.aem.live/
register: brand
surprise: medium
dominantDimension: typography/display-numeral-voice
mode: persuade
fidelity: quick
---

# Page shape: home — variant B (Fellix display register amplified)

## Sections (in render order)

1. **site-header** — canon from A.
2. **hero** — full-width lowes-blue billboard. H1 = "Up to **35%** off Select Major Appliances": "35%" at display-numeral (clamp 88–144px), qualifier at display 72→40, "Offer ends 10/7/26.", the two "Save up to an Additional…" lines, one action "Shop All Deals" + "Offer details"; product cutout crop at right; members strip beneath (FREE Delivery / Installation / Haul Away / Protection Plan).
3. **member-offers** — 2 tiles: MyLowe’s Money™ Days ("Get up to **$20**…", numeral at heading-xl+), backsplash headline tile.
4. **popular-searches** — canon.
5. **offers** — 2×2 numeral billboards (65% / 40% / 30% / $120) — numeral at ~120px, qualifier, date, link, square photo crop; then a 4-up seasonal row (fall style under $50, new tools, 3x points fall, 3x points garden) led by 28px headlines.
6. **sponsored** — DEWALT Days with "$100" at display size, labelled Sponsored.
7. **projects-made-easy** — HomeCare+ billboard "$99 a year" + First responders "$10".
8. **plan-your-day**, 9. **gift-zone** (product prices lead at 40px), 10. **categories**, 11. **explore-more** — canon (section titles on the 40px step).
12. **deals** — three panels; each tile leads with its captured Save-% figure at 40px green.
13. **next-project**, 14. **items-to-explore**, 15. **site-footer** — canon.

## Layout strategy

- Same container/grid/rhythm as A (48px sections, density floor).
- Billboards collapse to stacked numeral-over-copy below 1024px; numeral clamps to 88px on phones.

## Data attributes

As A, plus `section[data-section="member-offers"][data-intent="loyalty offer"][data-layout="grid"][data-items="2"]`; hero `data-layout="type-led"`.

## Unsourced content (placeholder list)

- `footer [data-placeholder]` — type `other` (canon from A).
