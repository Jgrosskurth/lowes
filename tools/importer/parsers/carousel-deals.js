/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-deals. Base: carousel (custom). Source: https://www.lowes.com/
 * Block model (blocks/carousel-deals/README.md):
 *   one row per deal card:
 *     cell 1 = <h3>card title</h3> + <p><a href=VIEW_ALL>View All</a></p>
 *     cell 2 = tiles, each starting at a linked image:
 *       <p><a href=PDP title=NAME><img src alt=NAME></a></p>
 *       <p>Save NN%</p>                              (optional)
 *       <p>$48.32 <del>$64.42</del></p>  OR  <p>This item is currently unavailable</p>
 *       <p>4.4 stars (392)</p>                       (rating + count, or count only)
 *       <p><a href=PDP>Add to Cart</a></p>           (only when the tile has an ATC button)
 * Source (.dynamic-cards-wrapper-container):
 *   cards  = .carousel-item-custom (inside .parent-slot-N)
 *   title  = #recs-card-title p  /  [class*="styles__Title"]
 *   ViewAll= a[data-testid="count-down-view-more-link"]
 *   tiles  = quadrant: .box[data-testid^="product-test-card"]
 *            pair:     [class*="TwoProductCardstyles__ContainerItem"]
 * Iteration is keyed on block-level tile wrappers, never on the gauge-click anchors
 * (structure.json flags button.addToCart nested inside a.gauge-click).
 * Source img alt repeats the card title, so the name is built from brand + description.
 */
const ORIGIN = 'https://www.lowes.com';

function absUrl(href) {
  if (!href) return '';
  const h = href.trim();
  if (!h || h.startsWith('#') || h.startsWith('javascript:')) return '';
  if (h.startsWith('//')) return `https:${h}`;
  if (h.startsWith('/')) return `${ORIGIN}${h}`;
  if (/^https?:/i.test(h)) return h;
  return '';
}

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function para(document, ...children) {
  const p = document.createElement('p');
  children.forEach((c) => { if (c !== null && c !== undefined && c !== '') p.append(c); });
  return p;
}

function link(document, href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

function productName(tile) {
  const desc = tile.querySelector(
    '.productDescription, [class*="TwoProductCardstyles__Brand-"], [class*="BrandWrapper"] p, [class*="product-desc"]',
  );
  if (!desc) return '';
  const b = desc.querySelector('b, strong');
  const brand = textOf(b).replace(/,\s*$/, '').trim();
  let rest = textOf(desc);
  const bText = textOf(b);
  if (bText && rest.startsWith(bText)) rest = rest.slice(bText.length).trim();
  return [brand, rest].filter(Boolean).join(' ');
}

function buildTile(tile, document) {
  const out = [];
  const pdpAnchor = tile.querySelector('a.gauge-click[href], a[href*="/pd/"], a[href*="/configure/"]')
    || tile.querySelector('a[href]');
  const href = pdpAnchor ? absUrl(pdpAnchor.getAttribute('href')) : '';
  const name = productName(tile);

  // Image (required: tiles start at an image)
  const srcImg = tile.querySelector('img.product-image, img');
  const src = srcImg ? (srcImg.getAttribute('src') || srcImg.getAttribute('data-src') || '').trim() : '';
  const imgSrc = absUrl(src);
  if (!imgSrc) return out;
  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = name;
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    if (name) a.title = name;
    a.append(img);
    out.push(para(document, a));
  } else {
    out.push(para(document, img));
  }

  // Savings badge
  const badge = [...tile.querySelectorAll('.badge-label, [data-testid="badge-container"]')]
    .map(textOf).find((t) => /^save\b|%\s*off/i.test(t));
  if (badge) out.push(para(document, badge));

  // Visible product name: bold brand (with its trailing comma, as on source) + product text
  const desc = tile.querySelector(
    '.productDescription, [class*="TwoProductCardstyles__Brand-"], [class*="BrandWrapper"] p, [class*="product-desc"]',
  );
  if (desc) {
    const b = desc.querySelector('b, strong');
    const brandText = textOf(b);
    let rest = textOf(desc);
    if (brandText && rest.startsWith(brandText)) rest = rest.slice(brandText.length).trim();
    const p = document.createElement('p');
    if (brandText) {
      const strong = document.createElement('strong');
      strong.textContent = brandText;
      p.append(strong);
      if (rest) p.append(' ');
    }
    if (rest) p.append(rest);
    if (p.textContent.trim()) out.push(p);
  }

  // Price / was-price or availability
  const price = textOf(tile.querySelector('.striker-final-price, [class*="final-price"]'));
  const was = textOf(tile.querySelector('.striker-previous-price, [class*="previous-price"]'));
  const oos = textOf(tile.querySelector('.oos-info, [class*="oos-info"]'));
  if (price) {
    const p = para(document, price);
    if (was && was !== price) {
      const del = document.createElement('del');
      del.textContent = was;
      p.append(' ', del);
    }
    out.push(p);
  } else if (oos) {
    out.push(para(document, oos));
  }

  // Rating + review count (first occurrence; pair tiles duplicate desktop/mobile ratings)
  // Note: the pair-layout gauge anchor carries aria-label="4 Stars & Above" (the card title),
  // so only accept labels shaped exactly like "4.4 Stars".
  const ratingMatch = [...tile.querySelectorAll('[class*="RatingWrapper"][aria-label], span[aria-label], div[aria-label]')]
    .map((el) => (el.getAttribute('aria-label') || '').trim().match(/^(\d+(?:\.\d+)?)\s*stars?$/i))
    .find(Boolean) || null;
  const count = textOf(tile.querySelector('.rating-count, [class*="rating-count"]'));
  if (ratingMatch && count) out.push(para(document, `${ratingMatch[1]} stars (${count})`));
  else if (ratingMatch) out.push(para(document, `${ratingMatch[1]} stars`));
  else if (count) out.push(para(document, count));

  // Add to Cart CTA
  const atc = [...tile.querySelectorAll('button, a')]
    .find((b) => /add to cart/i.test(textOf(b)));
  if (atc && href) out.push(para(document, link(document, href, 'Add to Cart')));

  return out;
}

function findTiles(card) {
  let tiles = [...card.querySelectorAll('.box[data-testid^="product-test-card"], [class*="TwoProductCardstyles__ContainerItem"]')];
  if (!tiles.length) tiles = [...card.querySelectorAll('[class*="gridstyles__ContainerItem"], .column-wrapper')];
  // drop wrappers nested inside another matched wrapper
  return tiles.filter((t) => !tiles.some((o) => o !== t && o.contains(t)));
}

export default function parse(element, { document }) {
  let cards = [...element.querySelectorAll('.carousel-item-custom, [data-testid="carouselTestId"]')];
  cards = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
  if (!cards.length) cards = [...element.querySelectorAll('[class*="parent-slot-"]')];

  const cells = [];
  cards.forEach((card) => {
    const title = textOf(card.querySelector('#recs-card-title p, [class*="styles__Title"], #recs-card-title'));
    // The empty data-testid anchor may be dropped by the importer; lowes-cleanup.js then
    // restores its href onto the visible ViewMore anchor.
    const viewAll = card.querySelector('a[data-testid="count-down-view-more-link"][href], a[class*="ViewMore"][href]');
    const viewHref = viewAll ? absUrl(viewAll.getAttribute('href')) : '';

    const head = [];
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      head.push(h3);
    }
    if (viewHref) head.push(para(document, link(document, viewHref, 'View All')));

    const tileContent = [];
    findTiles(card).forEach((tile) => tileContent.push(...buildTile(tile, document)));

    if (!head.length && !tileContent.length) return;
    cells.push([head.length ? head : '', tileContent.length ? tileContent : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-deals', cells });
  element.replaceWith(block);
}
