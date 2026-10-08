import { createOptimizedPicture } from './aem.js';

/**
 * Shared helpers for product-card carousels (carousel-thematic, carousel-product, carousel-deals).
 * Every class name is derived from the caller's `prefix` (the block name) so each block's
 * markup stays scoped to its own block class.
 *
 * Product row contract (one row per product, cells may be omitted or reordered):
 *   cell 1 = product image (optionally linked to the PDP)
 *   cell 2 = brand (bold) + title (linked to PDP), price, was-price (strikethrough) + savings,
 *            rating / review count, social-proof text, "Add to Cart" link
 * A row with only an image and a linked title (no price, rating or CTA) is a content card
 * (e.g. a how-to article) and gets the `{prefix}-card-content` class.
 */

const CTA_RE = /add to cart|add to bag|buy now|view details/i;
const PRICE_RE = /^\s*\$\s?\d/;
const PRICE_PARTS_RE = /^\s*\$\s?([\d,]+)(\.\d{1,2})?\s*$/;
const RATING_RE = /(\d(?:\.\d+)?)\s*(?:out of\s*5|\/\s*5|stars?)/i;
const COUNT_RE = /\(?\s*(\d[\d,.]*\s*[kKmM]?\+?)\s*(?:reviews?|ratings?)?\s*\)?\s*$/i;
const SOCIAL_RE = /bought|carts?\b|sold|viewed|in demand/i;
const INLINE_TAGS = /^(A|STRONG|B|EM|I|SPAN|DEL|S|SUP|SUB|BR|PICTURE|IMG|U|SMALL)$/;

function textOf(el) {
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

/**
 * Parses rating text such as "4.8 out of 5 stars (3459 reviews)", "4.4 stars (392)" or "★★★★ 12".
 * @param {Element} el line element
 * @returns {{value: number, count: string}|null}
 */
export function parseRating(el) {
  const text = textOf(el);
  const stars = (text.match(/★/g) || []).length;
  const match = text.match(RATING_RE);
  if (!match && !stars) return null;
  const value = match ? parseFloat(match[1]) : stars;
  const rest = text.replace(match ? match[0] : '', '').replace(/[★☆]/g, '');
  const count = (rest.match(COUNT_RE) || [])[1];
  return { value: Math.min(5, Math.max(0, value)), count: count ? count.replace(/\s+/g, '') : '' };
}

/**
 * Builds a star rating line (`{prefix}-card-rating`) with stars drawn by CSS from `--rating`.
 * @param {{value: number, count: string}} rating parsed rating
 * @param {string} prefix class prefix
 * @param {string} [part] class infix, e.g. 'card' or 'tile'
 * @returns {HTMLParagraphElement}
 */
export function buildRating(rating, prefix, part = 'card') {
  const wrap = document.createElement('p');
  wrap.className = `${prefix}-${part}-rating`;
  if (rating.value !== null && rating.value !== undefined) {
    const stars = document.createElement('span');
    stars.className = `${prefix}-${part}-stars`;
    stars.style.setProperty('--rating', rating.value);
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', `${rating.value} out of 5 stars`);
    wrap.append(stars);
  }
  if (rating.count) {
    const count = document.createElement('span');
    count.className = `${prefix}-${part}-reviews`;
    count.textContent = rating.count;
    count.setAttribute('aria-label', `${rating.count} reviews`);
    wrap.append(count);
  }
  return wrap;
}

/**
 * Renders "$1,299.00" as <sup>$</sup>1,299<sup>.00</sup> (text content stays "$1,299.00").
 * Lines that are not a single plain amount are left untouched.
 * @param {Element} line price line
 * @param {string} prefix class prefix
 */
function formatPrice(line, prefix) {
  if (line.children.length) return;
  const parts = textOf(line).match(PRICE_PARTS_RE);
  if (!parts) return;
  const cur = document.createElement('sup');
  cur.textContent = '$';
  const whole = document.createElement('span');
  whole.className = `${prefix}-card-price-whole`;
  const [, dollars, decimals] = parts;
  whole.textContent = dollars;
  line.replaceChildren(cur, whole);
  if (decimals) {
    const cents = document.createElement('sup');
    cents.textContent = decimals;
    line.append(cents);
  }
}

/** Wraps the loose text next to a struck-through was-price ("Save 25%") in a span. */
function markSavings(line, prefix) {
  [...line.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
    const span = document.createElement('span');
    span.className = `${prefix}-card-save`;
    span.textContent = node.textContent.trim();
    node.replaceWith(span);
  });
}

/** Turns loose inline nodes of a cell into <p> lines so classification works on any shape. */
function toLines(body) {
  let current = null;
  [...body.childNodes].forEach((node) => {
    const inline = node.nodeType === Node.TEXT_NODE
      || (node.nodeType === Node.ELEMENT_NODE && INLINE_TAGS.test(node.tagName));
    if (!inline) {
      current = null;
      return;
    }
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim() && !current) {
      node.remove();
      return;
    }
    if (!current) {
      current = document.createElement('p');
      node.before(current);
    }
    current.append(node);
  });
  return [...body.children];
}

/**
 * Builds a product card <li> from an authored row.
 * @param {Element} row authored block row
 * @param {string} prefix block name used as the class prefix
 * @returns {HTMLLIElement|null}
 */
export function buildProductCard(row, prefix) {
  const cells = [...row.children];
  if (!cells.some((c) => textOf(c) || c.querySelector('picture, img'))) return null;

  const li = document.createElement('li');
  li.className = `${prefix}-card`;

  const imageCell = cells.find((c) => c.querySelector('picture, img') && !textOf(c))
    || cells.find((c) => c.querySelector('picture, img'));
  const body = document.createElement('div');
  body.className = `${prefix}-card-body`;
  cells.filter((c) => c !== imageCell).forEach((c) => body.append(...c.childNodes));

  // image (pictures found in the body cell are moved to the media slot too)
  const media = document.createElement('div');
  media.className = `${prefix}-card-image`;
  if (imageCell) media.append(...imageCell.childNodes);
  if (!media.querySelector('picture, img')) {
    const strayPic = body.querySelector('picture, img');
    if (strayPic) media.append(strayPic.closest('a') || strayPic);
  }
  media.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '300' }]));
  });

  const lines = toLines(body);

  let titleLink = null;
  let cta = null;
  let price = null;
  let was = null;
  let rating = null;
  lines.forEach((line) => {
    const text = textOf(line);
    if (!text) {
      line.remove();
      return;
    }
    const links = line.matches('a[href]') ? [line] : [...line.querySelectorAll('a[href]')];
    const ctaLink = links.find((a) => CTA_RE.test(textOf(a)));
    if (ctaLink && !cta) {
      cta = ctaLink;
      ctaLink.classList.remove('button');
      ctaLink.classList.add(`${prefix}-card-cta`);
      line.classList.remove('button-wrapper');
      line.classList.add(`${prefix}-card-actions`);
      return;
    }
    if (line.querySelector('del, s')) {
      was = was || line;
      line.classList.add(`${prefix}-card-was`);
      markSavings(line, prefix);
      return;
    }
    if (PRICE_RE.test(text)) {
      price = price || line;
      line.classList.add(`${prefix}-card-price`);
      formatPrice(line, prefix);
      return;
    }
    const parsed = parseRating(line);
    if (parsed) {
      rating = buildRating(parsed, prefix);
      line.replaceWith(rating);
      return;
    }
    if (!titleLink && (links.length || line.matches('h1, h2, h3, h4, h5, h6'))) {
      titleLink = links[0] || null;
      line.classList.add(`${prefix}-card-title`);
      return;
    }
    if (SOCIAL_RE.test(text)) {
      line.classList.add(`${prefix}-card-social`);
      return;
    }
    line.classList.add(`${prefix}-card-text`);
  });

  // price + was-price share one block so ratings line up across cards
  if (price || was) {
    const pricing = document.createElement('div');
    pricing.className = `${prefix}-card-pricing`;
    (price || was).before(pricing);
    pricing.append(...[price, was].filter(Boolean));
  }

  // brand is authored bold at the start of the title line
  const title = body.querySelector(`.${prefix}-card-title`);
  const brand = title && title.querySelector('strong, b');
  if (brand) brand.classList.add(`${prefix}-card-brand`);

  // link the image to the PDP when the author only linked the title
  const href = titleLink?.href;
  const mediaContent = media.querySelector('picture, img');
  if (href && mediaContent && !media.querySelector('a')) {
    const a = document.createElement('a');
    a.href = href;
    a.tabIndex = -1;
    a.setAttribute('aria-hidden', 'true');
    mediaContent.replaceWith(a);
    a.append(mediaContent);
  }

  // keep the CTA pinned to the bottom of the card
  const actions = body.querySelector(`.${prefix}-card-actions`);
  if (actions) body.append(actions);

  if (!price && !was && !rating && !cta) li.classList.add(`${prefix}-card-content`);
  if (media.children.length) li.append(media);
  if (body.children.length) li.append(body);
  return li;
}

/**
 * Wraps a track (<ul> or any scrollable row) with prev/next arrows and a scroll progress bar.
 * @param {HTMLElement} track scrollable element
 * @param {string} prefix class prefix for the scroller parts
 * @param {object} [options]
 * @param {boolean} [options.progress=true] render the scroll progress bar
 * @param {string} [options.prevLabel] accessible label of the previous arrow
 * @param {string} [options.nextLabel] accessible label of the next arrow
 * @returns {HTMLDivElement} scroller element
 */
export function createScroller(track, prefix, options = {}) {
  const {
    progress: withProgress = true,
    prevLabel = 'Previous products',
    nextLabel = 'Next products',
  } = options;
  const scroller = document.createElement('div');
  scroller.className = `${prefix}-scroller`;
  const viewport = document.createElement('div');
  viewport.className = `${prefix}-viewport`;

  const makeArrow = (dir, label) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `${prefix}-arrow ${prefix}-${dir}`;
    btn.setAttribute('aria-label', label);
    btn.addEventListener('click', () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = card ? card.getBoundingClientRect().width + gap : track.clientWidth / 2;
      const perPage = Math.max(1, Math.floor((track.clientWidth + gap) / step));
      track.scrollBy({ left: (dir === 'next' ? 1 : -1) * step * perPage, behavior: 'smooth' });
    });
    return btn;
  };
  const prev = makeArrow('prev', prevLabel);
  const next = makeArrow('next', nextLabel);

  viewport.append(prev, track, next);
  scroller.append(viewport);

  let bar = null;
  if (withProgress) {
    const progress = document.createElement('div');
    progress.className = `${prefix}-progress`;
    progress.setAttribute('aria-hidden', 'true');
    bar = document.createElement('span');
    progress.append(bar);
    scroller.append(progress);
  }

  const refresh = () => {
    const max = track.scrollWidth - track.clientWidth;
    const scrollable = max > 1;
    scroller.classList.toggle('is-scrollable', scrollable);
    prev.disabled = !scrollable || track.scrollLeft <= 1;
    next.disabled = !scrollable || track.scrollLeft >= max - 1;
    if (!bar) return;
    const visible = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
    bar.style.width = `${Math.min(100, visible * 100)}%`;
    bar.style.marginLeft = `${scrollable ? (track.scrollLeft / track.scrollWidth) * 100 : 0}%`;
  };
  track.addEventListener('scroll', refresh, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(refresh).observe(track);
  requestAnimationFrame(refresh);
  return scroller;
}
