/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards. Source: https://www.lowes.com/
 * Block model (blocks/cards-article/README.md): one row per article (4 rows).
 *   cell 1 = photo
 *   cell 2 = title heading, description (or list), CTA link ("Learn More" / "Get Started")
 * Source: outer RowWrapper > 2 x ColumnWrapper(.d-span-6) > GridWrapper > ContentInnerWrapper
 *   > RowWrapper > 2 x ColumnWrapper > [data-testid="playwright-unified-scaled-image"]
 *   > (optional h2) a.scaled-image-primary-link > picture > img
 * On the homepage the title/description copy is baked into the image (alt kept) and the
 * h2 elements are empty, so cell 2 holds any non-empty heading/text plus the CTA link,
 * whose label is derived from the alt's call to action ("... Learn more now." -> "Learn More").
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

function ctaLabel(alt) {
  const a = (alt || '').toLowerCase();
  if (/get started/.test(a)) return 'Get Started';
  if (/schedule/.test(a)) return 'Schedule Now';
  if (/shop/.test(a)) return 'Shop Now';
  return 'Learn More';
}

export default function parse(element, { document }) {
  // Iterate the scaled-image wrappers (block-level, one per article).
  let items = [...element.querySelectorAll('[data-testid="playwright-unified-scaled-image"]')];
  if (!items.length) items = [...element.querySelectorAll('[class*="Wrapper-RC"]:has(> [class*="SubWrapper"])')];
  if (!items.length) {
    items = [...element.querySelectorAll('img')].map((img) => img.closest('[class*="ColumnWrapper"]') || img.parentElement);
  }

  const cells = [];
  items.forEach((item) => {
    const srcImg = item.querySelector('img');
    const anchor = item.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]')
      || srcImg?.closest('a[href]') || item.querySelector('a[href]');
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

    const body = [];
    const title = textOf(item.querySelector('h1, h2, h3, h4, h5, h6'));
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      body.push(h3);
    }
    // visible description text outside the image link (none on the homepage today)
    item.querySelectorAll('p, ul, ol').forEach((el) => {
      if (!textOf(el) || (anchor && anchor.contains(el))) return;
      body.push(el.cloneNode(true));
    });
    if (anchor) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = absUrl(anchor.getAttribute('href'));
      a.textContent = textOf(anchor) || ctaLabel(alt);
      p.append(a);
      body.push(p);
    }

    cells.push([imageCell, body.length ? body : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
