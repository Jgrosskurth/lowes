import { createArtDirectedPicture, extractMobileImage } from '../../scripts/mobile-image.js';

/**
 * Finds the CTA link: the last link that is the only content of its parent
 * (a bare link in a cell, or a paragraph made up only of a link).
 * @param {Element} body card body
 * @returns {HTMLAnchorElement|undefined}
 */
function findCta(body) {
  return [...body.querySelectorAll('a[href]')].reverse().find((a) => {
    const parent = a.parentElement;
    return a.textContent.trim() && a.textContent.trim() === parent.textContent.trim();
  });
}

/**
 * cards-article: editorial / how-to cards with the photo on top.
 * Content contract: one row per article.
 *   cell 1 = photo; an optional second image is the mobile (< 576px) variant
 *   cell 2 = optional title (heading) and description paragraph or bullet list,
 *            plus a CTA link ("Learn More" / "Get Started")
 * When cell 2 holds only the CTA (title/description are baked into the photo, as on
 * lowes.com), the photo itself becomes the link and the CTA text stays visually hidden.
 * Cells may be omitted; a card without a photo renders text only.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-article-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((c) => c.textContent.trim() || c.querySelector('picture, img'))) return;

    const li = document.createElement('li');
    li.className = 'cards-article-card';

    const imageCell = cells.find((c) => c.querySelector('picture, img') && !c.textContent.trim())
      || cells.find((c) => c.querySelector('picture, img'));

    const body = document.createElement('div');
    body.className = 'cards-article-card-body';
    cells.filter((c) => c !== imageCell).forEach((c) => body.append(...c.childNodes));

    const cta = findCta(body);
    const ctaBlock = cta && (cta.parentElement === body ? cta : cta.parentElement);
    const otherText = [...body.childNodes]
      .filter((n) => n !== ctaBlock)
      .some((n) => n.textContent.trim());

    if (imageCell) {
      imageCell.className = 'cards-article-card-image';
      // optional art direction: a second image in the cell is the mobile (< 576px) variant
      const pair = extractMobileImage(imageCell);
      if (pair) {
        pair.desktop.dataset.mobileSrc = pair.mobile.src;
        li.classList.add('has-mobile-image');
      }
      li.append(imageCell);
    }

    if (imageCell && cta && !otherText) {
      // image-only card: the photo carries the visible copy, so the photo is the link
      li.classList.add('cards-article-card-image-only');
      const link = document.createElement('a');
      link.className = 'cards-article-card-link';
      link.href = cta.href;
      if (cta.target) link.target = cta.target;
      const label = document.createElement('span');
      label.className = 'cards-article-visually-hidden';
      label.textContent = cta.textContent.trim();
      link.append(...imageCell.childNodes, label);
      imageCell.append(link);
    } else {
      if (cta) {
        ctaBlock.classList.add('cards-article-card-cta');
        body.append(ctaBlock);
      }
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) heading.classList.add('cards-article-card-title');
      if (body.textContent.trim()) li.append(body);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createArtDirectedPicture(img.src, img.alt, false, [{ width: '750' }], img.dataset.mobileSrc),
    );
  });
  block.replaceChildren(ul);
}
