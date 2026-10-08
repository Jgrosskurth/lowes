<!-- stardust:provenance
  writtenBy: stardust:uplift (Phase 3d variant declarations) + stardust:direct (Phase 5 reasoning trace)
  writtenAt: 2026-10-08T16:00:00Z
  againstInput: https://main--lowes--jgrosskurth.aem.live/
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/current/pages/home.json
    - stardust/current/brand-review.html
    - stardust/uplift-improvements.md
    - stardust/uplift-questions.md
  synthesizedInputs:
    - hands-off-equivalent answers to direct's density / ia-fidelity questions (uplift runs without confirmation stops)
  stardustVersion: 0.14.0
-->
---
title: "uplift presales redesign — three variants per stardust/direction.md"
resolvedAt: 2026-10-08T16:00:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

# Active direction (2026-10-08T16:00:00Z)

## Phrase

> uplift presales redesign — three variants per stardust/direction.md

## Restatement

A brand-faithful refresh of the Lowe's Home Improvement homepage as migrated to AEM Edge Delivery. Palette (white ground, navy, interactive blue, action green, red) and type (Fellix 400/600) stay pinned to the captured surface. The register stays `brand` with commerce texture. Three role-differentiated variants: A applies the nine improvements and nothing else; B amplifies the Fellix display register that currently survives only inside raster banners; C keeps A's IA and makes the tile grid the moving part of the page through the `kinetic-grid` motion register.

## Movements

- **register** — `brand` (inherited from `current/PRODUCT.md`)
- **expressive axis** — `restrained` → `committed` (A, C); `committed` → `drenched` on typography only (B)
- **tone** — unchanged: professional-warm, practical-helpful
- **density** — `balanced` tightened toward commercial (named assumption: phrase did not move density; brand-register default `balanced`, and the multi-audience hard floor fires — 13 sections, > 2 audience tracks: DIY / deals / Pro / credit / services — plus commercial-conversion priority → sectionPadding desktop 48px, inside the 40–64px floor, on every variant)
- **distinctiveness** — `familiar` → `distinctive` (B, C); `familiar` held with fixes (A)
- **audience** — unchanged: DIY homeowners + deal shoppers lead; Pro, credit, services kept in the header router
- **ia-fidelity** — `reimagined` (named assumption: uplift's three-variant role contract presumes reimagined; the phrase contains "what if" framing in the variant declarations)
- **constraints** — Mode A pins; no fabricated content; captured images reused at semantic positions; the AGENTS.md rule that committed files are served (no writes outside `stardust/` and root PRODUCT/DESIGN files)

## Gaps and questions

None asked — uplift runs end-to-end without confirmation stops (uplift SKILL.md § Stop conditions). Density and ia-fidelity resolved as named assumptions above.

## Anchor references

- Target homepage (https://www.target.com/) — webfetch; live oversized deal numerals in deal cards. Anchors B. `off-toolbox`.
- Best Buy homepage (https://www.bestbuy.com/) — webfetch; fixed 24-tile category grid, numbered rows instead of carousels. Grounds improvement 3 and C's grid-as-protagonist. `off-toolbox`.
- IKEA US homepage (https://www.ikea.com/us/en/) — webfetch; live-text offers over product photography; motion used as interface behaviour (video hero with pause, skippable carousels). Grounds improvement 1 and C's register check. `off-toolbox`.

## Anti-references

- Generic-2026-SaaS silhouette (oversized hero sans + solid/outline CTA pair + sticky nav + serial footer) — guardrailed because "refresh" is a common trigger; Lowe's has no dual-CTA pattern (`componentStyle.dualCTAPattern: null`) and must not acquire one.
- Editorial-register vocabulary ("the journal", "field guide", "atelier") — Lowe's is a commerce brand.
- Luxury-airy retail (96px+ padding, serif display).
- Stat-callout trust bars with invented numbers.

## Divergence inputs

- **mode** — Mode A (brand-faithful). Signal classification: `signal-strong` (8 palette colors after clustering, named family Fellix).
- **seed** — `Lowe's Home Improvement|2026-10-08` MD5 bytes [62, 141, 53, 75] → deterministic `1950s × Photogram × Field guide × saturated`.
- **picked_by** — decade `reasoned: Target / Best Buy / IKEA (2025-now live-text retail)` → **2025-now**; register `reasoned: deal-numeral-led big-box retail` → **Supermarket flyer** (overrides the rolled "Field guide", which is also an editorial-vocabulary risk for a commerce brand); craft `deterministic` → Photogram (inert under Mode A — no photographic treatment is invented); ground-family `deterministic` → saturated, **overridden `brand-faithful`** (captured ground `#ffffff`); the saturated roll informs the alt-section surface: navy `#012169` for the footer band only.
- **font deck** — `brand-inherited` (Fellix 400/600), `picked_by: user-constraint`.
- **palette** — inherited from `_brand-extraction.json`, `picked_by: user-constraint`; role names made brand-native (ground, ink, lowes-blue, cart-green, lowes-navy, mist, well, signal-red, rule, rule-strong, star).
- **anti-toolbox audit** — 1 hit: Sticky top navigation — justified: the captured Lowe's header is the search + store-selector router (IA priority: search-led + audience routing); keeping it reachable is the IA, not decoration. 1 conditional hit on B: Oversized display numerals — justified in DESIGN-B as the captured trait itself (numerals exist in the brand's own promo art), never used as section markers (§ 01).
- **brand-faithful inversions** — pure-white retention (`#ffffff` ground); hex format retention; saturated color retention (`#0072ce`, `#007a33` stay saturated, no tinted-neutral drift).

## Variant A — Faithful + improvements

Role: risk-averse green-light. "Yes, that's us, with the obvious fixes."
Composition: same as captured (same 13 content beats and order), with the improvements' re-sequencing of the first viewport (hero before search rail and sponsored banner) and carousel-to-grid conversions.
Motion: static (no cinematic layer).
Improvements applied: all 9 from `stardust/uplift-improvements.md` — (1) live-type promo copy, (2) hero-first viewport, (3) carousel overload → grids, (4) H1 + single section-title style, (5) stepped type scale, (6) weather widget unlock action, (7) Lowe's footer from captured nav, (8) CTA vocabulary, (9) radius vocabulary.

## Variant B — What if we amplified the Fellix display register?

Role: design-team motivator. The brand's underused capability foregrounded.
What if: "What if the Fellix deal numerals locked inside the banners — '35% off', '$99 a year', 'Up to 65% off' — came out as live type and became the page's structural voice?"
Captured trait amplified: Fellix SemiBold display register (exercised today only inside merchandising rasters; no live heading exceeds 28px).
Evidence: `_brand-extraction.json § type.displayInRaster`; `type.scaleAudit` (28 → 24 → 16, `--heading-font-size-xxl: 40px` unused); tensions `T-scale`, `T-tokens-unrendered`, `T-raster-copy`.
In service of: PRODUCT.md Brand Personality "Deal-forward".
Composition: type-led hero (a giant live offer numeral beside the appliance cutout instead of a photo carousel), promo cards re-set numeral-first, deal panels led by their Save-% figure at display size, section titles on a true display step, product prices promoted to lead the card. Same content set; layout strategy of the hero, promo row and deals changes.
Motion: static (no cinematic layer).

## Variant C — What if motion was part of the identity?

Role: visionary pitch. The brand's third dimension — kinetic.
What if: "What if Lowe's tile grid — the department grid, the category tiles, the deal panels — became the moving part of the page, instead of rails that slide content out of sight?"
Cinematic register: kinetic-grid (auto-picked from PRODUCT.md Brand Personality "Transactional / modular-catalogue")
Captured trait amplified: the static tile-grid primitive (department grid 24 tiles, category tiles 4-up, deal panels 3-up) — the under-represented alternate to the dominant horizontal rail.
Evidence: `_brand-extraction.json § motifs.patterns` + `motifs.carouselShare` (7 of 13 sections are rails; 3 are grids).
Composition: identical IA to A; the bet is motion, not layout.
Motion: cinematic, register kinetic-grid — row-by-row tile cascade, hover lift, sliding tab indicator, drawn focus ring on search, button sheen; no parallax, no tickers, no letter reveals.

## Command sequence (proposed)

1. `stardust:direct` (this) — PRODUCT.md, DESIGN.md/json, DESIGN-A/B/C.md/json
2. `stardust:prototype home` × 3 (A first, then B, then C) — each via `$impeccable` craft
3. Per variant: `$impeccable critique` → `audit` → `adapt` (prototype Phases 2.5–2.8); C additionally motion validation Pass 6
4. `$impeccable polish` on any variant whose gates surface fixes

## User confirmation

> Not requested — `stardust:uplift` runs all phases without stopping (skill contract: "PROCEED. Run all phases without stopping"). Recorded as hands-off-equivalent for direct's gates only; prototype approval is NOT granted (no `approved` state is written).

## Pages in scope

- `home` (the single extracted page)
