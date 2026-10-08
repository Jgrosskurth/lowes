import { createArtDirectedPicture, extractMobileImage } from '../../scripts/mobile-image.js';

/**
 * cards-promo: grid of tall promo tiles whose copy is baked into the image.
 * Content contract: one row per tile.
 *   cell 1 = image (optionally already linked); an optional second image is the mobile
 *            (< 576px) variant
 *   cell 2 = "Shop Now" link to the tile destination (any extra text is kept)
 * The whole tile becomes clickable; when an image is present the CTA label is kept for
 * assistive tech but visually hidden, since the image already carries the copy.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-promo-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((c) => c.textContent.trim() || c.querySelector('picture, img'))) return;

    const li = document.createElement('li');
    li.className = 'cards-promo-card';

    const imageCell = cells.find((c) => c.querySelector('picture, img'));
    const bodyCells = cells.filter((c) => c !== imageCell);

    if (imageCell) {
      imageCell.className = 'cards-promo-card-image';
      // optional art direction: a second image in the cell is the mobile (< 576px) variant
      const pair = extractMobileImage(imageCell);
      if (pair) {
        pair.desktop.dataset.mobileSrc = pair.mobile.src;
        li.classList.add('has-mobile-image');
      }
      li.append(imageCell);
    }

    const body = document.createElement('div');
    body.className = 'cards-promo-card-body';
    bodyCells.forEach((c) => body.append(...c.childNodes));
    if (body.textContent.trim()) li.append(body);

    const imageLink = imageCell?.querySelector('a[href]');
    const cta = body.querySelector('a[href]') || imageLink;
    if (cta) {
      cta.classList.add('cards-promo-card-link');
      if (imageCell) {
        li.classList.add('has-image');
        if (!imageLink) {
          // make the image itself clickable; the CTA remains the single tab stop
          const pic = imageCell.querySelector('picture, img');
          const a = document.createElement('a');
          a.href = cta.href;
          a.tabIndex = -1;
          a.setAttribute('aria-hidden', 'true');
          pic.replaceWith(a);
          a.append(pic);
        } else if (imageLink !== cta) {
          imageLink.setAttribute('tabindex', '-1');
        }
      }
      if (!cta.getAttribute('aria-label')) {
        const alt = imageCell?.querySelector('img')?.alt?.trim();
        if (alt) cta.setAttribute('aria-label', `${cta.textContent.trim()}: ${alt}`);
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createArtDirectedPicture(img.src, img.alt, false, [{ width: '500' }], img.dataset.mobileSrc),
    );
  });
  block.replaceChildren(ul);
}
