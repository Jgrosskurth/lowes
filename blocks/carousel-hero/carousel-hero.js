import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * carousel-hero: auto-rotating hero slideshow with pause/play, dot indicators,
 * prev/next arrows and an optional per-slide "Get Details" link or disclosure.
 * Content contract: one row per slide.
 *   cell 1 = (linked) hero image
 *   cell 2 = optional details: a single "Get Details" link, or text that becomes a disclosure
 */
const ROTATE_MS = 6000;
let instanceCount = 0;

function buildDetails(cell) {
  if (!cell || !cell.textContent.trim()) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-hero-details';

  const links = cell.querySelectorAll('a[href]');
  const onlyLink = links.length === 1 && links[0].textContent.trim() === cell.textContent.trim();
  if (onlyLink) {
    const link = links[0];
    link.className = 'carousel-hero-details-link';
    wrapper.append(link);
    return wrapper;
  }

  // a lone short label (e.g. "Get Details") with no disclosure body: render as static text
  const blocks = [...cell.children];
  const labelOnly = !links.length && blocks.length <= 1 && cell.textContent.trim().length <= 40;
  if (labelOnly) {
    const label = document.createElement('span');
    label.className = 'carousel-hero-details-link';
    label.textContent = cell.textContent.trim();
    wrapper.append(label);
    return wrapper;
  }

  // text content: first short paragraph acts as the disclosure label
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.className = 'carousel-hero-details-link';
  const first = cell.querySelector('p, h1, h2, h3, h4, h5, h6');
  const hasLabel = first && cell.children.length > 1 && first.textContent.trim().length <= 40;
  summary.textContent = hasLabel ? first.textContent.trim() : 'Get Details';
  if (hasLabel) first.remove();
  const body = document.createElement('div');
  body.className = 'carousel-hero-details-body';
  body.append(...cell.childNodes);
  details.append(summary, body);
  wrapper.append(details);
  return wrapper;
}

function createSlide(row, idx, id) {
  const slide = document.createElement('li');
  slide.className = 'carousel-hero-slide';
  slide.id = `carousel-hero-${id}-slide-${idx}`;
  slide.dataset.slideIndex = idx;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');

  const cells = [...row.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img')) || cells[0];
  const media = document.createElement('div');
  media.className = 'carousel-hero-slide-image';
  if (imageCell) media.append(...imageCell.childNodes);
  // optional art direction: a second image in the cell is the mobile (< 576px) variant
  const imgs = [...media.querySelectorAll('picture > img')];
  const mobileImg = imgs.length > 1 ? imgs.pop() : null;
  if (mobileImg) {
    const mobilePicture = mobileImg.closest('picture');
    const mobileWrapper = mobilePicture.closest('p');
    mobilePicture.remove();
    const emptyWrapper = mobileWrapper && !mobileWrapper.children.length;
    if (emptyWrapper && !mobileWrapper.textContent.trim()) mobileWrapper.remove();
  }
  imgs.forEach((img) => {
    const breakpoints = [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }];
    const picture = createOptimizedPicture(img.src, img.alt, idx === 0, breakpoints);
    if (mobileImg) {
      const source = document.createElement('source');
      source.media = '(max-width: 575px)';
      source.srcset = mobileImg.src;
      picture.prepend(source);
      slide.classList.add('has-mobile-image');
    }
    img.closest('picture').replaceWith(picture);
  });
  if (idx === 0) {
    const img = media.querySelector('img');
    if (img) img.loading = 'eager';
  }
  slide.append(media);

  const detailCell = cells.find((c) => c !== imageCell);
  const details = buildDetails(detailCell);
  if (details) slide.append(details);
  return slide;
}

export default function decorate(block) {
  instanceCount += 1;
  const id = instanceCount;
  const rows = [...block.children].filter((row) => row.textContent.trim() || row.querySelector('picture, img'));

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (!block.getAttribute('aria-label')) block.setAttribute('aria-label', 'Featured offers');

  const stage = document.createElement('div');
  stage.className = 'carousel-hero-stage';
  const slidesEl = document.createElement('ul');
  slidesEl.className = 'carousel-hero-slides';
  slidesEl.setAttribute('aria-live', 'off');
  const slides = rows.map((row, idx) => createSlide(row, idx, id));
  slidesEl.append(...slides);
  stage.append(slidesEl);
  block.replaceChildren(stage);
  if (slides.some((slide) => slide.querySelector('.carousel-hero-details'))) {
    block.classList.add('has-details');
  }
  if (slides.some((slide) => slide.classList.contains('has-mobile-image'))) {
    block.classList.add('has-mobile-images');
  }

  slides.forEach((slide, idx) => slide.setAttribute('aria-label', `${idx + 1} of ${slides.length}`));
  if (slides.length < 2) return;

  // controls
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-hero-arrow carousel-hero-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-hero-arrow carousel-hero-next';
  next.setAttribute('aria-label', 'Next slide');
  stage.append(prev, next);

  const controls = document.createElement('div');
  controls.className = 'carousel-hero-controls';
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'carousel-hero-pause';
  const dots = document.createElement('ol');
  dots.className = 'carousel-hero-dots';
  slides.forEach((slide, idx) => {
    const li = document.createElement('li');
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-hero-dot';
    dot.dataset.targetSlide = idx;
    dot.setAttribute('aria-controls', slide.id);
    dot.setAttribute('aria-label', `Show slide ${idx + 1} of ${slides.length}`);
    li.append(dot);
    dots.append(li);
  });
  controls.append(pause, dots);
  stage.append(controls);

  let current = 0;
  let timer = null;
  let userPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setActive = (index) => {
    current = index;
    block.dataset.activeSlide = index;
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.setAttribute('aria-hidden', !isActive);
      slide.classList.toggle('is-active', isActive);
      slide.querySelectorAll('a, button, summary').forEach((el) => {
        if (isActive) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', '-1');
      });
    });
    dots.querySelectorAll('button').forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const goTo = (index) => {
    const target = (index + slides.length) % slides.length;
    slidesEl.scrollTo({ left: slides[target].offsetLeft, behavior: 'smooth' });
    setActive(target);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    if (!userPaused) timer = setInterval(() => goTo(current + 1), ROTATE_MS);
  };
  const renderPause = () => {
    pause.classList.toggle('is-paused', userPaused);
    pause.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
    slidesEl.setAttribute('aria-live', userPaused ? 'polite' : 'off');
  };

  pause.addEventListener('click', () => {
    userPaused = !userPaused;
    renderPause();
    start();
  });
  prev.addEventListener('click', () => { goTo(current - 1); start(); });
  next.addEventListener('click', () => { goTo(current + 1); start(); });
  dots.addEventListener('click', (e) => {
    const dot = e.target.closest('button[data-target-slide]');
    if (!dot) return;
    goTo(parseInt(dot.dataset.targetSlide, 10));
    start();
  });

  // pause while the user interacts with the carousel
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', (e) => { if (!block.contains(e.relatedTarget)) start(); });

  // keep state in sync with manual swipe/scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(parseInt(entry.target.dataset.slideIndex, 10));
    });
  }, { root: slidesEl, threshold: 0.6 });
  slides.forEach((slide) => observer.observe(slide));

  setActive(0);
  renderPause();
  start();
}
