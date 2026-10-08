import { createOptimizedPicture, loadCSS } from '../../scripts/aem.js';

/**
 * widget-weather: "Plan your day" weather + project-ideas panel.
 *
 * The source site populates the forecast at runtime from a personalized weather service, so the
 * block supports these authoring rows (all optional, decorated defensively):
 *
 *   1. Config row: a link to `/widgets/weather/<name>.html` (query params such as
 *      `?layout=slim` become data attributes). If that widget implementation exists in the
 *      code base it is loaded into the block; if not, the static rendering below is kept.
 *   2. Forecast row: the first row without an image (e.g. "Your Local Weather"). Rendered as the
 *      forecast panel (left third) with a runtime placeholder; forecast data is never authored.
 *   3. Project idea rows: every other row, typically cell 1 = image, cell 2 = title + link
 *      ("Read Article" / "Shop Now"). Rendered as a scrollable list of cards (right two-thirds).
 */

const DEFAULT_FORECAST_TITLE = 'Your Local Weather';
const PLACEHOLDER_TEXT = 'Set your store to see the weather forecast for your area.';

function isWidgetLink(row) {
  const links = row.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const link = links[0];
  if (link.textContent.trim() !== row.textContent.trim()) return null;
  try {
    const url = new URL(link.href, window.location.href);
    return url.pathname.startsWith('/widgets/') && url.pathname.endsWith('.html') ? url : null;
  } catch {
    return null;
  }
}

function hasContent(el) {
  return !!(el.textContent.trim() || el.querySelector('picture, img'));
}

async function loadRuntimeWidget(block, url) {
  const base = url.pathname.replace(/\.html$/, '');
  const codeBase = (window.hlx && window.hlx.codeBasePath) || '';
  const resp = await fetch(`${codeBase}${base}.html`);
  if (!resp.ok) return false;
  const html = await resp.text();
  const runtime = document.createElement('div');
  runtime.className = 'widget-weather-runtime';
  runtime.innerHTML = html;
  block.replaceChildren(runtime);
  await loadCSS(`${codeBase}${base}.css`);
  const mod = await import(`${codeBase}${base}.js`);
  if (mod.default) await mod.default(block);
  return true;
}

function buildForecastPanel(row) {
  const panel = document.createElement('div');
  panel.className = 'widget-weather-panel widget-weather-forecast';

  const content = document.createElement('div');
  content.className = 'widget-weather-forecast-content';
  if (row) [...row.children].forEach((cell) => content.append(...cell.childNodes));
  if (!content.textContent.trim()) {
    content.textContent = DEFAULT_FORECAST_TITLE;
  }
  // single-paragraph cells arrive unwrapped (inline content only): wrap them in a <p>
  if (!content.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div')) {
    const p = document.createElement('p');
    p.append(...content.childNodes);
    content.replaceChildren(p);
  }
  const title = content.querySelector('h1, h2, h3, h4, h5, h6, p');
  if (title) title.classList.add('widget-weather-title');
  panel.append(content);

  // live forecast data is filled in by a runtime integration; show a neutral placeholder
  const placeholder = document.createElement('p');
  placeholder.className = 'widget-weather-placeholder';
  placeholder.textContent = PLACEHOLDER_TEXT;
  panel.append(placeholder);
  return panel;
}

function buildProjectCard(row) {
  const li = document.createElement('li');
  li.className = 'widget-weather-project';
  const cells = [...row.children].filter(hasContent);
  const imageCell = cells.find((c) => c.querySelector('picture, img') && !c.textContent.trim());

  const body = document.createElement('div');
  body.className = 'widget-weather-project-body';
  cells.filter((c) => c !== imageCell).forEach((c) => body.append(...c.childNodes));

  const media = document.createElement('div');
  media.className = 'widget-weather-project-image';
  if (imageCell) media.append(...imageCell.childNodes);
  if (!media.querySelector('picture, img')) {
    const stray = body.querySelector('picture, img');
    if (stray) media.append(stray.closest('a') || stray.closest('picture') || stray);
  }
  media.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });

  // drop empty leftovers (e.g. paragraphs that only wrapped the moved image)
  [...body.children].forEach((child) => {
    if (!hasContent(child)) child.remove();
  });

  const title = body.querySelector('h1, h2, h3, h4, h5, h6') || body.querySelector('strong, b');
  if (title) title.classList.add('widget-weather-project-title');
  const links = [...body.querySelectorAll('a[href]')];
  const cta = links.find((a) => !title || !title.contains(a)) || links[0];
  if (cta) {
    cta.classList.add('widget-weather-project-link');
    // icon: open book for articles / guides, shopping cart for everything else
    const isArticle = /read|article|guide|learn|how[\s-]to/i.test(cta.textContent);
    cta.classList.add(isArticle ? 'widget-weather-project-link-article' : 'widget-weather-project-link-shop');
    const ctaLine = cta.closest('p');
    if (ctaLine && ctaLine.parentElement === body) {
      ctaLine.classList.add('widget-weather-project-cta');
      body.append(ctaLine);
    }
  }

  // make the image a link to the idea page as well
  const picture = media.querySelector('picture, img');
  if (cta && picture && !media.querySelector('a')) {
    const a = document.createElement('a');
    a.href = cta.href;
    a.tabIndex = -1;
    a.setAttribute('aria-hidden', 'true');
    picture.replaceWith(a);
    a.append(picture);
  }

  if (media.children.length) li.append(media);
  if (body.children.length) li.append(body);
  return li.children.length ? li : null;
}

function createNavButton(direction, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `widget-weather-nav widget-weather-nav-${direction}`;
  button.setAttribute('aria-label', label);
  return button;
}

/**
 * Adds previous / next buttons and a scroll position indicator to the project list.
 * Controls are only shown while the list overflows.
 */
function decorateCarousel(panel, carousel, list) {
  const prev = createNavButton('prev', 'Previous project ideas');
  const next = createNavButton('next', 'Next project ideas');
  carousel.append(prev, next);

  const scrollbar = document.createElement('div');
  scrollbar.className = 'widget-weather-scrollbar';
  scrollbar.setAttribute('aria-hidden', 'true');
  const thumb = document.createElement('div');
  thumb.className = 'widget-weather-scrollbar-thumb';
  scrollbar.append(thumb);
  panel.append(scrollbar);

  const update = () => {
    const { scrollLeft, scrollWidth, clientWidth } = list;
    const max = scrollWidth - clientWidth;
    const scrollable = max > 1;
    panel.classList.toggle('is-scrollable', scrollable);
    prev.hidden = !scrollable || scrollLeft <= 1;
    next.hidden = !scrollable || scrollLeft >= max - 1;
    const size = scrollable ? clientWidth / scrollWidth : 1;
    const offset = scrollable ? (scrollLeft / max) * (1 - size) : 0;
    scrollbar.style.setProperty('--thumb-size', size.toFixed(4));
    scrollbar.style.setProperty('--thumb-offset', offset.toFixed(4));
  };

  const page = (dir) => {
    const card = list.querySelector('.widget-weather-project');
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : list.clientWidth;
    const cards = Math.max(1, Math.floor((list.clientWidth + gap) / step));
    list.scrollBy({ left: dir * cards * step, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => page(-1));
  next.addEventListener('click', () => page(1));
  list.addEventListener('scroll', update, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(update).observe(list);
  list.querySelectorAll('img').forEach((img) => img.addEventListener('load', update, { once: true }));
  update();
}

function buildProjectsPanel(rows) {
  const panel = document.createElement('div');
  panel.className = 'widget-weather-panel widget-weather-projects';
  const list = document.createElement('ul');
  list.className = 'widget-weather-project-list';
  rows.forEach((row) => {
    const card = buildProjectCard(row);
    if (card) list.append(card);
  });
  if (!list.children.length) return null;
  const carousel = document.createElement('div');
  carousel.className = 'widget-weather-carousel';
  carousel.append(list);
  panel.append(carousel);
  decorateCarousel(panel, carousel, list);
  return panel;
}

export default async function decorate(block) {
  const rows = [...block.children];
  let widgetUrl = null;
  let forecastRow = null;
  const projectRows = [];
  rows.forEach((row) => {
    const url = isWidgetLink(row);
    if (url && !widgetUrl) {
      widgetUrl = url;
      return;
    }
    if (!hasContent(row)) return;
    if (!forecastRow && !projectRows.length && !row.querySelector('picture, img')) {
      forecastRow = row;
      return;
    }
    projectRows.push(row);
  });

  if (widgetUrl) {
    block.dataset.source = widgetUrl.href;
    widgetUrl.searchParams.forEach((value, key) => {
      block.dataset[key.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = value;
    });
  }

  const panels = document.createElement('div');
  panels.className = 'widget-weather-panels';
  panels.append(buildForecastPanel(forecastRow));
  const projects = buildProjectsPanel(projectRows);
  if (projects) panels.append(projects);
  block.classList.toggle('widget-weather-single', panels.children.length === 1);
  block.replaceChildren(panels);

  if (!widgetUrl) return;
  try {
    const loaded = await loadRuntimeWidget(block, widgetUrl);
    if (!loaded) block.replaceChildren(panels);
  } catch (error) {
    block.replaceChildren(panels);
    // eslint-disable-next-line no-console
    console.warn('widget-weather: runtime widget unavailable, using static fallback', error);
  }
}
