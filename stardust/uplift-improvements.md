---
_provenance:
  writtenBy: stardust:uplift
  writtenAt: 2026-10-08T15:48:00Z
  againstInput: https://main--lowes--jgrosskurth.aem.live/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/home.json
    - stardust/current/brand-review.html
    - stardust/current/assets/screenshots/home.png
  auditConsumed: none (no stardust/audit/<domain>/audit.json for this origin)
  referencesUsed:
    - source: webfetch
      title: Best Buy homepage
      url: https://www.bestbuy.com/
      grounds: "counter-example for item 3 (carousel overload) — 'Shop deals by category' is a fixed 24-item static grid and Best Selling uses numbered rows instead of a carousel"
      tag: off-toolbox
    - source: webfetch
      title: IKEA US homepage
      url: https://www.ikea.com/us/en/
      grounds: "counter-example for item 1 (raster copy) — offer copy ('Save up to 20%. Refresh your home for fall now thru 10/12', '10% off purchases of $3,000+ on SEKTION kitchens') is live HTML text over product photography"
      tag: off-toolbox
    - source: webfetch
      title: Target homepage
      url: https://www.target.com/
      grounds: "counter-example for item 1 — deal numerals ('30%', '$100') rendered as live HTML text inside deal cards"
      tag: off-toolbox
  referenceTier: "tier 2 (partial) — WebSearch unavailable in this session; references retrieved by direct WebFetch of named retail homepages (homedepot.com and bunnings.com.au returned 403 and are not cited)"
---

# Improvements — https://main--lowes--jgrosskurth.aem.live/

1. **[dated-pattern]** Merchandising copy is baked into raster artwork — `pages/home.json § landmarks[main].children[2,3,4,9].textInImage = true`: the hero carousel (four 1580×480 slides, "Up to 35% off Select Major Appliances. Offer ends 10/7/26."), five 400×420 promo cards, two columns-promo banners and four 500×515 / 750×773 article cards carry headline, offer, dates and body as pixels; live innerText of those sections is only "Shop Now / Get Details / Learn More". Tension `T-raster-copy`. · Pattern at fault: the "finished banner JPEG" merchandising workflow — text can't reflow, can't be searched or translated, and is restyled per-banner. Contemporary retail (IKEA US, Target — see provenance) ships offer copy as live text over product photography. · fix: re-author each promo as live Fellix type (offer numeral, headline, qualifier, end date) over the captured photograph / product cutout, keeping the existing alt text as the source copy.

2. **[ia-clutter]** The brand's own hero starts at y=483, behind a 16-CTA search rail and a sponsored ad — `landmarks[main].children[0].rect.y=172` (Recommended Searches, 15 pills + "More Suggestions"), `children[1]` DEWALT "Sponsored" 2000×227 banner, then `children[2]` hero at y=483; MyLowe's Money is announced twice in the first viewport (utility bar link + hero tile). Tension `T-first-viewport`. · Pattern at fault: ad-inventory-first stacking that lets paid and personalised slots outrank the house message. · fix: hero directly under the header; recommended searches move into a single row under the hero as "Popular searches"; the sponsored banner drops below the promo row; MyLowe's Money keeps the hero tile and the utility bar link becomes Lowe's-wide (Credit Center / Order Status / Weekly Ad / PRO stay).

3. **[dated-pattern]** Carousel overload — 7 of 13 main sections scroll horizontally (`_brand-extraction.json § motifs.carouselShare`): search pills, auto-rotating 4-slide hero with pause + 5 dots, weather article rail (10 cards, 5 visible), Gift Zone product rail, project carousel (10, 4 visible), tabbed product carousel; content past the right edge is hidden behind 40px arrow buttons. Tension `T-carousel-share`. · Pattern at fault: the 2015-era "rotate everything" homepage; Best Buy's homepage (provenance) uses a fixed 24-tile category grid and numbered rows instead. · fix: hero becomes a static lead + two supporting offers (no auto-rotation); article and project rails become 4-up / 3-up visible grids with a "See all" link; one product rail (Gift Zone) remains as the only horizontal scroller.

4. **[ia-clutter]** Heading outline has no H1 and splits equivalent section titles across two styles — `pages/home.json § headings`: first heading is an h3 16px ("Recommended Searches for You"); "Popular Categories" / "Explore More…" are h2 28/40 while "Find Your Next Project" / "Items To Explore" are h3 24/32 and "Plan your day and your next project!" is h3 24/32 at 80% opacity. Tension `T-heading-outline`. · Pattern at fault: block-by-block heading choice with no page-level outline. · fix: one H1 (the hero headline in live type), every section title an h2 on a single style, card titles h3.

5. **[contrast-or-density]** Ad-hoc type scale with a declared-but-unused display step — `_brand-extraction.json § type.scaleAudit` ratios 1.17 / 1.50 (28 → 24 → 16); `--heading-font-size-xxl: 40px` declared, 0 rendered uses; the page's biggest live type is 28px while the rasters carry ≈80–110px Fellix numerals. Tension `T-scale`, `T-tokens-unrendered`. · Pattern at fault: scale defined in tokens but bypassed by image-authored display type. · fix: a stepped scale built from the declared tokens (40 / 28 / 20 / 16 / 14 + one hero display step), applied to live headings.

6. **[missed-opportunity]** The weather widget ships as an empty, action-less panel — `widgets.weather.state`: a 390×250 `#f4f6fa` panel at y=1440 reading only "Set your store to see the weather forecast for your area." with no button; the store selector it depends on sits 1,400px above in the header. · Pattern at fault: a store-gated feature without its own unlock action. · fix: put a "Find a Store Near Me" action (the captured header label) inside the empty state, and title the band with its captured heading "Plan your day and your next project!" at the shared h2 style.

7. **[ia-clutter]** Footer is AEM boilerplate, not Lowe's — `landmarks[footer].innerText`: "Copyright © 2025 Adobe. All rights reserved." + adobe.com Privacy / Terms / AdChoices links; zero Lowe's navigation. Tension `T-footer-boilerplate`. · Pattern at fault: unfinished migration chrome shipped to production. · fix: a Lowe's footer assembled from captured nav (utility: Lowe's Credit Center, Order Status, Weekly Ad, Lowe's PRO; departments from the 24-tile grid; Services, Deals, Design & Ideas) with the legal line and legal links as `[data-placeholder]` until Lowe's copy is supplied.

8. **[cliché]** Eight different "go" labels for two jobs — `_brand-extraction.json § voiceTable.ctaFrequency`: Shop Now (11), Read Article (4), View All (3), Learn More (3), Get Details (3), Shop All (2), Get Started (1) next to Add to Cart (13). · Pattern at fault: per-banner CTA copy. · fix: commerce links say "Shop …" with an object ("Shop appliance deals"), content links say "Read …" / "See all …", offer fine print says "Offer details"; Add to Cart unchanged.

9. **[contrast-or-density]** Radius vocabulary is fragmented — `motifs.borderRadius.occurrences`: 8px (123), 6px (31), 4px (13), plus 20px pills and circles. Tension `T-radius-vocab`. · Pattern at fault: per-block radius choice. · fix: 8px for every container / button / image, 20px pill for chips and rail tabs, circle only for icon buttons — Add to Cart moves 6 → 8px.
