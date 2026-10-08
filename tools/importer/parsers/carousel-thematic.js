/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-thematic. Base: carousel. Source: https://www.lowes.com/
 * Block model (blocks/carousel-thematic/README.md, decorated via scripts/product-carousel.js):
 *   row 1     = thematic panel: cell 1 = thematic image, cell 2 = tab label heading + "Shop All" link
 *   rows 2..n = products: cell 1 = product image,
 *               cell 2 = brand (bold) + title linked to PDP, price, was-price (del) + savings,
 *                        rating/review count, social-proof text, "Add to Cart" link
 * Source: [data-component="ThematicV2"] / div[class*="Thematicstyles__WrapperComponent"]
 *   tabs:     button.recs-tab (.selected = active tab label)
 *   thematic: .thematic-image-container a[href] > img
 *   products: .thematic-carousel-container .carousel-item > [data-component="ProductCard"] > .product-card
 * Only the active tab's products are present in the DOM; the parser emits that tab.
 * Prices / Add to Cart are hydrated client-side and may be absent in the snapshot; they are
 * emitted when present. Iteration is keyed on the card wrappers, never on the PDP anchors.
 */
const ORIGIN = 'https://www.lowes.com';

function absUrl(href) {
  if (!href) return '';
  const h = href.trim();
  if (h.startsWith('//')) return `https:${h}`;
  if (h.startsWith('/')) return `${ORIGIN}${h}`;
  return h;
}

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function makeImg(document, srcImg) {
  if (!srcImg) return null;
  const src = srcImg.getAttribute('src') || srcImg.getAttribute('data-src');
  if (!src || src.startsWith('data:')) return null;
  const img = document.createElement('img');
  img.src = absUrl(src);
  img.alt = (srcImg.getAttribute('alt') || '').trim();
  return img;
}

function para(document, ...children) {
  const p = document.createElement('p');
  children.forEach((c) => { if (c) p.append(c); });
  return p;
}

function buildProductRow(card, document) {
  const pdp = card.querySelector('a[href*="/pd/"]') || card.querySelector('a[href]');
  const href = pdp ? absUrl(pdp.getAttribute('href')) : '';
  const img = makeImg(document, card.querySelector('picture img, [class*="CardImage"] img, .image-container-wrapper img'));

  const body = [];
  const brand = textOf(card.querySelector('.brand-name, [class*="brand"]'));
  const desc = textOf(card.querySelector('.product-desc, [class*="product-desc"]'));
  const titleText = desc || (img ? img.alt : '');
  if (brand || titleText) {
    const p = document.createElement('p');
    if (brand) {
      const strong = document.createElement('strong');
      strong.textContent = brand;
      p.append(strong);
      if (titleText) p.append(' ');
    }
    if (titleText) {
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = titleText;
        p.append(a);
      } else {
        p.append(titleText);
      }
    }
    body.push(p);
  }

  // Current price (hydrated: .recs-final-price -> <sup>$</sup><span>299</span><sup>.00</sup>)
  const priceEl = card.querySelector('.recs-final-price, [class*="RegularPrice"], [class*="final-price"]');
  const price = priceEl ? priceEl.textContent.replace(/\s+/g, '') : '';
  if (/\$\d/.test(price)) body.push(para(document, price));

  // Was-price + savings
  const was = textOf(card.querySelector('.recs-strickthrough-price, [class*="Strikethrough"]'));
  const save = textOf(card.querySelector('.recs-price-block-message, [class*="price-block-message"]'));
  if (was || save) {
    const p = document.createElement('p');
    if (was) {
      const del = document.createElement('del');
      del.textContent = was;
      p.append(del);
      if (save) p.append(' ');
    }
    if (save) p.append(save);
    body.push(p);
  }

  // Promo message (e.g. "Buy 2, Save 10%") when present
  const promo = textOf(card.querySelector('[data-component="PromoMessage"], [class*="PromoMessage"]'));
  if (promo) body.push(para(document, promo));

  // Rating + review count
  const ratingEl = card.querySelector('[role="img"][aria-label*="Star" i], .rating, [class*="RatingWrapper"]');
  const count = textOf(card.querySelector('.rating-count, [class*="rating-count"]')).replace(/[()]/g, '');
  let rating = '';
  const label = ratingEl?.getAttribute('aria-label') || '';
  const m = label.match(/(\d(?:\.\d+)?)/);
  if (m) rating = m[1];
  else if (ratingEl) {
    const filled = ratingEl.querySelectorAll('.rating-icon.filled').length;
    if (filled) rating = String(Math.min(5, filled));
  }
  if (rating) {
    body.push(para(document, `${rating} out of 5 stars${count ? ` (${count} reviews)` : ''}`));
  }

  // Social proof badge
  const social = textOf(card.querySelector('.social-proofing-badge-label, [class*="social-proof"]'));
  if (social) body.push(para(document, social));

  // Add to Cart (button in source, no href) -> link to the PDP
  const atc = card.querySelector('[data-component="AddToCart"], [class*="AddToCart"], .atc-button');
  if (atc && href) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = textOf(atc.querySelector('.atc-button, button')) || 'Add to Cart';
    if (!/add to cart/i.test(a.textContent)) a.textContent = 'Add to Cart';
    body.push(para(document, a));
  }

  if (!img && !body.length) return null;
  return [img || '', body.length ? body : ''];
}

export default function parse(element, { document }) {
  const cells = [];

  // Row 1: thematic panel
  const thematicLink = element.querySelector('.thematic-image-container a[href], [data-component="ThematicVariant"] a[href]');
  const thematicImg = makeImg(document, element.querySelector('.thematic-image-container img, [data-component="ThematicVariant"] img'));
  const activeTab = element.querySelector('.recs-tab.selected, [role="tab"][aria-selected="true"], [role="tab"].selected')
    || element.querySelector('.recs-tab, [role="tab"]');
  const tabLabel = (activeTab?.getAttribute('aria-label') || textOf(activeTab)).trim();
  if (thematicImg || tabLabel) {
    const content = [];
    const h2 = document.createElement('h2');
    h2.textContent = tabLabel || 'Featured';
    content.push(h2);
    if (thematicLink) {
      const a = document.createElement('a');
      a.href = absUrl(thematicLink.getAttribute('href'));
      a.textContent = 'Shop All';
      content.push(para(document, a));
    }
    cells.push([thematicImg || '', content]);
  }

  // Rows 2..n: products (iterate card wrappers, not anchors)
  const scope = element.querySelector('.thematic-carousel-container') || element;
  let cards = [...scope.querySelectorAll('[data-component="ProductCard"]')];
  if (!cards.length) cards = [...scope.querySelectorAll('[class*="ProductCardstyles__WrapperComponent"]')];
  if (!cards.length) cards = [...scope.querySelectorAll('.product-card')];
  cards.forEach((card) => {
    const row = buildProductRow(card, document);
    if (row) cells.push(row);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-thematic', cells });
  element.replaceWith(block);
}
