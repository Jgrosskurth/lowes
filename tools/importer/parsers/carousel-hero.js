/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel. Source: https://www.lowes.com/
 * Block model (blocks/carousel-hero/README.md): one row per slide.
 *   cell 1 = linked hero image (copy is baked into the image; alt text kept)
 *   cell 2 = optional "Get Details" text (offer-details disclosure)
 * Source: [class*="HeroBannerSlider"] > [class*="CarouselItemWrapper"] (5 slides)
 *   > ... a.carousel-linkWrapper > picture > img  and  .secondary-link-wrapper h6 "Get Details"
 */
function absUrl(href) {
  if (!href) return '';
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) return `https://www.lowes.com${href}`;
  return href;
}

// lowes.com serves separate mobile ("-mow") artwork below 576px:
//   <picture><source media="(max-width: 35.9375rem)" srcset="...-mow.png"> ... <img src="...-dt.png">
// Authoring convention: a second image in the same cell is the mobile (< 576px) variant.
// Returns that second <img> (absolute URL, same alt), or null when there is no distinct mobile art.
function mobileImage(srcImg, desktopSrc, document) {
  const sources = srcImg?.closest('picture')?.querySelectorAll('source[media][srcset]') || [];
  const source = [...sources].find((s) => {
    const media = s.getAttribute('media') || '';
    return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
  });
  const url = source ? absUrl(source.getAttribute('srcset').split(',')[0].trim().split(/\s+/)[0]) : '';
  if (!url || url === desktopSrc) return null;
  const img = document.createElement('img');
  img.src = url;
  img.alt = (srcImg.getAttribute('alt') || '').trim();
  return img;
}

export default function parse(element, { document }) {
  // Iterate the slide wrappers (block-level divs), not the anchors.
  let slides = [...element.querySelectorAll('[class*="CarouselItemWrapper"]')];
  if (!slides.length) slides = [...element.querySelectorAll('[class*="BannerWrapper"]')];
  if (!slides.length) {
    slides = [...element.querySelectorAll('img')].map((img) => img.closest('a')?.parentElement || img.parentElement);
  }

  const cells = [];
  slides.forEach((slide) => {
    const srcImg = slide.querySelector('img');
    if (!srcImg) return;
    const src = srcImg.getAttribute('src') || srcImg.getAttribute('data-src')
      || slide.querySelector('source[srcset]')?.getAttribute('srcset')?.split(/[\s,]/)[0];
    if (!src) return;

    const img = document.createElement('img');
    img.src = absUrl(src);
    img.alt = (srcImg.getAttribute('alt') || '').trim();
    const mobileImg = mobileImage(srcImg, absUrl(src), document);
    const images = mobileImg ? [img, mobileImg] : [img];

    const anchor = srcImg.closest('a[href]') || slide.querySelector('a.carousel-linkWrapper[href], a[class*="LinkWrapper"][href]');
    let imageCell = images;
    if (anchor) {
      const link = document.createElement('a');
      link.href = absUrl(anchor.getAttribute('href'));
      link.append(...images);
      imageCell = link;
    }

    // Optional "Get Details" disclosure trigger (no href in source -> text).
    let detailsCell = '';
    const details = slide.querySelector('.secondary-link-wrapper, [data-testid="playwright-secondary-link"], [class*="SecondaryLinkWrapper"]');
    if (details) {
      const label = details.textContent.replace(/\s+/g, ' ').trim();
      const dLink = details.querySelector('a[href]');
      if (dLink && label) {
        const a = document.createElement('a');
        a.href = absUrl(dLink.getAttribute('href'));
        a.textContent = label;
        detailsCell = a;
      } else if (label) {
        const p = document.createElement('p');
        p.textContent = label;
        detailsCell = p;
      }
    }

    cells.push([imageCell, detailsCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
