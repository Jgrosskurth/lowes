import { createArtDirectedPicture, extractMobileImage } from '../../scripts/mobile-image.js';

/**
 * columns-promo: side-by-side promo banners of unequal width (first column wide, 8/4 on desktop).
 * Content contract: one row (more rows tolerated), N cells; each cell holds a (linked) banner
 * image and optional text links such as "Get Details" rendered beneath the banner.
 * An optional second image in a cell is the mobile (< 576px) variant of the banner.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const colCount = Math.max(1, ...rows.map((row) => row.children.length));
  block.classList.add(`columns-promo-${colCount}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-promo-row');
    [...row.children].forEach((col) => {
      col.classList.add('columns-promo-col');
      // optional art direction: a second image in the cell is the mobile (< 576px) variant
      const pair = extractMobileImage(col);
      if (pair) col.classList.add('has-mobile-image');
      const pic = col.querySelector('picture');
      if (!pic) return;

      // the banner is the picture, or the link wrapping it
      const media = pic.closest('a') || pic;
      const mediaBlock = media.closest('p') && media.closest('p').parentElement === col
        ? media.closest('p') : media;
      mediaBlock.classList.add('columns-promo-media');

      // anything else in the column (e.g. "Get Details") becomes the meta row under the banner
      const extras = [...col.children].filter((el) => el !== mediaBlock && el.textContent.trim());
      if (extras.length) {
        const meta = document.createElement('div');
        meta.className = 'columns-promo-meta';
        meta.append(...extras);
        col.append(meta);
      }
      col.classList.add('columns-promo-img-col');

      const img = pic.querySelector('img');
      if (img) {
        const breakpoints = [{ media: '(min-width: 900px)', width: '1200' }, { width: '750' }];
        const mobileSrc = pair && pair.desktop === img ? pair.mobile.src : '';
        pic.replaceWith(createArtDirectedPicture(img.src, img.alt, false, breakpoints, mobileSrc));
      }
    });
  });
}
