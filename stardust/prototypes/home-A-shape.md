<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-08T16:25:00Z
  page:             home
  variant:          A
  pageUrl:          https://main--lowes--jgrosskurth.aem.live/
  againstDirection: stardust/direction.md (Active 2026-10-08T16:00:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/home.json (incl. rasterCopy, iconMap)
    - stardust/current/_brand-extraction.json
    - DESIGN-A.md / DESIGN-A.json
    - stardust/direction.md
    - stardust/uplift-improvements.md
  stardustVersion:  0.14.0
  capturedSourceLineage:
    site-header: "site-wide landmark (pages/home.json#landmarks[header]; _brand-extraction.json#landmarkComponents[site-header])"
    hero: "consolidates carousel-hero slide 1 (35% appliances) + static MyLowe's Money tile + slide 2 (backsplash) — pages/home.json#landmarks[main].children[2] + rasterCopy['carousel-hero']"
    popular-searches: "carousel-pills — children[0], moved below the hero (improvement 2)"
    offers: "cards-promo (5) + carousel-hero slides 3–5 (fall rewards, fall garden, power tools) — children[3] + children[2]"
    sponsored: "sponsored-banner — children[1], moved below offers, labelled (improvement 2)"
    projects-made-easy: "columns-promo — children[4] + rasterCopy['columns-promo']"
    plan-your-day: "widget-weather — children[5] (weather panel + 10-card article rail)"
    gift-zone: "carousel-thematic — children[6] (feature tile + 13 product cards)"
    categories: "cards-category + cards-department — children[7] + children[8] (shared 'Popular Categories' heading)"
    explore-more: "cards-article — children[9] + rasterCopy['cards-article']"
    deals: "carousel-deals — children[10] (3 panels)"
    next-project: "carousel-product #1 — children[11]"
    items-to-explore: "carousel-product #2 — children[12] (Sponsored)"
    site-footer: "direction-authorized new — improvement 7: Lowe's footer assembled from captured nav labels/hrefs; captured footer is AEM boilerplate"
  antiTemplatePass:
    - pattern: hero composition
      defaultReflex: "full-width photo carousel with dots (captured) / centered-stack hero with two-button pair"
      alternatives: ["static lead offer as live type + framed product crop + two supporting offer tiles", "full-bleed photo with overlaid headline", "split 50/50 photo + copy"]
      picked: "static lead offer as live type + framed product crop + two supporting offer tiles"
      rationale: "keeps the captured split (static tile + promo) and its three first-viewport offers; removes auto-rotation (imp. 3) and baked copy (imp. 1). No dual-CTA pair: one action per offer."
      reference: { source: webfetch, title: IKEA US homepage, url: "https://www.ikea.com/us/en/", grounds: "live-text offers over product photography" }
    - pattern: promo cards
      defaultReflex: "5-up image-card grid as category nav"
      alternatives: ["4-up offer grid, photo cropped below the baked copy + live offer text", "horizontal rail (captured)", "single list of offers"]
      picked: "4-up offer grid (8 offers)"
      rationale: "the captured site's merchandising IS a card grid of offers (brand signature catalogue shape); the move is copy into type and every hero slide made visible, not a new primitive"
      reference: { source: webfetch, title: Target homepage, url: "https://www.target.com/", grounds: "deal cards with live numerals" }
    - pattern: article / project rails
      defaultReflex: "horizontal carousel with arrow buttons (captured)"
      alternatives: ["visible 5-up grid, two rows", "numbered list", "rail kept"]
      picked: "visible grid"
      rationale: "improvement 3; Best Buy fixed category grid as counter-example"
      reference: { source: webfetch, title: Best Buy homepage, url: "https://www.bestbuy.com/", grounds: "fixed 24-tile grid, numbered rows instead of carousels" }
    - pattern: search row
      defaultReflex: "nav-icon glyphs in a typographic register"
      alternatives: ["captured icon set (store, search, visual search, AI Assist, account, cart) with labels", "text-only tools"]
      picked: "captured icon set with visible labels"
      rationale: "icons are Lowe's own SVGs (pages/home.json#iconMap) — brand-faithful, not reflex"
    - pattern: department grid
      defaultReflex: "captured-shape mirror-translated into new tokens"
      alternatives: ["8×3 grid of icon (cropped from captured tile) + live label", "text list", "raster tiles kept"]
      picked: "8×3 grid with live labels"
      rationale: "grid preserved — it is the brand's own catalogue shape; labels move from pixels to text (imp. 1, 9)"
  substrateTransitions:
    default: "ground #ffffff"
    exceptions:
      - "site-footer on lowes-navy — names the end of the page (seed ground roll 'saturated' → alt-section surface, direction.md)"
      - "plan-your-day store panel on mist — the store/weather utility surface (captured widget ground)"
  voiceClassification:
    - { section: site-header, classification: captured-verbatim, source: "pages/home.json#ctas (utility, tools, nav)" }
    - { section: hero, classification: captured-verbatim, source: "rasterCopy['carousel-hero'] (vision transcription of the brand's own rasters)"; note: "'Get Details' → 'Offer details' and per-offer 'Shop …' labels are direction-authorized rewrites (imp. 8)" }
    - { section: popular-searches, classification: captured-verbatim }
    - { section: offers, classification: captured-verbatim, source: "rasterCopy['cards-promo'], rasterCopy['carousel-hero']"; note: "CTA objects direction-authorized (imp. 8)" }
    - { section: sponsored, classification: captured-verbatim, source: "rasterCopy['sponsored-banner']" }
    - { section: projects-made-easy, classification: captured-verbatim, source: "rasterCopy['columns-promo']" }
    - { section: plan-your-day, classification: captured-verbatim; note: "'Find a Store Near Me' action reused from the header (imp. 6)" }
    - { section: gift-zone, classification: captured-verbatim }
    - { section: categories, classification: captured-verbatim }
    - { section: explore-more, classification: captured-verbatim, source: "rasterCopy['cards-article']"; note: "'Learn More' → 'Read article'; 'Get Started' → 'Schedule measurement' (from the card's own copy) — direction-authorized (imp. 8)" }
    - { section: deals, classification: captured-verbatim; note: "'View All' → 'See all' + panel object (imp. 8)" }
    - { section: next-project, classification: captured-verbatim }
    - { section: items-to-explore, classification: captured-verbatim }
    - { section: site-footer, classification: "direction-authorized rewrite (column grouping of captured labels) + placeholder (legal line)" }
  signatureElements: []
  signatureNote: "voice.heroMedium is null; no signature motion or site-wide motif captured. Logo lockup carried in header + footer."
  compositionDelta_vs_B: ["hero-layout: framed product crop + live offer → giant type-led numeral hero (B)", "offers layout: photo-first 4-up cards → numeral-first offer tiles with small photo (B)", "deals layout: product-tile panels → Save-% figure-led panels (B)", "section-head scale: 28px single style → 40px display step (B)"]
  compositionDelta_vs_C: ["motion: static → kinetic-grid choreography (cascade, lift, indicator, sheen)", "interaction model: static rails → tab indicator + hover-lift system", "(IA identical by contract — C's delta is the motion axis, enforced at Pass 6f)"]
-->
---
slug: home
variant: A
url: https://main--lowes--jgrosskurth.aem.live/
register: brand
surprise: low
dominantDimension: composition/faithful-grid-fixes
mode: persuade
fidelity: quick
---

# Page shape: home — variant A (faithful + improvements)

## Sections (in render order)

1. **site-header** (role `header`) — navy 32px utility bar with the four utility links (Lowe's Credit Center, Order Status, Weekly Ad, Lowe's PRO); the duplicate MyLowe's Money promo link is dropped from the bar because the hero tile carries it (imp. 2). Main bar (sticky): logo, "Find a Store Near Me" selector on store-chip, search field ("What can we help you find?" + search + visual-search icons), AI Assist, Sign In, Cart — Lowe's own SVG icons. Department row: Shop All, Services, Deals, Design & Ideas, $99 Maintenance + "New" badge, Appliances, Bathroom, Lighting, Flooring, Building Supplies, Tools, Holiday Decorations, Outdoor, Fall Inspo.
2. **hero** — H1 "Up to 35% off Select Major Appliances". Lead panel (navy, ~2/3 width): "Final Day" badge, display numeral line, "Offer ends 10/7/26.", the two "Save up to an Additional…" lines, "Shop All Deals", "Offer details"; framed product crop (fridge + range) from slide 1. Members strip inside the lead: "All-In Appliance Offer · Members Get More · When you spend $2,500 or more on select LG major appliances." + FREE Delivery / FREE Basic Installation and Parts / FREE Haul Away / 2-Year Lowe's Protection Plan + "Excludes Florida and MyLowe's Pro Rewards™ members." Right column: two stacked offer tiles — MyLowe's Money™ Days (live copy, "Offer ends 10/14/26.") and Refresh your backsplash (photo crop). No rotation, no dots.
3. **popular-searches** — "Recommended Searches for You" + "More Suggestions for You" link; 15 pills wrap onto two lines (no rail).
4. **offers** — 8 offer cards, 4-up × 2: 65% Alexa/Ring/Blink/Fire TV, 40% Bathroom, 30% Grills, fall style under $50, new tools, 3x points fall, fall garden 3x, $120 power tools. Each: photo cropped below the baked copy, live numeral/headline, qualifier, end date when captured, one "Shop …" link.
5. **sponsored** — DEWALT Days: product photo crop + "Save up to $100 · Select DEWALT® Tools · Shop DEWALT deals" + visible "Sponsored" label.
6. **projects-made-easy** — H2 "Home Improvement Projects Made Easy": HomeCare+ panel (live copy, 7 services as a two-column list, "Subscribe for just $99 a year.", fine print) + First responders panel (photo + live copy, fine print). "Offer details" link.
7. **plan-your-day** — H2 "Plan your day and your next project!": mist store panel "Your Local Weather" + placeholder sentence + "Find a Store Near Me" button (imp. 6); 10 article/shop cards as a 5×2 grid.
8. **gift-zone** — H2 "Gift Zone": feature tile (crop + live "Find great gifts for everyone on your list." + "Shop all gifts") and the only horizontal rail: 13 product cards (scroll-snap, keyboard-scrollable region).
9. **categories** — H2 "Popular Categories": 4 category lockup tiles (captured rasters — they are wordmark lockups, not promo copy) + 24 department tiles 8×3 (icon crop + live label).
10. **explore-more** — H2 "Explore More for Your Home & Community": 4 cards, photo crop + live headline/body (+ blinds dates list) + link.
11. **deals** — three panels, H2 each: Top Trending Deals (4), 4 Stars & Above (2), We Picked These Deals for You (4); Save-% badges, prices, was-prices, ratings, "This item is currently unavailable" notes, Add to Cart where captured.
12. **next-project** — H2 "Find Your Next Project": 10 how-to cards, 5×2 grid.
13. **items-to-explore** — H2 "Items To Explore" + "Sponsored"; 12 category pills (Appliances active, static links); 16 product cards, 8-up × 2.
14. **site-footer** — navy band: logo, four columns of captured labels (Shop All → 12 departments; Deals → Deals, Weekly Ad, Deals of the Day, Lowe's Essentials; Services → $99 Maintenance, Services, Design & Ideas, Fall Inspo; MyLowe's Rewards → Order Status, Lowe's Credit Center, Lowe's PRO, Find a Store Near Me); legal line as PLACEHOLDER.

## Layout strategy

- Container 1328px (captured 1440 − 2×56 gutters); 12-col grid, 24px gap; section rhythm 48px (density floor 40–64).
- Hero: 8/4 split ≥ 1024px; stacks < 1024px (lead first). Offers 4 → 2 → 1 (mobile: 2-up compact). Departments 8 → 4 → 3. Deals 3 → 1. Projects/plan grids 5 → 3 → 2.
- Mobile header: logo + icons row, store + search full width, department row scrolls horizontally (native overflow, labelled region).

## Key states

- Weather panel empty state (captured) with the store action.
- Unavailable product tiles keep their captured "This item is currently unavailable" note in signal-red, no Add to Cart.

## Interaction model

- All links go to their captured lowes.com hrefs. Store / AI Assist / Sign In are buttons (captured as dialogs on the live site; no JS here).
- Gift Zone rail: `overflow-x: auto; scroll-snap-type: x mandatory`, `tabindex=0`, `role=region` + label.
- Focus: 2px lowes-blue ring, 2px offset on every interactive element. Skip link to main.

## Data attributes

- `header[data-section="site-header"][data-intent="navigate + search + route audiences"][data-layout="stack"]`
- `section[data-section="hero"][data-intent="lead offer"][data-layout="split-media"][data-items="3"][data-media="image"]`
- `section[data-section="popular-searches"][data-intent="search shortcuts"][data-layout="contained"][data-items="15"]`
- `section[data-section="offers"][data-intent="drive action"][data-layout="grid"][data-items="8"][data-media="image"]`
- `section[data-section="sponsored"][data-intent="paid placement"][data-layout="split-media"][data-media="image"]`
- `section[data-section="projects-made-easy"][data-intent="services offer"][data-layout="grid"][data-items="2"]`
- `section[data-section="plan-your-day"][data-intent="plan a project"][data-layout="side-rail"][data-items="10"]`
- `section[data-section="gift-zone"][data-intent="shop products"][data-layout="side-rail"][data-items="13"][data-interactive="carousel"]`
- `section[data-section="categories"][data-intent="browse departments"][data-layout="grid"][data-items="28"]`
- `section[data-section="explore-more"][data-intent="inspire + services"][data-layout="grid"][data-items="4"]`
- `section[data-section="deals"][data-intent="shop deals"][data-layout="grid"][data-items="3"]`
- `section[data-section="next-project"][data-intent="how-to discovery"][data-layout="grid"][data-items="10"]`
- `section[data-section="items-to-explore"][data-intent="shop products"][data-layout="grid"][data-items="16"][data-interactive="tabs"]`
- `footer[data-section="site-footer"][data-intent="navigate"][data-layout="grid"]`
- `main[data-template="landing"]`

## Unsourced content (placeholder list)

- `footer [data-placeholder]` — type `other`: Lowe's legal line + legal links (the captured footer is AEM boilerplate "Copyright © 2025 Adobe" with adobe.com links; Lowe's copy not captured).

## Open questions for craft

- Hero product crop: confirm the fridge + range window reads cleanly inside a framed tile on navy (slide raster ground is a lighter blue).
- Department tile icon crop: the captured tile rasters bake the label right of the icon; crop to the icon (left ~38%).
