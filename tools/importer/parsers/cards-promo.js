/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base: cards. Source: https://www.lowes.com/
 * Block model (blocks/cards-promo/README.md): one row per tile (5 rows).
 *   cell 1 = image (copy baked in, alt preserved)
 *   cell 2 = "Shop Now" link to the tile destination
 * Source: div[class*="RowWrapper-RC"] > div[class*="ColumnWrapper-RC"].d-span-2.4 (x5)
 *   > [data-testid="playwright-unified-scaled-image"] a.scaled-image-primary-link > picture > img
 */
function absUrl(href) {
  if (!href) return '';
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) return `https://www.lowes.com${href}`;
  return href;
}

// lowes.com serves separate mobile ("-mow") artwork below 576px:
//   <picture><source media="(max-width: 35.9375rem)" srcset="...-mow.png"> ... <img src="...-dt.png">
// Authoring convention: a second image in the same cell is the mobile (< 576px) variant.
// Returns that second <img> (absolute URL, same alt), or null when there is no distinct mobile art.
function mobileImage(srcImg, desktopSrc, document) {
  const sources = srcImg?.closest('picture')?.querySelectorAll('source[media][srcset]') || [];
  const source = [...sources].find((s) => {
    const media = s.getAttribute('media') || '';
    return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
  });
  const url = source ? absUrl(source.getAttribute('srcset').split(',')[0].trim().split(/\s+/)[0]) : '';
  if (!url || url === desktopSrc) return null;
  const img = document.createElement('img');
  img.src = url;
  img.alt = (srcImg.getAttribute('alt') || '').trim();
  return img;
}

export default function parse(element, { document }) {
  // Iterate the column wrappers (block-level), not the tile anchors.
  let tiles = [...element.querySelectorAll(':scope > div[class*="ColumnWrapper"]')];
  if (!tiles.length) tiles = [...element.querySelectorAll(':scope > div')];

  const cells = [];
  tiles.forEach((tile) => {
    const srcImg = tile.querySelector('img');
    const anchor = tile.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]')
      || srcImg?.closest('a[href]') || tile.querySelector('a[href]');
    if (!srcImg && !anchor) return;

    let imageCell = '';
    if (srcImg) {
      const src = srcImg.getAttribute('src') || srcImg.getAttribute('data-src');
      if (src) {
        const img = document.createElement('img');
        img.src = absUrl(src);
        img.alt = (srcImg.getAttribute('alt') || '').trim();
        const mobileImg = mobileImage(srcImg, absUrl(src), document);
        imageCell = mobileImg ? [img, mobileImg] : img;
      }
    }

    let linkCell = '';
    if (anchor) {
      const a = document.createElement('a');
      a.href = absUrl(anchor.getAttribute('href'));
      const label = anchor.textContent.replace(/\s+/g, ' ').trim();
      a.textContent = label || 'Shop Now';
      linkCell = a;
    }

    if (!imageCell && !linkCell) return;
    cells.push([imageCell, linkCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
