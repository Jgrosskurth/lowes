import { createOptimizedPicture } from './aem.js';

/**
 * Mobile art direction.
 * Authoring convention: when an image cell (or a default-content paragraph) holds two images,
 * the first is the desktop image and the second is the mobile variant shown below 576px.
 * Both are rendered as a single <picture>, so only one image is downloaded.
 */
export const MOBILE_MEDIA = '(max-width: 575px)';

/**
 * Finds a desktop + mobile image pair in a container and removes the mobile one
 * (plus any wrapper it leaves empty, up to the container).
 * @param {Element} container Cell or paragraph holding the authored images
 * @returns {{ desktop: HTMLImageElement, mobile: HTMLImageElement }|null} The pair, or null
 *   when the container does not hold exactly two images
 */
export function extractMobileImage(container) {
  const imgs = container ? [...container.querySelectorAll('img')] : [];
  if (imgs.length !== 2) return null;
  const [desktop, mobile] = imgs;
  let node = mobile.closest('picture') || mobile;
  if (!container.contains(node) || node === container) node = mobile;
  let parent = node.parentElement;
  node.remove();
  while (parent && parent !== container && !parent.children.length && !parent.textContent.trim()) {
    const next = parent.parentElement;
    parent.remove();
    parent = next;
  }
  // a cell holding two images is delivered as one paragraph; when that paragraph is the
  // cell's only content, unwrap it so the markup matches a single-image cell
  const p = desktop.closest('p');
  if (p && p.parentElement === container && container.children.length === 1
    && !container.textContent.trim()) {
    p.replaceWith(...p.childNodes);
  }
  return { desktop, mobile };
}

/**
 * Prepends optimized mobile sources (webp + original format) to a picture.
 * @param {HTMLPictureElement} picture Desktop picture
 * @param {string} mobileSrc Mobile image URL
 * @param {string} [width] Requested mobile rendition width
 * @returns {HTMLPictureElement} The same picture
 */
export function addMobileSources(picture, mobileSrc, width = '750') {
  if (!picture || !mobileSrc) return picture;
  const mobile = createOptimizedPicture(mobileSrc, '', false, [{ media: MOBILE_MEDIA, width }, { width }]);
  picture.prepend(...mobile.querySelectorAll('source[media]'));
  return picture;
}

/**
 * createOptimizedPicture() with an optional mobile (< 576px) variant.
 * @param {string} src Desktop image URL
 * @param {string} alt Alt text
 * @param {boolean} eager Load eagerly
 * @param {Array} breakpoints Desktop breakpoints (see createOptimizedPicture)
 * @param {string} [mobileSrc] Mobile image URL; ignored when empty or equal to src
 * @param {string} [mobileWidth] Requested mobile rendition width
 * @returns {HTMLPictureElement}
 */
export function createArtDirectedPicture(src, alt, eager, breakpoints, mobileSrc, mobileWidth) {
  const picture = createOptimizedPicture(src, alt, eager, breakpoints);
  if (mobileSrc && mobileSrc !== src) addMobileSources(picture, mobileSrc, mobileWidth);
  return picture;
}
