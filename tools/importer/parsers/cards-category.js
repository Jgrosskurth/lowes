/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-category. Base: cards. Source: https://www.lowes.com/
 * Block model (blocks/cards-category/README.md): one row per banner (4 rows).
 *   cell 1 = image (label baked into image, alt preserved)
 *   cell 2 = link whose text is the category label
 * Source: div.row[class*="RowWrapper-RC"] > div.col (.md-3) (x4)
 *   > [data-testid="playwright-unified-scaled-image"] (optional empty h2) a.scaled-image-primary-link > picture > img
 * The source has no visible label text; it is derived from a non-empty heading, then the
 * image alt ("Shop X now."), then the URL slug.
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

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function deriveLabel(col, alt, href) {
  const heading = textOf(col.querySelector('h1, h2, h3, h4, h5, h6'));
  if (heading) return heading;
  const m = (alt || '').match(/^shop\s+(.+?)\s+now\.?$/i);
  if (m) return m[1];
  try {
    const parts = new URL(href, 'https://www.lowes.com').pathname.split('/').filter(Boolean);
    const slug = parts.find((p, i) => i > 0 && !/^\d+$/.test(p)) || parts[parts.length - 1];
    if (slug) {
      return decodeURIComponent(slug).replace(/[-_]+/g, ' ')
        .replace(/\b([a-z])/g, (c) => c.toUpperCase());
    }
  } catch (e) { /* ignore */ }
  return (alt || '').replace(/\s*shop now\.?$/i, '').trim();
}

export default function parse(element, { document }) {
  let cols = [...element.querySelectorAll(':scope > div.col, :scope > div[class*="ColumnWrapper"]')];
  if (!cols.length) cols = [...element.querySelectorAll(':scope > div')];

  const cells = [];
  cols.forEach((col) => {
    const srcImg = col.querySelector('img');
    const anchor = col.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]')
      || srcImg?.closest('a[href]') || col.querySelector('a[href]');
    if (!srcImg && !anchor) return;

    let imageCell = '';
    const alt = (srcImg?.getAttribute('alt') || '').trim();
    const src = srcImg?.getAttribute('src') || srcImg?.getAttribute('data-src');
    if (src) {
      const img = document.createElement('img');
      img.src = absUrl(src);
      img.alt = alt;
      const mobileImg = mobileImage(srcImg, absUrl(src), document);
      imageCell = mobileImg ? [img, mobileImg] : img;
    }

    let linkCell = '';
    if (anchor) {
      const href = absUrl(anchor.getAttribute('href'));
      const a = document.createElement('a');
      a.href = href;
      a.textContent = textOf(anchor) || deriveLabel(col, alt, href) || 'Shop Now';
      linkCell = a;
    }

    cells.push([imageCell, linkCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
