/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Lowe's section breaks and Section Metadata.
 *
 * Uses payload.template.sections from tools/importer/page-templates.json. Each
 * section.selector is an array of DOM-verified candidates (verified against the
 * Bright Data snapshot tools/importer/bd-snapshots/www.lowes.com/index.html),
 * tried in order, first match wins.
 *
 * Breaks (<hr>) are inserted in beforeTransform, while every section element
 * still exists (block parsers replace their matched elements between hooks).
 * Section Metadata blocks are inserted in afterTransform, anchored to a marker
 * attribute placed on the <hr> (or the original element for the first section).
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

function querySection(root, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    let el = null;
    try {
      el = root.querySelector(sel);
    } catch (e) {
      el = null; // invalid selector in this engine - try the next candidate
    }
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;

  if (hookName === 'beforeTransform') {
    // Reverse order so unprocessed sections keep their DOM position.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no break, no metadata
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // never guess a replacement
      // Personalized slots can render as empty containers (e.g. the SMS toast for a
      // visitor who dismissed it); don't emit a break/metadata for an empty section.
      if (!sectionEl.textContent.trim() && !sectionEl.querySelector('img, picture')) continue;

      const doc = element.ownerDocument || document;
      const hr = doc.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      // Only sections that received a marker in beforeTransform get metadata (an empty or
      // missing section was skipped there and must not get a stray Section Metadata block).
      const anchor = marker;
      if (!anchor) continue;

      const doc = element.ownerDocument || document;
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
