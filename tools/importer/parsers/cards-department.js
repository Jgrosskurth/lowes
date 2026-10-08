/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-department. Base: cards. Source: https://www.lowes.com/
 * Block model (blocks/cards-department/README.md): one row per department (24 rows).
 *   cell 1 = icon tile image
 *   cell 2 = department link with label
 * "Show More" is rendered by the block JS and is intentionally not migrated.
 * Source: div[class*="FeatureTilesWrapper-RC"] .row > div[class*="FeatureTilesGridColumn"] (x24)
 *   > a[class*="FeatureTilesLink"][href] > ... img (alt/title "Shop X Products.")
 * The label is baked into the icon; it is derived from the anchor text, then
 * data-testid / alt / title ("Shop Appliances." -> "Appliances").
 */
function absUrl(href) {
  if (!href) return '';
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) return `https://www.lowes.com${href}`;
  return href;
}

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanLabel(raw) {
  const label = (raw || '').trim()
    .replace(/^shop\s+/i, '')
    .replace(/\.$/, '')
    .replace(/\s+now$/i, '')
    .replace(/\s+products$/i, '')
    .trim();
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function parse(element, { document }) {
  // Iterate the grid column wrappers (block-level), not the tile anchors.
  let tiles = [...element.querySelectorAll('div[class*="FeatureTilesGridColumn"]')];
  if (!tiles.length) tiles = [...element.querySelectorAll('.row > div')];
  if (!tiles.length) {
    tiles = [...element.querySelectorAll('a[href]')].map((a) => a.parentElement).filter((p, i, arr) => arr.indexOf(p) === i);
  }

  const cells = [];
  tiles.forEach((tile) => {
    const anchor = tile.querySelector('a[class*="FeatureTilesLink"][href]') || tile.querySelector('a[href]');
    const srcImg = tile.querySelector('img');
    if (!anchor && !srcImg) return;

    let imageCell = '';
    const src = srcImg?.getAttribute('src') || srcImg?.getAttribute('data-src');
    const alt = (srcImg?.getAttribute('alt') || srcImg?.getAttribute('title') || '').trim();
    if (src) {
      const img = document.createElement('img');
      img.src = absUrl(src);
      img.alt = alt;
      imageCell = img;
    }

    let linkCell = '';
    if (anchor) {
      const label = textOf(anchor)
        || cleanLabel(anchor.getAttribute('data-testid'))
        || cleanLabel(alt)
        || cleanLabel(anchor.getAttribute('aria-label'))
        || cleanLabel(anchor.getAttribute('title'));
      const a = document.createElement('a');
      a.href = absUrl(anchor.getAttribute('href'));
      a.textContent = label || a.href;
      linkCell = a;
    }

    cells.push([imageCell, linkCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-department', cells });
  element.replaceWith(block);
}
