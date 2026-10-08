/*
 * Footer block: builds the Lowe's footer from the footer fragment (content/footer.plain.html).
 * Fragment contract: 1st section = icon link list; sections with <h2> = link columns (a column may
 * hold several <h2> groups; a list of image-only links renders as social icons); a section with
 * only a paragraph = legal/copyright line.
 */

async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.setAttribute('src', new URL(img.getAttribute('src'), resp.url).href);
  });
  return doc;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function buildIconRow(section) {
  const list = el('ul', 'footer-icons');
  section.querySelectorAll(':scope > ul > li > a').forEach((a) => {
    const li = el('li', 'footer-icon-item');
    const link = el('a', 'footer-icon-link');
    link.href = a.href;
    const circle = el('span', 'footer-icon-circle');
    const img = a.querySelector('img');
    if (img) {
      const icon = img.cloneNode(true);
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      circle.append(icon);
    }
    const label = el('span', 'footer-icon-label');
    label.textContent = a.textContent.trim();
    link.append(circle, label);
    li.append(link);
    list.append(li);
  });
  return list;
}

function buildColumn(section) {
  const col = el('div', 'footer-col');
  [...section.children].forEach((node) => {
    if (node.tagName === 'H2') {
      const h = el('p', 'footer-heading');
      h.textContent = node.textContent.trim();
      col.append(h);
    } else if (node.tagName === 'UL') {
      const list = node.cloneNode(true);
      const social = [...list.querySelectorAll('a')].every((a) => a.querySelector('img') && !a.textContent.trim());
      list.className = social ? 'footer-social' : 'footer-links';
      list.querySelectorAll('a').forEach((a) => {
        if (social) {
          const img = a.querySelector('img');
          a.setAttribute('aria-label', img.alt);
          img.alt = '';
          a.target = '_blank';
          a.rel = 'noopener';
        }
      });
      col.append(list);
    }
  });
  return col;
}

export default async function decorate(block) {
  const doc = await fetchFooter();
  block.textContent = '';
  if (!doc) return;
  const sections = [...doc.body.children].filter((n) => n.tagName === 'DIV');
  const footer = el('div', 'footer-inner');
  const columns = el('div', 'footer-columns');
  sections.forEach((section, i) => {
    if (section.querySelector(':scope > h2')) {
      columns.append(buildColumn(section));
    } else if (i === 0 && section.querySelector('ul img')) {
      footer.append(buildIconRow(section));
    } else if (section.querySelector(':scope > p')) {
      const legal = el('p', 'footer-legal');
      legal.innerHTML = section.querySelector(':scope > p').innerHTML;
      footer.append(columns, legal);
    }
  });
  if (!columns.parentElement) footer.append(columns);
  block.append(footer);
}
