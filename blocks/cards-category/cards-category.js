import { createArtDirectedPicture, extractMobileImage } from '../../scripts/mobile-image.js';

/**
 * cards-category: row of short, wide category banners with the label baked into the image.
 * Content contract: one row per banner.
 *   cell 1 = image (optionally linked); an optional second image is the mobile (< 576px) variant
 *   cell 2 = link whose text is the category label
 * The banner image links to the category; the label stays available to assistive tech and is
 * shown as text when no image is authored.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-category-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((c) => c.textContent.trim() || c.querySelector('picture, img'))) return;

    const li = document.createElement('li');
    li.className = 'cards-category-card';
    const imageCell = cells.find((c) => c.querySelector('picture, img'));
    const label = document.createElement('div');
    label.className = 'cards-category-card-label';
    cells.filter((c) => c !== imageCell).forEach((c) => label.append(...c.childNodes));

    const link = label.querySelector('a[href]') || imageCell?.querySelector('a[href]');
    if (imageCell) {
      imageCell.className = 'cards-category-card-image';
      li.classList.add('has-image');
      // optional art direction: a second image in the cell is the mobile (< 576px) variant
      const pair = extractMobileImage(imageCell);
      if (pair) {
        pair.desktop.dataset.mobileSrc = pair.mobile.src;
        li.classList.add('has-mobile-image');
      }
      const pic = imageCell.querySelector('picture, img');
      const imgLink = imageCell.querySelector('a[href]');
      if (link && !imgLink) {
        const a = document.createElement('a');
        a.href = link.href;
        a.tabIndex = -1;
        a.setAttribute('aria-hidden', 'true');
        pic.replaceWith(a);
        a.append(pic);
      } else if (imgLink && imgLink !== link) {
        imgLink.tabIndex = -1;
      }
      li.append(imageCell);
    }
    if (link) link.classList.add('cards-category-card-link');
    if (label.textContent.trim()) li.append(label);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createArtDirectedPicture(img.src, img.alt, false, [{ width: '600' }], img.dataset.mobileSrc),
    );
  });
  block.replaceChildren(ul);
}
