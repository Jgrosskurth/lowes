/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Lowe's site-wide cleanup.
 *
 * All selectors verified against the Bright Data snapshot replayed by the importer
 * (tools/importer/bd-snapshots/www.lowes.com/index.html) and migration-work/cleaned.html.
 * Lowe's uses styled-components hashed classes (sc-xxxx), so selectors prefer tags,
 * ids, data-testid and [class*="ComponentName"] hooks.
 *
 * NOTE: Do not strip [aria-hidden="true"] generically - the SMS toast text
 * (.sms-modal-text, section 13 default content) carries aria-hidden="true".
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Global chrome: masthead + footer wrappers.
// Found: <div id="headerApp" class="headerContent"> ... <header class="sc-eDPEul kqfsBT js-skip-analytics" data-testid="full-mast-header">
// Found: <div id="footerApp" class="footerContent"> ... <footer class="sc-lcIPJg buzRdL">
const CHROME = [
  '#headerApp',
  'header[data-testid="full-mast-header"]',
  'header',
  '#footerApp',
  'footer',
  // Found: <div class="skip-content"><button class="skip-to-content">Skip to main content</button></div> (inside header)
  '.skip-content',
  // Found: <div class="baymax parbase section"><div class="baymax-exp" data-exp-id="bym-global-selector"></div></div>
  '.baymax',
];

// Overlays, modals, chat, co-browse and empty body-level mount points.
const OVERLAYS = [
  // Found: <div id="sec-overlay" style="display:none;"><div id="sec-container"></div></div>
  '#sec-overlay',
  // Found: three <div id="overlay" class="... CartPreviewOverlay"> body-level overlays
  '[id="overlay"]',
  // Found: <div id="luca-app"><div class="... ChatInviteButton"> (Mylow chat)
  '#luca-app',
  '[class*="ChatInviteButton"]',
  // Found: <div id="cb-dialog-root"> (ScreenMeet co-browse dialog root)
  '#cb-dialog-root',
  // Found: <span id="vshb" class="vshb">
  '#vshb',
  // Found: empty ATC / personalization mount points
  '#npc-atc',
  '#home-atc',
  '#user-specific-content-false',
  // Found: <span id="kampyleButtonContainer"><button id="nebula_div_btn" alt="Feedback"> (Medallia feedback tab)
  '#kampyleButtonContainer',
];

// Ad slots, tracking pixels, iframes, skeleton loaders.
const JUNK = [
  // Found: <div class="styles__GAMWrapper-RC__..." data-testid="gam"><div id="gpt-1" class="gpt" style="display:none">
  '[data-testid="gam"]',
  '[class*="GAMWrapper-RC"]',
  '.gpt',
  // Found: tracking pixels at body level
  'img[src*="ojrq.net"]',
  'img[src*="analytics.yahoo.com"]',
  'img.ywa-10000',
  'img[src*="t.co/1/i/adsct"]',
  'img[src*="analytics.twitter.com"]',
  'img[src*="flashtalking.com"]',
  'img[src*="adsrvr.org"]',
  // Found (browser "Save Page As" source): pixels rewritten to the unsaved assets folder,
  // e.g. <img src="./Lowe’s Home Improvement_files/adsct" alt="">
  'picture:has(> img[src*="_files/"])',
  'img[src*="_files/"]',
  // Found: universal_pixel / doubleclick / pbbl / hidden iframes
  'iframe',
  // Found: <div class="styles__SkeletonWrapper-sc-1e8y019-0 ... weather-skeleton"> / project-skeleton
  '[class*="SkeletonWrapper"]',
];

const ORIGIN = 'https://www.lowes.com';

function absUrl(href) {
  const h = (href || '').trim();
  if (h.startsWith('//')) return `https:${h}`;
  if (h.startsWith('/')) return `${ORIGIN}${h}`;
  return h;
}

/**
 * Recommendation carousel titles nest their CTA link inside the heading:
 * Found: <div class="recs-carousel-title-wrapper"><h3 class="... recs-carousel-title">Recommended Searches for You
 *          <div class="recs-carousel-title-cta"><a href="https://www.lowes.com/l/your-recommendations">
 *          <span class="label link-label">More Suggestions for You</span></a></div></h3></div>
 * Move each CTA link out of the heading into a sibling <p> right after it so the heading text
 * stays clean ("Recommended Searches for You") and the link is kept as its own paragraph.
 */
function liftHeadingCtas(element, document) {
  element.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const ctas = [...heading.querySelectorAll('.recs-carousel-title-cta')];
    if (!ctas.length) return;
    let anchor = heading;
    ctas.forEach((cta) => {
      [...cta.querySelectorAll('a[href]')].forEach((a) => {
        const text = a.textContent.replace(/\s+/g, ' ').trim();
        if (!text) return;
        const link = document.createElement('a');
        link.href = absUrl(a.getAttribute('href'));
        link.textContent = text;
        const p = document.createElement('p');
        p.append(link);
        anchor.after(p);
        anchor = p;
      });
      cta.remove();
    });
  });
}

/**
 * Deals quadrant cards carry their "View All" href on an empty, zero-size anchor:
 * Found: <a aria-label="View All" data-testid="count-down-view-more-link" href="..."><span></span></a>
 *        <a class="... styles__ViewMore-..." role="button"><span>View All</span></a>
 * The importer drops the empty anchor before transformers run, leaving only the href-less
 * visible one. Recover the hrefs (in card order) from the raw payload HTML and put them on
 * the visible anchors so the carousel-deals parser can read them.
 */
function restoreViewAllLinks(element, payload) {
  const headers = [...element.querySelectorAll('[data-testid="count-down-clock-with-title"]')];
  if (!headers.length || !payload || typeof payload.html !== 'string') return;
  const hrefs = [...payload.html.matchAll(/<a\b[^>]*data-testid="count-down-view-more-link"[^>]*>/g)]
    .map((m) => (m[0].match(/\shref="([^"]*)"/) || [])[1])
    .filter(Boolean)
    .map((h) => h.replace(/&amp;/g, '&'));
  if (hrefs.length !== headers.length) return; // never guess a pairing
  headers.forEach((header, i) => {
    if (header.querySelector('a[data-testid="count-down-view-more-link"][href]')) return;
    const visible = header.querySelector('a[class*="ViewMore"]');
    if (visible) visible.setAttribute('href', absUrl(hrefs[i]));
  });
}

function queryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return []; // selector not supported by this DOM engine
  }
}

/**
 * Default-content banners ship separate mobile ("-mow") artwork below 576px:
 * Found: <a class="scaled-image-primary-link" href="..."><picture>
 *          <source media="(max-width: 35.9375rem)" srcset=".../hp-dewalt-days-dp18-1272029-mow.png">
 *          <source media="(min-width: 36rem) and (max-width: 64.438rem)" srcset="...-dt.jpeg"> ...
 *          <img src=".../hp-dewalt-days-dp18-1272029-dt.jpeg" alt="..."></picture></a>
 * (sponsored DEWALT banner and the MyLowe's Money tile in the hero split). Block parsers emit
 * the mobile art themselves; for default content, append it as a second <img> inside the same
 * link so it is authored as two images in one paragraph (convention: second image = mobile).
 * Scope: pictures inside the template's section defaultContent matches, outside block instances.
 */
function addDefaultContentMobileImages(element, payload, document) {
  const template = payload && payload.template;
  if (!template) return;
  const selectors = (template.sections || []).flatMap((s) => s.defaultContent || []);
  const blockEls = (template.blocks || []).flatMap((b) => b.instances || [])
    .flatMap((sel) => queryAll(element, sel));
  const done = new Set();
  selectors.flatMap((sel) => queryAll(element, sel)).forEach((match) => {
    const pictures = match.matches('picture') ? [match] : [...match.querySelectorAll('picture')];
    pictures.forEach((picture) => {
      if (done.has(picture) || blockEls.some((b) => b.contains(picture))) return;
      done.add(picture);
      const img = picture.querySelector('img');
      const source = [...picture.querySelectorAll('source[media][srcset]')].find((s) => {
        const media = s.getAttribute('media') || '';
        return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
      });
      if (!img || !source) return;
      const url = absUrl(source.getAttribute('srcset').split(',')[0].trim().split(/\s+/)[0]);
      if (!url || url === absUrl(img.getAttribute('src') || img.getAttribute('data-src'))) return;
      const mobile = document.createElement('img');
      mobile.setAttribute('src', url);
      mobile.setAttribute('alt', (img.getAttribute('alt') || '').trim());
      // replace the <picture> by the two plain images: a <picture> next to a sibling image is
      // emitted as its own paragraph, which would split the pair (and duplicate the link)
      picture.replaceWith(img, mobile);
    });
  });
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    restoreViewAllLinks(element, payload);
    // Remove chrome, overlays and junk before parsing so broad block selectors
    // (e.g. RowWrapper-RC / GridWrapper-RC) cannot match inside header/footer.
    WebImporter.DOMUtils.remove(element, [...CHROME, ...OVERLAYS, ...JUNK]);
    liftHeadingCtas(element, payload.document || element.ownerDocument);
    addDefaultContentMobileImages(element, payload, payload.document || element.ownerDocument);
  }

  if (hookName === TransformHook.afterTransform) {
    // Safety pass for anything re-introduced, plus non-content elements.
    WebImporter.DOMUtils.remove(element, [
      ...CHROME,
      ...OVERLAYS,
      ...JUNK,
      'link',
      'style',
      'script',
      'noscript',
    ]);

    // Strip tracking / inline-handler attributes.
    element.querySelectorAll('[onclick], [data-linkid], [data-tracking]').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-linkid');
      el.removeAttribute('data-tracking');
    });
  }
}
