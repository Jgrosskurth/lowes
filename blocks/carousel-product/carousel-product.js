import { buildProductCard, createScroller } from '../../scripts/product-carousel.js';

/**
 * carousel-product: product recommendation carousel (horizontally scrollable with arrows).
 *
 * Content contract:
 *   optional heading row = a row with a heading and no image (carousel title, optional link)
 *   optional config row  = `slot | <recommendation slot id>` (or a single cell with just the id);
 *                          exposed as `data-slot` so a runtime recommendations integration can
 *                          populate the track
 *   optional pills row   = `pills | <list of filter labels>` (list items, paragraphs or one label
 *                          per line); rendered as a scrollable filter-pill bar above the track.
 *                          The first pill (or the one authored bold) is selected. Presentational:
 *                          only the selected filter's products are authored.
 *   product rows         = cell 1 = product image, cell 2 = brand + linked title, price,
 *                          was-price + savings, rating / reviews, social proof, "Add to Cart" link
 */
const PREFIX = 'carousel-product';
const SLOT_KEY_RE = /^(slot|slot id|recommendation|recommendations|placement)$/i;
const SLOT_VALUE_RE = /^[a-z0-9]+(?:[_-][a-z0-9]+)+$/i;
const PILLS_KEY_RE = /^(pills|filters|filter pills)$/i;

/**
 * Reads a keyed `pills` row.
 * @param {Element} row authored row
 * @returns {{label: string, selected: boolean}[]|null}
 */
function readPills(row) {
  const cells = [...row.children];
  if (cells.length < 2 || !PILLS_KEY_RE.test(cells[0].textContent.trim())) return null;
  const pills = [];
  cells.slice(1).forEach((cell) => {
    let items = [...cell.querySelectorAll('li')];
    if (!items.length) items = [...cell.querySelectorAll('p')];
    if (items.length) {
      items.forEach((item) => {
        const label = item.textContent.replace(/\s+/g, ' ').trim();
        if (label) pills.push({ label, selected: !!item.querySelector('strong, b') });
      });
    } else {
      cell.innerText.split('\n').forEach((line) => {
        const label = line.trim();
        if (label) pills.push({ label, selected: false });
      });
    }
  });
  return pills;
}

function buildPillBar(pills) {
  const bar = document.createElement('div');
  bar.className = 'carousel-product-pills';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Filter options');
  let selected = pills.findIndex((p) => p.selected);
  if (selected < 0) selected = 0;
  const buttons = pills.map(({ label }, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel-product-pill';
    btn.textContent = label;
    btn.setAttribute('aria-pressed', String(i === selected));
    return btn;
  });
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });
  bar.append(...buttons);
  return bar;
}

function readConfig(row) {
  if (row.querySelector('picture, img, a[href], h1, h2, h3, h4, h5, h6')) return null;
  const cells = [...row.children].map((c) => c.textContent.trim()).filter(Boolean);
  if (cells.length === 2 && SLOT_KEY_RE.test(cells[0])) return cells[1];
  if (cells.length === 1 && SLOT_VALUE_RE.test(cells[0]) && !/\s/.test(cells[0])) return cells[0];
  return null;
}

function isHeadingRow(row) {
  return !row.querySelector('picture, img') && !!row.querySelector('h1, h2, h3, h4, h5, h6');
}

export default function decorate(block) {
  const rows = [...block.children];
  let header = null;
  let pillBar = null;
  const track = document.createElement('ul');
  track.className = 'carousel-product-track';

  rows.forEach((row) => {
    const pills = readPills(row);
    if (pills) {
      if (pills.length && !pillBar) pillBar = buildPillBar(pills);
      return;
    }
    const slot = readConfig(row);
    if (slot) {
      block.dataset.slot = slot;
      return;
    }
    if (!header && !track.children.length && isHeadingRow(row)) {
      header = document.createElement('div');
      header.className = 'carousel-product-header';
      [...row.children].forEach((cell) => header.append(...cell.childNodes));
      header.querySelector('h1, h2, h3, h4, h5, h6').classList.add('carousel-product-title');
      // a short plain line next to the title (e.g. "Sponsored") is a caption
      header.querySelectorAll(':scope > p').forEach((p) => {
        if (!p.querySelector('a[href]')) p.classList.add('carousel-product-caption');
      });
      return;
    }
    const card = buildProductCard(row, PREFIX);
    if (card) track.append(card);
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  const title = header?.querySelector('.carousel-product-title');
  if (title) {
    if (!title.id) title.id = `carousel-product-title-${Math.random().toString(36).slice(2, 8)}`;
    block.setAttribute('aria-labelledby', title.id);
  } else {
    block.setAttribute('aria-label', 'Products');
  }

  const children = [];
  if (header) children.push(header);
  if (pillBar) {
    children.push(createScroller(pillBar, `${PREFIX}-pills`, {
      progress: false,
      prevLabel: 'Previous filters',
      nextLabel: 'Next filters',
    }));
  }
  children.push(createScroller(track, PREFIX));
  block.replaceChildren(...children);

  // a slot-only block has nothing to show until a runtime integration fills the track
  block.classList.toggle('is-empty', !track.children.length);
  // content (article) cards only: image + title, wider cards
  const cards = [...track.children];
  block.classList.toggle('is-content', !!cards.length && cards.every((c) => c.classList.contains(`${PREFIX}-card-content`)));
}
