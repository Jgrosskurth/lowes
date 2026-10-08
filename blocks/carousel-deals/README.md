# carousel-deals

Custom **carousel** block. Purpose: deal-cards-carousel.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One row per card. Cell 1 = card title (heading, bold or paragraph) + "View All" link. Cell 2 = product tiles: each tile starts at an image linked to the PDP (img alt and link title = product name) followed by optional lines: "Save NN%" badge, price "$48.32" with optional <del>$64.42</del> was-price, "This item is currently unavailable" note, rating/review count ("392", "8.6K", "4.4 stars (392)"), optional product name line and "Add to Cart" link. 3-4 tiles = 2x2 quadrant (names on one line, ellipsized); 1-2 tiles = pair layout. Optional first row with only a heading = block title.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)

## Content model (rows and cells)

| Row | Cell 1 | Cell 2 |
| --- | --- | --- |
| optional title row | a single heading (`h2`/`h3`), no image, no link: shown above the carousel | (omit) |
| one per card | card title (heading, **bold** or plain paragraph) + `View All` link (own paragraph) | product tiles (see below) |

Tiles in cell 2: each tile **starts at an image** and owns every following line until the next
image. Use one paragraph per line (line breaks inside a paragraph are also split):

```html
<p><a href="https://www.lowes.com/pd/..." title="allen + roth Custom Cellular Shade"><picture><img src="..." alt="allen + roth Custom Cellular Shade"></picture></a></p>
<p>Save 25%</p>
<p>$48.32 <del>$64.42</del></p>
<p>4.4 stars (392)</p>
```

| Line | Recognised by | Notes |
| --- | --- | --- |
| image (required, starts the tile) | contains `picture`/`img` | link the image to the PDP; put the product name in `alt` and the link `title` |
| PDP link | a paragraph that is only a link | fallback when the image is not linked; link text (if not a URL) becomes the name |
| savings badge | starts with `Save` (or `NN% off`) | overlaid on the image |
| price | starts with `$`; `<del>` / `<s>` = was-price | a second plain `$` amount on the line is also treated as the was-price |
| was-price | a line with only `<del>$64.42</del>` | |
| availability | contains `unavailable`, `out of stock`, `sold out` | replaces the price |
| rating / reviews | `392`, `8.6K`, `(392)`, `4.4 stars (392)`, `4.4 \| 392`, `★★★★ 392` | rating value draws stars; count shown next to them |
| product name | any other text line (brand in **bold**) | optional; one line with ellipsis in the quadrant layout |
| CTA | link whose text is `Add to Cart` / `Buy now` | rendered below the tile |

Layout is chosen from the tile count: 3 or more tiles = 2x2 quadrant (one-line names);
1-2 tiles = pair layout (image beside name, price, rating and CTA). Rows may also be authored as a
single cell (header lines first, then tiles), or with one tile per extra cell; a list where each
item is a tile is accepted too.
