/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns. Source: https://www.lowes.com/
 * Block model (blocks/columns-promo/README.md): single row, one cell per banner column.
 *   cell 1 = linked HomeCare+ banner image + "Get Details" text
 *   cell 2 = linked First Responders banner image
 * Source: div[class*="RowWrapper-RC"] > div[class*="ColumnWrapper-RC"] (.d-span-8 / .d-span-4)
 *   > [data-testid="playwright-unified-scaled-image"] a.scaled-image-primary-link > picture > img
 *   + optional .secondary-link-wrapper h6 "Get Details" (role=button, no href)
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
  let columns = [...element.querySelectorAll(':scope > div[class*="ColumnWrapper"]')];
  if (!columns.length) columns = [...element.querySelectorAll(':scope > div')];

  const row = [];
  columns.forEach((col) => {
    const content = [];
    const srcImg = col.querySelector('img');
    if (srcImg) {
      const src = srcImg.getAttribute('src') || srcImg.getAttribute('data-src');
      if (src) {
        const img = document.createElement('img');
        img.src = absUrl(src);
        img.alt = (srcImg.getAttribute('alt') || '').trim();
        const mobileImg = mobileImage(srcImg, absUrl(src), document);
        const images = mobileImg ? [img, mobileImg] : [img];
        const anchor = srcImg.closest('a[href]')
          || col.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]');
        if (anchor) {
          const a = document.createElement('a');
          a.href = absUrl(anchor.getAttribute('href'));
          a.append(...images);
          content.push(a);
        } else {
          content.push(...images);
        }
      }
    }

    const details = col.querySelector('.secondary-link-wrapper, [data-testid="playwright-secondary-link"]');
    if (details) {
      const label = details.textContent.replace(/\s+/g, ' ').trim();
      const dLink = details.querySelector('a[href]');
      if (label) {
        const p = document.createElement('p');
        if (dLink) {
          const a = document.createElement('a');
          a.href = absUrl(dLink.getAttribute('href'));
          a.textContent = label;
          p.append(a);
        } else {
          p.textContent = label;
        }
        content.push(p);
      }
    }

    if (content.length) row.push(content);
  });

  if (!row.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
