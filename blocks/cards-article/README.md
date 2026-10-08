# cards-article

Custom **cards** block. Purpose: editorial-how-to-cards.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One row per article (4 rows): cell 1 = photo; cell 2 = H3 title, description paragraph (or bullet list), CTA link ("Learn More"/"Get Started"). Optional mobile art: a second image in the same image cell is the mobile variant, shown below 576px (desktop image above); both render as one picture, so only one image downloads.

If cell 2 holds only the CTA link (title and description are baked into the photo, as on lowes.com), the whole photo becomes the link and the CTA text is kept for screen readers only. If cell 2 also has a title or description, they render as text below the photo, and the CTA's click area covers the whole card.

Layout: 2 columns with a 16px gap below 673px, and 4 columns with a 24px gap from 673px up (the lowes.com breakpoint).

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
