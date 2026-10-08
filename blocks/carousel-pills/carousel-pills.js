/**
 * carousel-pills: horizontally scrolling strip of search-suggestion pill links.
 * Content contract: one row per pill, each row holding a link (extra cells/links tolerated).
 */
function updateArrows(track, prev, next) {
  const max = track.scrollWidth - track.clientWidth - 1;
  prev.disabled = track.scrollLeft <= 0;
  next.disabled = track.scrollLeft >= max;
  const scrollable = track.scrollWidth > track.clientWidth + 1;
  prev.hidden = !scrollable;
  next.hidden = !scrollable;
}

// Lowe's BDS "arrow-right" icon (16x16); mirrored in CSS for the previous button
const ARROW_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.452 14.531a.785.785 0 0 0 .56-.241l5.73-5.713A.78.78 0 0 0 16 8a.78.78 0 0 0-.258-.577l-5.713-5.695c-.19-.19-.37-.259-.577-.259-.422 0-.75.31-.75.741 0 .207.07.405.207.543l1.93 1.964 2.895 2.645-2.076-.129H.758C.31 7.233 0 7.552 0 8s.31.767.758.767h10.9l2.085-.13-2.904 2.646-1.93 1.964c-.138.13-.207.336-.207.543 0 .43.328.741.75.741Z"/></svg>';

export default function decorate(block) {
  const track = document.createElement('ul');
  track.className = 'carousel-pills-track';

  [...block.children].forEach((row) => {
    const links = [...row.querySelectorAll('a[href]')];
    if (links.length) {
      links.forEach((link) => {
        const li = document.createElement('li');
        li.className = 'carousel-pills-item';
        link.className = 'carousel-pills-pill';
        link.removeAttribute('title');
        li.append(link);
        track.append(li);
      });
      return;
    }
    // text-only row: render as a non-linked pill so authored content is not lost
    const text = row.textContent.trim();
    if (!text) return;
    const li = document.createElement('li');
    li.className = 'carousel-pills-item';
    const span = document.createElement('span');
    span.className = 'carousel-pills-pill';
    span.textContent = text;
    li.append(span);
    track.append(li);
  });

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-pills-arrow carousel-pills-prev';
  prev.setAttribute('aria-label', 'Scroll left');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-pills-arrow carousel-pills-next';
  next.setAttribute('aria-label', 'Scroll right');
  prev.innerHTML = ARROW_ICON;
  next.innerHTML = ARROW_ICON;

  const scrollByPage = (dir) => {
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scrollByPage(-1));
  next.addEventListener('click', () => scrollByPage(1));

  const viewport = document.createElement('div');
  viewport.className = 'carousel-pills-viewport';
  viewport.append(prev, track, next);
  block.replaceChildren(viewport);

  const refresh = () => updateArrows(track, prev, next);
  track.addEventListener('scroll', refresh, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(refresh).observe(track);
  requestAnimationFrame(refresh);
}
