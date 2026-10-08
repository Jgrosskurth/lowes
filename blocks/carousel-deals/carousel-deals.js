import { createOptimizedPicture } from '../../scripts/aem.js';
import { createScroller } from '../../scripts/product-carousel.js';

/**
 * carousel-deals: horizontally scrolling deal cards, each with a header and a grid of
 * mini product tiles ("quadrant").
 *
 * Content contract (one row per card, cells may be omitted):
 *   optional first row = a single heading with no image: block title shown above the track
 *   card row, cell 1   = card title (heading, bold or plain paragraph) + "View All" link
 *   card row, cell 2+  = product tiles. Each tile STARTS at an image (optionally linked to the
 *                        PDP; image alt / link title = product name) and owns every following
 *                        line until the next image. Tile lines, in any order:
 *                          - PDP link (if the image is not linked; text = product name)
 *                          - product name (brand authored bold), optional
 *                          - savings badge: "Save 25%"
 *                          - price: "$48.32", optionally with was-price "<del>$64.42</del>"
 *                          - was-price on its own line: "<del>$64.42</del>"
 *                          - availability note: "This item is currently unavailable"
 *                          - rating / reviews: "392", "8.6K", "4.4 stars (392)", "4.4 | 392"
 *                          - "Add to Cart" link
 *                        A list (<ul>/<ol>) where each item is one tile is also accepted.
 * Layout is driven by tile count: 3+ tiles = 2x2 quadrant (one-line ellipsized names),
 * 1-2 tiles = "pair" layout (image beside details, names and CTA visible).
 */
const PREFIX = 'carousel-deals';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const CTA_RE = /add to cart|add to bag|buy now/i;
const BADGE_RE = /^(save\b|\d+\s*%\s*off\b)/i;
const NOTE_RE = /unavailable|out of stock|sold out|not available/i;
const PRICES_RE = /\$\s?\d[\d,]*(?:\.\d{2})?/g;
const PRICE_LINE_RE = /^(?:now\s*|sale\s*)?\$\s?\d/i;
const COUNT_RE = /^\(?\s*(\d[\d,]*(?:\.\d+)?\s*[kKmM]?)\s*\)?(?:\s*reviews?)?$/i;
const RATING_RE = /(\d(?:\.\d+)?)\s*(?:stars?|out of\s*5|\/\s*5)/i;
const RATING_COUNT_RE = /^(\d(?:\.\d+)?)\s*[|/,]\s*(\d[\d,]*(?:\.\d+)?\s*[kKmM]?)$/;
const URL_TEXT_RE = /^(https?:\/\/|www\.|\/)/i;

let instanceCount = 0;

function textOf(node) {
  return (node?.textContent || '').replace(/\s+/g, ' ').trim();
}

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children);
  return node;
}

/**
 * Splits a list of nodes into block-level lines (<p>), breaking at <br>.
 * @param {Node[]} nodes inline or block nodes
 * @returns {HTMLElement[]}
 */
function toLines(nodes) {
  const lines = [];
  let current = null;
  const flush = () => {
    if (current && (textOf(current) || current.querySelector('picture, img'))) lines.push(current);
    current = null;
  };
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.matches('p, div, h1, h2, h3, h4, h5, h6')) {
      flush();
      if (node.querySelector('br')) {
        lines.push(...toLines([...node.childNodes]));
      } else if (textOf(node) || node.querySelector('picture, img')) {
        lines.push(node);
      }
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      flush();
      return;
    }
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim() && !current) return;
    if (!current) current = document.createElement('p');
    current.append(node);
  });
  flush();
  return lines;
}

/**
 * Groups the lines of one or more cells into tiles; every image starts a new tile.
 * @param {Element[]} cells tile cells
 * @returns {HTMLElement[][]} lines per tile
 */
function groupTiles(cells) {
  const tiles = [];
  let current = null;
  cells.forEach((cell) => {
    [...cell.children].filter((c) => c.matches('ul, ol')).forEach((list) => {
      [...list.children].forEach((li) => {
        const lines = toLines([...li.childNodes]);
        if (lines.length) tiles.push(lines);
      });
      list.remove();
    });
    toLines([...cell.childNodes]).forEach((line) => {
      if (line.querySelector('picture, img') || !current) {
        current = [];
        tiles.push(current);
      }
      current.push(line);
    });
  });
  return tiles;
}

function buildPicture(img) {
  const alt = img.getAttribute('alt') || '';
  let sameOrigin = false;
  try {
    sameOrigin = new URL(img.src, window.location.href).origin === window.location.origin;
  } catch { /* keep authored image */ }
  if (sameOrigin) return createOptimizedPicture(img.src, alt, false, [{ width: '300' }]);
  // external (not yet ingested) images cannot be resized by the media bus; keep them as authored
  const picture = img.closest('picture') || el('picture', '', img);
  img.loading = 'lazy';
  return picture;
}

function buildRating(value, count) {
  const wrap = el('p', `${PREFIX}-tile-rating`);
  if (value !== null) {
    const rating = Math.min(5, Math.max(0, value));
    const stars = el('span', `${PREFIX}-tile-stars`);
    stars.style.setProperty('--rating', rating);
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', `${rating} out of 5 stars`);
    wrap.append(stars);
  }
  if (count) {
    const reviews = el('span', `${PREFIX}-tile-reviews`, count);
    reviews.setAttribute('aria-label', `${count} reviews`);
    wrap.append(reviews);
  }
  return wrap;
}

function parseRating(text) {
  const pair = text.match(RATING_COUNT_RE);
  if (pair) return { value: parseFloat(pair[1]), count: pair[2].replace(/\s+/g, '') };
  const count = text.match(COUNT_RE);
  if (count) return { value: null, count: count[1].replace(/\s+/g, '') };
  const stars = (text.match(/★/g) || []).length;
  const rating = text.match(RATING_RE);
  if (!rating && !stars) return null;
  const rest = text.replace(rating ? rating[0] : /[★☆]+/, '').replace(/[★☆]/g, '');
  const restCount = (rest.match(/(\d[\d,]*(?:\.\d+)?\s*[kKmM]?)/) || [])[1];
  return {
    value: rating ? parseFloat(rating[1]) : stars,
    count: restCount ? restCount.replace(/\s+/g, '') : '',
  };
}

/**
 * Builds a tile from its authored lines.
 * @param {HTMLElement[]} lines authored lines of one tile
 * @param {string} cardTitle card title (source alt text often repeats it)
 * @returns {HTMLLIElement|null}
 */
function buildTile(lines, cardTitle) {
  let img = null;
  let href = '';
  let name = '';
  let nameEl = null;
  let badge = '';
  let price = '';
  let was = '';
  let note = '';
  let rating = null;
  let cta = null;
  const extras = [];

  lines.forEach((line) => {
    const lineImg = line.querySelector('img');
    if (lineImg && !img) {
      img = lineImg;
      const imgLink = lineImg.closest('a[href]');
      const link = imgLink || line.querySelector('a[href]');
      if (link) {
        href = link.getAttribute('href');
        if (link.title) name = name || link.title.trim();
      }
      // detach the image so any text on the same line is classified on its own
      (imgLink || lineImg.closest('picture') || lineImg).remove();
      if (link && link !== imgLink && textOf(link) && !URL_TEXT_RE.test(textOf(link))) {
        name = name || textOf(link);
      }
    }
    const text = textOf(line);
    const links = [...line.querySelectorAll('a[href]')];
    if (!text) return;
    const ctaLink = links.find((a) => CTA_RE.test(textOf(a)));
    if (ctaLink) {
      cta = cta || ctaLink;
      return;
    }
    if (BADGE_RE.test(text)) {
      badge = badge || text;
      return;
    }
    if (NOTE_RE.test(text)) {
      note = note || text;
      return;
    }
    const struck = line.querySelector('del, s');
    if (struck || PRICE_LINE_RE.test(text)) {
      const wasText = struck ? textOf(struck) : '';
      const rest = struck ? text.replace(wasText, '').trim() : text;
      const amounts = rest.match(PRICES_RE) || [];
      if (amounts[0] && !price) price = amounts[0].replace(/\s+/g, '');
      // "$48.32 $64.42" without strikethrough: the second amount is the was-price
      if (!wasText && amounts[1]) was = was || amounts[1].replace(/\s+/g, '');
      if (wasText) was = was || wasText;
      return;
    }
    const parsed = parseRating(text);
    if (parsed) {
      rating = rating || parsed;
      return;
    }
    if (links.length === 1 && textOf(links[0]) === text && !href) {
      href = links[0].getAttribute('href');
      if (!URL_TEXT_RE.test(text)) name = name || text;
      return;
    }
    if (!nameEl) {
      nameEl = line;
      if (!name) name = text;
      return;
    }
    extras.push(line);
  });

  if (!img && !href && !price && !name) return null;

  if (img) {
    const alt = (img.getAttribute('alt') || '').trim();
    if (name && (!alt || alt === cardTitle)) img.setAttribute('alt', name);
    if (!name && alt && alt !== cardTitle) name = alt;
  }

  const tile = el('li', `${PREFIX}-tile`);
  const body = href ? el('a', `${PREFIX}-tile-link`) : el('div', `${PREFIX}-tile-link`);
  if (href) {
    body.href = href;
    if (name) body.title = name;
  }

  if (img || badge) {
    const media = el('div', `${PREFIX}-tile-media`);
    if (badge) media.append(el('span', `${PREFIX}-tile-badge`, badge));
    if (img) media.append(buildPicture(img));
    body.append(media);
  }

  const details = el('div', `${PREFIX}-tile-details`);
  if (name || nameEl) {
    const nameLine = el('p', `${PREFIX}-tile-name`);
    // the authored name line wins (keeps the bold brand); otherwise fall back to alt / link title
    if (nameEl) {
      nameEl.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
      nameLine.append(...nameEl.childNodes);
    } else {
      nameLine.textContent = name;
    }
    // the image alt already announces the name inside the same link
    if (img && img.getAttribute('alt')) nameLine.setAttribute('aria-hidden', 'true');
    details.append(nameLine);
  }
  if (price || was) {
    const pricing = el('p', `${PREFIX}-tile-pricing`);
    if (price) pricing.append(el('span', `${PREFIX}-tile-price`, price));
    if (was) {
      const del = el('del', `${PREFIX}-tile-was`, was);
      del.setAttribute('aria-label', `was ${was}`);
      if (price) pricing.append(' ');
      pricing.append(del);
    }
    details.append(pricing);
  }
  if (note) details.append(el('p', `${PREFIX}-tile-note`, note));
  if (rating) details.append(buildRating(rating.value, rating.count));
  extras.forEach((line) => {
    line.className = `${PREFIX}-tile-text`;
    details.append(line);
  });
  if (details.children.length) body.append(details);
  tile.append(body);

  if (cta) {
    cta.className = `${PREFIX}-tile-cta`;
    tile.append(el('p', `${PREFIX}-tile-actions`, cta));
  }
  return tile;
}

/**
 * Builds the card header from its authored lines.
 * @param {HTMLElement[]} lines header lines
 * @param {string} id unique id for the title
 * @returns {{header: HTMLDivElement|null, title: string}}
 */
function buildHeader(lines, id) {
  if (!lines.length) return { header: null, title: '' };
  const header = el('div', `${PREFIX}-card-header`);
  let titleEl = null;
  let viewAll = null;
  lines.forEach((line) => {
    const links = [...line.querySelectorAll('a[href]')];
    const text = textOf(line);
    if (links.length && !viewAll && textOf(links[0]) === text) {
      [viewAll] = links;
      return;
    }
    if (links.length && !viewAll && titleEl) {
      [viewAll] = links;
      return;
    }
    if (!titleEl && text) {
      if (line.matches(HEADINGS)) {
        titleEl = line;
      } else {
        titleEl = el('p', '', ...line.childNodes);
      }
      titleEl.className = `${PREFIX}-card-title`;
      titleEl.id = id;
    }
  });
  if (titleEl) header.append(titleEl);
  if (viewAll) {
    viewAll.className = `${PREFIX}-view-all`;
    if (!textOf(viewAll)) viewAll.textContent = 'View All';
    viewAll.removeAttribute('title');
    if (titleEl) viewAll.setAttribute('aria-label', `${textOf(viewAll)}: ${textOf(titleEl)}`);
    header.append(viewAll);
  }
  return { header: header.children.length ? header : null, title: textOf(titleEl) };
}

/**
 * Builds one card from an authored row.
 * @param {Element} row authored row
 * @param {string} id unique id prefix
 * @returns {HTMLLIElement|null}
 */
function buildCard(row, id) {
  const cells = [...row.children];
  let headerLines;
  let tileCells;
  if (cells.length > 1 && !cells[0].querySelector('picture, img')) {
    headerLines = toLines([...cells[0].childNodes]);
    tileCells = cells.slice(1);
  } else {
    // single cell (or image in cell 1): header = lines before the first image
    const lines = cells.flatMap((c) => toLines([...c.childNodes]));
    const firstImage = lines.findIndex((l) => l.querySelector('picture, img'));
    headerLines = firstImage < 0 ? lines : lines.slice(0, firstImage);
    const holder = document.createElement('div');
    holder.append(...(firstImage < 0 ? [] : lines.slice(firstImage)));
    tileCells = [holder];
  }

  const { header, title } = buildHeader(headerLines, `${id}-title`);
  const tiles = groupTiles(tileCells).map((lines) => buildTile(lines, title)).filter(Boolean);
  if (!tiles.length && !header?.querySelector(`.${PREFIX}-view-all`)) return null;

  const card = el('li', `${PREFIX}-card`);
  card.classList.add(tiles.length > 2 ? `${PREFIX}-card-quad` : `${PREFIX}-card-pair`);
  if (header) {
    card.append(header);
    if (title) {
      card.setAttribute('role', 'group');
      card.setAttribute('aria-labelledby', `${id}-title`);
    }
  }
  if (tiles.length) card.append(el('ul', `${PREFIX}-tiles`, ...tiles));
  return card;
}

function isTitleRow(row) {
  return !row.querySelector('picture, img, a[href]') && !!row.querySelector(HEADINGS);
}

export default function decorate(block) {
  instanceCount += 1;
  const uid = `${PREFIX}-${instanceCount}`;
  const rows = [...block.children];
  const track = el('ul', `${PREFIX}-track`);
  let blockTitle = null;

  rows.forEach((row, i) => {
    if (i === 0 && rows.length > 1 && isTitleRow(row)) {
      blockTitle = row.querySelector(HEADINGS);
      blockTitle.classList.add(`${PREFIX}-title`);
      blockTitle.id = blockTitle.id || `${uid}-title`;
      return;
    }
    const card = buildCard(row, `${uid}-card-${i}`);
    if (card) track.append(card);
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (blockTitle) block.setAttribute('aria-labelledby', blockTitle.id);
  else block.setAttribute('aria-label', 'Deals');

  const children = [];
  if (blockTitle) children.push(el('div', `${PREFIX}-header`, blockTitle));
  const scroller = createScroller(track, PREFIX);
  scroller.querySelector(`.${PREFIX}-prev`)?.setAttribute('aria-label', 'Previous deals');
  scroller.querySelector(`.${PREFIX}-next`)?.setAttribute('aria-label', 'Next deals');
  children.push(scroller);
  block.replaceChildren(...children);
  block.classList.toggle('is-empty', !track.children.length);
}
