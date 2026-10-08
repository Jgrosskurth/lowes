# carousel-product

Custom **carousel** block. Purpose: product-recommendation-carousel.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Optional heading row (title, optional helper text such as "Sponsored" and an optional CTA link), then one row per product: cell 1 = product image, cell 2 = brand + linked title, price, rating, "Add to Cart" link. Alternatively a single config row with recommendation slot id (lws_hp_recommendations_belowimage_0) for runtime population.

Optional keyed rows (any position):

| key | value |
| --- | --- |
| `slot` | recommendation slot id, exposed as `data-slot` |
| `pills` | list of filter pill labels (one list item / paragraph / line each). Rendered as a horizontally scrollable pill bar above the products; the first pill (or the one authored **bold**) is selected (`aria-pressed="true"`). Presentational only: author the selected filter's products. |

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
