/* eslint-disable */
/* global WebImporter */
/**
 * Parser for widget-weather. Base: widget (custom, no library convention). Source: https://www.lowes.com/
 * Block model (blocks/widget-weather/README.md):
 *   config row   = optional link to /widgets/weather/<name>.html; not emitted (no widget runtime yet)
 *   forecast row = forecast panel title ("Your Local Weather"). The forecast itself (location,
 *                  day names, Hi/Lo temps) is live, location-specific data and is NOT imported;
 *                  the block renders a runtime placeholder under the title.
 *   project rows = one row per project idea: cell 1 = image, cell 2 = title (h4) + link
 *                  ("Read Article" / "Shop Now") to the idea page (absolute https://www.lowes.com URL)
 * Source (hydrated snapshot):
 *   div[class*="WeatherWidgetSlimstyles__WeatherForeCastWrapper"]
 *     div[class*="WeatherForecastSlimstyles__OuterContainer"]  > TitleWrapper > p "Your Local Weather"
 *                                                               + LocationWrapper span "Plattsburgh, NY" (live, skipped)
 *                                                               + WeatherCard x4 (live, skipped)
 *     div[class*="ProjectForecastSlimstyles__OuterContainer"]   > .item-wrapper x N
 *        > a[class*="ProjectForecastSlimstyles__CardWrapper"][href]
 *            > img[class*="ProjectForecastSlimstyles__ImageWrapper"]
 *            + div[class*="ProjectForecastSlimstyles__SideWrap"] > h4.card-title
 *                                                              + p.card-description (usually empty)
 *                                                              + div[class*="ReadLink"] > span.readtext
 * Iteration is keyed on the SideWrap title containers (one per project idea).
 */
const ORIGIN = 'https://www.lowes.com';

function absUrl(href) {
  const h = (href || '').trim();
  if (!h) return '';
  if (h.startsWith('//')) return `https:${h}`;
  if (h.startsWith('/')) return `${ORIGIN}${h}`;
  return h;
}

function textOf(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  const cells = [];

  // No config row: the project has no /widgets/weather/ runtime, so a config link
  // would only 404 and fall back to the static panels below.

  // Forecast row: static panel title only (live location / temps are runtime data).
  const forecastTitle = textOf(element.querySelector(
    '[class*="WeatherForecastSlimstyles__TitleWrapper"] > p, [class*="WeatherForecast"] [class*="TitleWrapper"] > p',
  )) || 'Your Local Weather';
  const titleP = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = forecastTitle;
  titleP.append(strong);
  cells.push([titleP]);

  // Project idea rows
  const seen = new Set();
  element.querySelectorAll('div[class*="ProjectForecastSlimstyles__SideWrap"], div[class*="ProjectForecast"][class*="SideWrap"]')
    .forEach((side) => {
      const title = textOf(side.querySelector('h1, h2, h3, h4, h5, h6, .card-title'));
      const card = side.closest('a[href]') || side.closest('.item-wrapper, [class*="CarouselItemWrapper"]');
      const linkEl = card && card.matches('a[href]') ? card : card?.querySelector('a[href]');
      const url = absUrl(linkEl?.getAttribute('href'));
      const key = `${title}|${url}`;
      if (!title || seen.has(key)) return;
      seen.add(key);

      const srcImg = (card || side.parentElement)?.querySelector('img');
      const src = srcImg && (srcImg.getAttribute('src') || srcImg.getAttribute('data-src'));
      let img = '';
      if (src && !src.startsWith('data:')) {
        img = document.createElement('img');
        img.src = absUrl(src);
        img.alt = (srcImg.getAttribute('alt') || title).trim();
      }

      const body = [];
      const h4 = document.createElement('h4');
      h4.textContent = title;
      body.push(h4);
      const desc = textOf(side.querySelector('.card-description, [class*="CardDescription"]'));
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        body.push(p);
      }
      if (url) {
        const cta = textOf(side.querySelector('.readtext, [class*="ReadLink"]')) || 'Read Article';
        const a = document.createElement('a');
        a.href = url;
        a.textContent = cta;
        const p = document.createElement('p');
        p.append(a);
        body.push(p);
      }
      cells.push([img, body]);
    });

  const block = WebImporter.Blocks.createBlock(document, { name: 'widget-weather', cells });
  element.replaceWith(block);
}
