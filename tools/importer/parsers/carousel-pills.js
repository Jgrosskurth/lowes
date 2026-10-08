/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-pills. Base: carousel. Source: https://www.lowes.com/
 * Block model (blocks/carousel-pills/README.md): one row per pill, single cell
 * holding the search term as a link.
 * Source: .pill-carousel > ... > .carousel-item > [data-component="PillCard"] > .pill-card > button.recs-pill-button > p
 * The source pills are <button>s (JS search filters) with no href, so a search
 * link is synthesized from the pill text.
 */
export default function parse(element, { document }) {
  // Iterate the stable pill wrappers (not the buttons themselves).
  let items = [...element.querySelectorAll('.carousel-item')];
  if (!items.length) items = [...element.querySelectorAll('.pill-card, [class*="PillCard"]')];
  if (!items.length) items = [...element.querySelectorAll('button[class*="pill"], a[class*="pill"]')];

  const seen = new Set();
  const cells = [];
  items.forEach((item) => {
    const existing = item.querySelector('a[href]');
    const source = item.querySelector('button[class*="pill"], [role="button"], p') || item;
    const text = (existing || source).textContent.replace(/\s+/g, ' ').trim();
    if (!text || seen.has(text.toLowerCase())) return;
    seen.add(text.toLowerCase());

    const link = document.createElement('a');
    if (existing) {
      const raw = existing.getAttribute('href');
      link.href = raw.startsWith('/') ? `https://www.lowes.com${raw}` : raw;
    } else {
      link.href = `https://www.lowes.com/search?searchTerm=${encodeURIComponent(text)}`;
    }
    link.textContent = text;
    cells.push([link]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-pills', cells });
  element.replaceWith(block);
}
