/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-product. Base: carousel. Source: https://www.lowes.com/
 * Block model (blocks/carousel-product/README.md, decorated via scripts/product-carousel.js):
 *   optional heading row = carousel title (+ helper text such as "Sponsored")
 *   optional config row  = slot | <recommendation slot id> (runtime personalisation hook)
 *   optional pills row   = pills | <ul> of filter pill labels (first = selected)
 *   product rows         = cell 1 = product image,
 *                          cell 2 = brand (bold) + title linked to PDP, price, was-price (del)
 *                                   + savings, rating/review count, social proof, "Add to Cart" link
 * Source instances:
 *   [id^="lws_hp_recommendations_belowimage_0"]  "Find Your Next Project": NPCContentCard article cards
 *     (.product-card > a.article-link > img + .article-name + p.article-desc)
 *   [id^="lws_hp_recommendations_belowimage_1"]  "Items To Explore" (Sponsored) with filter pills:
 *     ProductCard cards (.product-card > a[href^="/pd/"] > img + .brand-name + .product-desc ...)
 * Filter pills (button[class*="PillButtonstyles__ButtonWrapper"] > p) are interactive refinements
 * whose other result sets are not in the DOM; their labels are migrated as a keyed `pills` row so
 * the block can render the (presentational) pill bar. Only the selected filter's products exist.
 * Heading CTA links (e.g. "More Suggestions for You") are lifted out of the h3 into a sibling <p>
 * by transformers/lowes-cleanup.js and are kept in the heading row.
 * Prices / Add to Cart are hydrated client-side and may be absent in the snapshot; they are
 * emitted when present. Iteration is keyed on card wrappers, never on the PDP anchors.
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

function link(document, href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

function buildCardRow(card, document) {
  const pdp = card.querySelector('a[href*="/pd/"], a.article-link[href]') || card.querySelector('a[href]');
  const href = pdp ? absUrl(pdp.getAttribute('href')) : '';
  const img = makeImg(document, card.querySelector('picture img, [class*="image-container"] img, img'));

  const body = [];
  const brand = textOf(card.querySelector('.brand-name, [class*="brand-name"]'));
  const desc = textOf(card.querySelector('.product-desc, [class*="product-desc"], .article-name, [class*="article-name"]'));
  const titleText = desc || (img ? img.alt : '');
  if (brand || titleText) {
    const p = document.createElement('p');
    if (brand) {
      const strong = document.createElement('strong');
      strong.textContent = brand;
      p.append(strong);
      if (titleText) p.append(' ');
    }
    if (titleText) p.append(href ? link(document, href, titleText) : titleText);
    body.push(p);
  }

  // Article cards: optional description paragraph
  const articleDesc = textOf(card.querySelector('.article-desc'));
  if (articleDesc) body.push(para(document, articleDesc));

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

  // Promo message when present
  const promo = textOf(card.querySelector('[data-component="PromoMessage"], [class*="PromoMessage"]'));
  if (promo) body.push(para(document, promo));

  // Rating + review count
  const ratingEl = card.querySelector('[role="img"][aria-label*="Star" i], .rating, [class*="RatingWrapper"]');
  const count = textOf(card.querySelector('.rating-count, [class*="rating-count"]')).replace(/[()]/g, '');
  let rating = '';
  const m = (ratingEl?.getAttribute('aria-label') || '').match(/(\d(?:\.\d+)?)/);
  if (m) rating = m[1];
  else if (ratingEl) {
    const filled = ratingEl.querySelectorAll('.rating-icon.filled').length;
    if (filled) rating = String(Math.min(5, filled));
  }
  if (rating) body.push(para(document, `${rating} out of 5 stars${count ? ` (${count} reviews)` : ''}`));

  // Social proof badge
  const social = textOf(card.querySelector('.social-proofing-badge-label, [class*="social-proof"]'));
  if (social) body.push(para(document, social));

  // Add to Cart (button in source, no href) -> link to the PDP
  const atc = card.querySelector('[data-component="AddToCart"], [class*="AddToCart"], .atc-button');
  if (atc && href) body.push(para(document, link(document, href, 'Add to Cart')));

  if (!img && !body.length) return null;
  return [img || '', body.length ? body : ''];
}

export default function parse(element, { document }) {
  const cells = [];

  // Heading row: carousel title + helper text ("Sponsored")
  const titleEl = element.querySelector('.recs-carousel-title, [class*="carousel-title"]:is(h1, h2, h3, h4, h5, h6)')
    || element.querySelector('h1, h2, h3, h4, h5, h6');
  const title = textOf(titleEl) || (titleEl?.getAttribute('aria-label') || '').trim();
  if (title) {
    const heading = [];
    const h3 = document.createElement('h3');
    h3.textContent = title;
    heading.push(h3);
    const helper = textOf(element.querySelector('.recs-carousel-title-wrapper .helper-text, [class*="Titlestyles"] .helper-text'));
    if (helper) heading.push(para(document, helper));
    // CTA links next to the title (lifted out of the h3 by the cleanup transformer)
    const titleWrap = titleEl?.closest('.recs-carousel-title-wrapper') || titleEl?.parentElement;
    if (titleWrap) {
      [...titleWrap.querySelectorAll(':scope > p > a[href], .recs-carousel-title-cta a[href]')].forEach((a) => {
        const text = textOf(a);
        if (text) heading.push(para(document, link(document, absUrl(a.getAttribute('href')), text)));
      });
    }
    cells.push([heading, '']);
  }

  // Config row: recommendation slot id (keeps the runtime personalisation hook)
  const slot = (element.id || element.querySelector('.mfe-app[data-testid]')?.getAttribute('data-testid')
    || element.querySelector('[id^="lws_hp_recommendations"]')?.id || '').trim();
  if (/^[a-z0-9]+(?:[_-][a-z0-9]+)+$/i.test(slot)) cells.push(['slot', slot]);

  // Filter pills row: pills | <ul><li>label</li>...</ul>
  // Found: <button class="PillButtonstyles__ButtonWrapper-... recs-pill-button first-pill" aria-pressed="true"
  //          aria-label="Appliances filter option, selected"><p ...>Appliances</p></button>
  const pillLabels = [];
  element.querySelectorAll('button[class*="PillButtonstyles__ButtonWrapper"], [data-component="PillButton"], .recs-pill-button')
    .forEach((btn) => {
      const label = textOf(btn.querySelector('p')) || textOf(btn)
        || (btn.getAttribute('aria-label') || '').replace(/\s*filter option.*$/i, '').trim();
      if (label && !pillLabels.includes(label)) pillLabels.push(label);
    });
  if (pillLabels.length) {
    const ul = document.createElement('ul');
    pillLabels.forEach((label) => {
      const li = document.createElement('li');
      li.textContent = label;
      ul.append(li);
    });
    cells.push(['pills', ul]);
  }

  // Product / content cards (iterate card wrappers, not anchors)
  let cards = [...element.querySelectorAll('[data-component="ProductCard"], [data-component="NPCContentCard"]')];
  if (!cards.length) {
    cards = [...element.querySelectorAll('[class*="ProductCardstyles__WrapperComponent"], [class*="NPCContentCardstyles__WrapperComponent"]')];
  }
  if (!cards.length) cards = [...element.querySelectorAll('.carousel-item .product-card')];
  if (!cards.length) cards = [...element.querySelectorAll('.carousel-item')];

  let productRows = 0;
  cards.forEach((card) => {
    const row = buildCardRow(card, document);
    if (row) {
      cells.push(row);
      productRows += 1;
    }
  });

  if (!productRows && !title) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
