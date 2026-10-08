/*
 * Header block: builds the masthead from the nav fragment (content/nav.plain.html).
 * Fragment contract (all copy, links and images live in the fragment; this file only renders):
 *  - Sections without an <h2>, in order: utility bar, brand, tools, menu.
 *  - Sections starting with <h2>Label</h2> are panels opened by the menu/tool item of that label.
 *    Panel: <h3> heading (a link renders with an arrow), <h4> group label, <ul> lists (an item
 *    with a nested <ul> drills into a new column), <p><a><img></a></p> promo,
 *    <p><strong><a></a></strong></p> button, <p><em>Label</em></p> form field,
 *    <p>[x] Label</p> checkbox. A second column starts at
 *    the first promo or at a plain <h3> that follows other content. A panel holding only a linked
 *    <h3> reuses the list nested under the same link elsewhere in the fragment.
 */

const DESKTOP = window.matchMedia('(width >= 1057px)');
const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;
const SUB_COLUMN_WIDTH = 300;

const slug = (text) => (text || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const norm = (text) => (text || '').replace(/\s+/g, ' ').trim().toLowerCase();

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) node.setAttribute(k, v);
  });
  return node;
}

/**
 * Fetches the nav fragment: /content first (local preview), then the site root (DA/EDS).
 * Image paths are resolved against the fragment URL so they work from any page.
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.setAttribute('src', new URL(img.getAttribute('src'), resp.url).href);
  });
  return doc;
}

/** Text of a node without the text of its <em> badges. */
function labelOf(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll('em, img, ul').forEach((n) => n.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

function iconImg(img, className) {
  const icon = img.cloneNode(true);
  icon.className = className;
  icon.setAttribute('aria-hidden', 'true');
  icon.alt = '';
  icon.loading = 'eager';
  return icon;
}

/* ---------- panels ---------- */

function findTreeList(doc, href, except) {
  const links = [...doc.querySelectorAll('li > a[href]')]
    .filter((a) => a.href === href && !except.contains(a));
  // the same URL can appear deeper in other trees; prefer the shallowest list owner
  const depth = (node) => {
    let d = 0;
    for (let n = node; n; n = n.parentElement) if (n.tagName === 'UL') d += 1;
    return d;
  };
  const owners = links.map((a) => a.parentElement).filter((li) => li.querySelector(':scope > ul'));
  owners.sort((a, b) => depth(a) - depth(b));
  return owners.length ? owners[0].querySelector(':scope > ul') : null;
}

function isPromo(node) {
  return node.tagName === 'P' && !!node.querySelector('img') && !node.textContent.trim();
}

function isButtonPara(node) {
  return node.tagName === 'P' && node.children.length === 1
    && node.firstElementChild.tagName === 'STRONG' && !!node.querySelector('strong > a');
}

function splitColumns(nodes) {
  const cols = [[]];
  let seen = false;
  nodes.forEach((node) => {
    const plainH3 = node.tagName === 'H3' && !node.querySelector('a');
    if (seen && cols.length === 1 && (isPromo(node) || plainH3)) cols.push([]);
    cols[cols.length - 1].push(node);
    seen = true;
  });
  return cols;
}

function renderHeading(h3, className) {
  const link = h3.querySelector('a');
  const head = el('p', className);
  if (link) {
    const a = el('a', 'nav-panel-heading-link', { href: link.href });
    a.append(el('span', 'nav-panel-heading-text'), el('span', 'nav-icon nav-icon-arrow', { 'aria-hidden': 'true' }));
    a.firstElementChild.textContent = link.textContent.trim();
    head.append(a);
  } else {
    head.classList.add('nav-panel-heading-plain');
    head.textContent = h3.textContent.trim();
  }
  return head;
}

function renderList(ul, level) {
  const list = el('ul', 'nav-panel-list');
  [...ul.children].forEach((li) => {
    const item = el('li', 'nav-panel-item');
    const link = li.querySelector(':scope > a');
    const img = li.querySelector(':scope > img, :scope > a > img');
    const sub = li.querySelector(':scope > ul');
    if (link) {
      const a = el('a', 'nav-panel-link', { href: link.href });
      if (img) {
        item.classList.add('nav-panel-card');
        a.append(iconImg(img, 'nav-panel-card-img'));
      }
      a.append(el('span', 'nav-panel-link-text'));
      a.lastElementChild.textContent = labelOf(link);
      item.append(a);
    } else {
      item.classList.add('nav-panel-icon-item');
      if (img) item.append(iconImg(img, 'nav-panel-icon-img'));
      const text = el('span', 'nav-panel-link-text');
      text.textContent = labelOf(li);
      item.append(text);
    }
    if (sub) {
      item.classList.add('has-children');
      item.dataset.level = level;
      item.append(el('span', 'nav-icon nav-icon-chevron', { 'aria-hidden': 'true' }));
      item.subList = sub;
    }
    list.append(item);
  });
  if (list.querySelector('.nav-panel-card')) list.classList.add('nav-panel-cards');
  if (list.querySelector('.nav-panel-icon-item')) list.classList.add('nav-panel-icons');
  return list;
}

function renderColumn(nodes, className, level) {
  const col = el('div', `nav-panel-col ${className}`);
  let lastPromo = null;
  nodes.forEach((node) => {
    if (node.tagName === 'H3') {
      col.append(renderHeading(node, 'nav-panel-heading'));
    } else if (node.tagName === 'H4') {
      const group = el('p', 'nav-panel-group');
      group.textContent = node.textContent.trim();
      col.append(group);
    } else if (node.tagName === 'UL') {
      col.append(renderList(node, level));
    } else if (isPromo(node)) {
      const promo = el('div', 'nav-panel-promo');
      const link = node.querySelector('a');
      const img = node.querySelector('img').cloneNode(true);
      img.loading = 'lazy';
      if (link) {
        const a = el('a', 'nav-panel-promo-link', { href: link.href, 'aria-label': img.alt || null });
        a.append(img);
        promo.append(a);
      } else promo.append(img);
      col.append(promo);
      lastPromo = promo;
      return;
    } else if (isButtonPara(node)) {
      const link = node.querySelector('a');
      const btn = el('a', 'nav-panel-button', { href: link.href });
      btn.textContent = link.textContent.trim();
      if (lastPromo) {
        btn.classList.add('nav-panel-promo-button');
        lastPromo.append(btn);
      } else col.append(btn);
    } else if (node.tagName === 'P') {
      const p = el('p', node.querySelector(':scope > strong:only-child') ? 'nav-panel-subtitle' : 'nav-panel-text');
      p.innerHTML = node.innerHTML;
      col.append(p);
    }
    lastPromo = null;
  });
  return col;
}

/* ---------- dialogs (tool panels: store, sign in, assistant) ---------- */

function renderDialog(section, trigger) {
  const name = slug(section.querySelector('h2').textContent);
  const dialog = el('div', `nav-dialog nav-dialog-${name}`, {
    role: 'dialog', 'aria-modal': 'true', id: `nav-dialog-${name}`, hidden: '',
  });
  const nodes = [...section.children].filter((n) => n.tagName !== 'H2');
  const titleNode = nodes.find((n) => n.tagName === 'H3');
  const bar = el('div', 'nav-dialog-bar');
  const title = el('p', 'nav-dialog-title', { id: `nav-dialog-${name}-title` });
  title.textContent = titleNode ? titleNode.textContent.trim() : section.querySelector('h2').textContent;
  dialog.setAttribute('aria-labelledby', title.id);
  const close = el('button', 'nav-dialog-close', { type: 'button', 'aria-label': 'Close' });
  close.append(el('span', 'nav-icon nav-icon-close', { 'aria-hidden': 'true' }));
  bar.append(title, close);
  dialog.append(bar);

  const body = el('div', 'nav-dialog-body');
  const hasFields = nodes.some((n) => n.tagName === 'P' && n.querySelector(':scope > em:only-child'));
  const formAction = (nodes.find(isButtonPara)?.querySelector('a') || trigger)?.href;
  const form = hasFields ? el('form', 'nav-dialog-form', { action: formAction, method: 'get' }) : null;
  let fieldRow = null;
  nodes.filter((n) => n !== titleNode).forEach((node) => {
    const target = form && (node.tagName === 'P' && (node.querySelector(':scope > em:only-child')
      || /^\[[ x]\]\s/i.test(node.textContent.trim()) || isButtonPara(node))) ? form : body;
    if (node.tagName === 'H4') {
      const h = el('p', 'nav-dialog-heading');
      h.textContent = node.textContent.trim();
      body.append(h);
    } else if (node.tagName === 'P' && node.querySelector(':scope > em:only-child')) {
      const label = node.textContent.trim();
      const id = `nav-field-${name}-${slug(label)}`;
      fieldRow = el('div', 'nav-dialog-field');
      const lab = el('label', 'nav-dialog-label', { for: id });
      lab.textContent = label;
      const input = el('input', 'nav-dialog-input', {
        id, name: slug(label).split('-')[0] || 'q', type: 'text', placeholder: label, autocomplete: 'on',
      });
      fieldRow.append(input, lab);
      target.append(fieldRow);
    } else if (node.tagName === 'P' && /^\[[ x]\]\s/i.test(node.textContent.trim())) {
      const text = node.textContent.trim();
      const id = `nav-check-${name}-${slug(text.slice(4))}`;
      const row = el('div', 'nav-dialog-check');
      const box = el('input', 'nav-dialog-checkbox', { type: 'checkbox', id, name: slug(text.slice(4)) });
      box.checked = /^\[x\]/i.test(text);
      const lab = el('label', '', { for: id });
      lab.textContent = text.slice(4);
      row.append(box, lab);
      target.append(row);
    } else if (isButtonPara(node)) {
      const btn = el('button', 'nav-dialog-submit', { type: 'submit' });
      btn.textContent = node.textContent.trim();
      (form || body).append(btn);
    } else if (node.tagName === 'UL') {
      body.append(renderList(node, 0));
    } else if (node.tagName === 'P') {
      const p = el('p', 'nav-dialog-text');
      p.innerHTML = node.innerHTML;
      body.append(p);
    }
  });
  if (form) {
    if (!form.querySelector('.nav-dialog-submit') && fieldRow) {
      const go = el('button', 'nav-dialog-go', { type: 'submit', 'aria-label': 'Submit' });
      go.append(el('span', 'nav-icon nav-icon-arrow', { 'aria-hidden': 'true' }));
      fieldRow.append(go);
    }
    const firstText = body.querySelector('.nav-dialog-text');
    const anchorNode = body.querySelector('.nav-dialog-heading') || firstText;
    if (anchorNode && anchorNode === firstText) anchorNode.after(form);
    else if (anchorNode) (anchorNode.nextElementSibling || anchorNode).after(form);
    else body.prepend(form);
  }
  dialog.append(body);
  return dialog;
}

/* ---------- build ---------- */

function buildUtility(section) {
  const bar = el('div', 'nav-utility');
  const inner = el('div', 'nav-utility-inner');
  const promo = section.querySelector('p a');
  if (promo) {
    const a = el('a', 'nav-utility-promo', { href: promo.href });
    a.textContent = promo.textContent.trim();
    inner.append(a);
  }
  const ul = section.querySelector('ul');
  if (ul) {
    const links = ul.cloneNode(true);
    links.className = 'nav-utility-links';
    inner.append(links);
  }
  bar.append(inner);
  return bar;
}

function buildSearch(link) {
  const form = el('form', 'nav-search', { action: link.href, method: 'get', role: 'search' });
  const label = labelOf(link);
  const input = el('input', 'nav-search-input', {
    type: 'search', name: 'searchTerm', placeholder: label, 'aria-label': label, autocomplete: 'off',
  });
  const imgs = [...link.querySelectorAll('img')];
  const submit = el('button', 'nav-search-submit', { type: 'submit', 'aria-label': imgs[0]?.alt || 'Search' });
  if (imgs[0]) submit.append(iconImg(imgs[0], 'nav-search-icon'));
  form.append(input, submit);
  if (imgs[1]) {
    const visual = el('button', 'nav-search-visual', { type: 'button', 'aria-label': imgs[1].alt || 'Visual Search' });
    visual.append(iconImg(imgs[1], 'nav-search-icon'));
    form.append(visual);
  }
  return form;
}

function buildToolItem(link, panelSection) {
  const label = labelOf(link);
  const imgs = [...link.querySelectorAll('img')];
  const node = panelSection
    ? el('button', 'nav-tool-button', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' })
    : el('a', 'nav-tool-button', { href: link.href });
  if (imgs[0]) node.append(iconImg(imgs[0], 'nav-tool-icon'));
  const text = el('span', 'nav-tool-label');
  text.textContent = label;
  node.append(text);
  if (imgs[1]) node.append(iconImg(imgs[1], 'nav-tool-caret'));
  return node;
}

export default async function decorate(block) {
  const doc = await fetchNav();
  block.textContent = '';
  if (!doc) return;

  const sections = [...doc.body.children].filter((n) => n.tagName === 'DIV');
  const panelSections = sections.filter((s) => s.firstElementChild?.tagName === 'H2');
  const plain = sections.filter((s) => !panelSections.includes(s));
  const [utilitySection, brandSection, toolsSection, menuSection] = plain;
  const findPanelSection = (label) => {
    const key = norm(label);
    return panelSections.find((s) => {
      const h = norm(s.firstElementChild.textContent);
      return h === key || key.startsWith(`${h} `) || h.startsWith(`${key} `);
    });
  };

  const nav = el('nav', '', { id: 'nav', 'aria-label': 'Main navigation' });
  const overlay = el('div', 'nav-overlay', { hidden: '' });

  // row 0: utility bar
  if (utilitySection) nav.append(buildUtility(utilitySection));

  // row 1: brand, store, search, tools
  const main = el('div', 'nav-main');
  const mainInner = el('div', 'nav-main-inner');
  const hamburger = el('button', 'nav-hamburger', {
    type: 'button', 'aria-controls': 'nav-menu', 'aria-expanded': 'false', 'aria-label': 'Open menu',
  });
  hamburger.append(el('span', 'nav-hamburger-icon', { 'aria-hidden': 'true' }));
  mainInner.append(hamburger);
  const brandLink = brandSection?.querySelector('a');
  if (brandLink) {
    const brand = el('a', 'nav-brand', { href: brandLink.href, 'aria-label': brandLink.querySelector('img')?.alt || 'Home' });
    const logo = brandLink.querySelector('img');
    if (logo) brand.append(iconImg(logo, 'nav-brand-logo'));
    mainInner.append(brand);
  }
  const dialogs = [];
  const tools = el('ul', 'nav-tools');
  let afterSearch = false;
  [...(toolsSection?.querySelectorAll(':scope > ul > li') || [])].forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    if (/\/search\b/.test(new URL(link.href).pathname)) {
      mainInner.append(buildSearch(link));
      afterSearch = true;
      return;
    }
    const section = findPanelSection(labelOf(link));
    const item = buildToolItem(link, section);
    const wrap = el('div', `nav-tool nav-tool-${slug(labelOf(link))}`);
    wrap.append(item);
    if (section) {
      const dialog = renderDialog(section, link);
      item.setAttribute('aria-controls', dialog.id);
      dialogs.push({ trigger: item, dialog });
    }
    if (afterSearch) {
      const toolLi = el('li');
      toolLi.append(wrap);
      tools.append(toolLi);
    } else mainInner.append(wrap);
  });
  mainInner.append(tools);
  main.append(mainInner);
  nav.append(main);

  // row 2: menu triggers + panels
  const sectionsRow = el('div', 'nav-sections', { id: 'nav-menu' });
  const sectionsInner = el('div', 'nav-sections-inner');
  const menu = el('ul', 'nav-menu-list');
  const panelsLayer = el('div', 'nav-panels');
  const entries = [];
  [...(menuSection?.querySelectorAll(':scope > ul > li') || [])].forEach((li, i) => {
    const item = el('li', 'nav-item');
    const link = li.querySelector('a');
    const icon = li.querySelector('img');
    const badge = li.querySelector('em');
    if (icon) item.classList.add('nav-item-has-icon');
    if (link) {
      const a = el('a', 'nav-trigger', { href: link.href });
      a.textContent = link.textContent.trim();
      item.append(a);
      menu.append(item);
      return;
    }
    const label = labelOf(li);
    const section = findPanelSection(label);
    const trigger = el('button', 'nav-trigger', { type: 'button', 'aria-expanded': 'false' });
    if (icon) trigger.append(iconImg(icon, 'nav-trigger-icon'));
    const text = el('span', 'nav-trigger-label');
    text.textContent = label;
    trigger.append(text);
    if (badge) {
      const b = el('span', 'nav-badge');
      b.textContent = badge.textContent.trim();
      trigger.append(b);
    }
    item.append(trigger);
    menu.append(item);
    if (!section) return;
    const panel = el('div', `nav-panel nav-panel-${slug(label)}`, {
      id: `nav-panel-${i}`, role: 'region', 'aria-label': label, hidden: '',
    });
    trigger.setAttribute('aria-controls', panel.id);
    let nodes = [...section.children].slice(1);
    if (!nodes.some((n) => n.tagName === 'UL')) {
      const headLink = section.querySelector(':scope > h3 a');
      const shared = headLink && findTreeList(doc, headLink.href, section);
      if (shared) nodes = [...nodes, shared];
    }
    const cols = splitColumns(nodes);
    const inner = el('div', 'nav-panel-inner');
    inner.append(renderColumn(cols[0], 'nav-panel-main', 1));
    if (cols[1]) inner.append(renderColumn(cols[1], 'nav-panel-aside', 1));
    panel.append(inner);
    panelsLayer.append(panel);
    entries.push({ trigger, panel, item });
  });
  sectionsInner.append(menu);
  sectionsRow.append(sectionsInner, panelsLayer);
  nav.append(sectionsRow);

  block.append(nav, overlay, ...dialogs.map((d) => d.dialog));

  /* ---------- behavior ---------- */
  let openEntry = null;
  let openTimer;
  let closeTimer;

  const placePanel = (entry) => {
    const { panel, trigger } = entry;
    const layer = panelsLayer.getBoundingClientRect();
    const t = trigger.getBoundingClientRect();
    const gutter = parseFloat(getComputedStyle(sectionsInner).paddingRight) || 0;
    const right = layer.width - gutter;
    const width = panel.offsetWidth + (panel.querySelector('.has-children') ? SUB_COLUMN_WIDTH : 0);
    // under the trigger when the expanded panel fits; else centred under it; else anchored to the
    // right edge so drill columns grow leftwards and stay in view
    let left = t.left - layer.left;
    panel.style.right = '';
    if (left + width > right) {
      left = (t.left + t.width / 2) - layer.left - width / 2;
      if (left < gutter || left + width > right) {
        panel.style.left = 'auto';
        panel.style.right = `${Math.round(layer.width - right)}px`;
        return;
      }
    }
    panel.style.left = `${Math.round(left)}px`;
  };

  const closeSubColumns = (panel, level) => {
    panel.querySelectorAll('.nav-panel-sub').forEach((col) => {
      if (Number(col.dataset.level) >= level) col.remove();
    });
    panel.querySelectorAll('.nav-panel-item.is-active').forEach((li) => {
      if (Number(li.dataset.level) >= level) li.classList.remove('is-active');
    });
  };

  const openSub = (panel, li) => {
    const level = Number(li.dataset.level);
    closeSubColumns(panel, level);
    li.classList.add('is-active');
    const link = li.querySelector(':scope > a');
    const parentCol = li.closest('.nav-panel-col');
    const parentHeading = parentCol.querySelector('.nav-panel-heading-text, .nav-panel-heading-plain');
    const prefix = parentHeading && /^shop all\b/i.test(parentHeading.textContent.trim()) ? 'Shop All ' : '';
    const col = el('div', 'nav-panel-col nav-panel-sub');
    col.dataset.level = level;
    const head = el('p', 'nav-panel-heading');
    const a = el('a', 'nav-panel-heading-link', { href: link.href });
    a.append(el('span', 'nav-panel-heading-text'), el('span', 'nav-icon nav-icon-arrow', { 'aria-hidden': 'true' }));
    a.firstElementChild.textContent = `${prefix}${link.textContent.trim()}`;
    head.append(a);
    col.append(head, renderList(li.subList, level + 1));
    parentCol.after(col);
  };

  const close = () => {
    clearTimeout(openTimer);
    if (!openEntry) return;
    openEntry.trigger.setAttribute('aria-expanded', 'false');
    openEntry.item.classList.remove('is-open');
    openEntry.panel.hidden = true;
    closeSubColumns(openEntry.panel, 0);
    openEntry = null;
    overlay.hidden = true;
  };

  const open = (entry) => {
    clearTimeout(closeTimer);
    if (openEntry === entry) return;
    close();
    entry.panel.hidden = false;
    entry.trigger.setAttribute('aria-expanded', 'true');
    entry.item.classList.add('is-open');
    placePanel(entry);
    overlay.style.top = `${Math.max(0, sectionsRow.getBoundingClientRect().bottom)}px`;
    overlay.hidden = false;
    openEntry = entry;
  };

  const scheduleClose = () => {
    clearTimeout(openTimer);
    closeTimer = setTimeout(close, CLOSE_DELAY);
  };

  entries.forEach((entry) => {
    const { trigger, panel } = entry;
    trigger.addEventListener('mouseenter', () => {
      if (!DESKTOP.matches) return;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(() => open(entry), openEntry ? 0 : OPEN_DELAY);
    });
    trigger.addEventListener('mouseleave', () => { if (DESKTOP.matches) scheduleClose(); });
    trigger.addEventListener('click', () => {
      if (openEntry === entry) close(); else open(entry);
    });
    panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    panel.addEventListener('mouseleave', () => { if (DESKTOP.matches) scheduleClose(); });
    const drill = (e) => {
      const li = e.target.closest('.nav-panel-item.has-children');
      if (li && panel.contains(li)) openSub(panel, li);
    };
    panel.addEventListener('mouseover', (e) => { if (DESKTOP.matches) drill(e); });
    panel.addEventListener('focusin', drill);
  });
  overlay.addEventListener('click', () => {
    close();
    // eslint-disable-next-line no-use-before-define
    closeDialogs();
  });

  // dialogs
  const closeDialogs = () => {
    dialogs.forEach(({ trigger, dialog }) => {
      if (dialog.hidden) return;
      dialog.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      block.classList.remove(`has-${dialog.id}`);
    });
    if (!openEntry) overlay.hidden = true;
  };
  dialogs.forEach(({ trigger, dialog }) => {
    trigger.addEventListener('click', () => {
      const wasOpen = !dialog.hidden;
      close();
      closeDialogs();
      if (wasOpen) return;
      dialog.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      block.classList.add(`has-${dialog.id}`);
      overlay.style.top = '0px';
      overlay.hidden = false;
      const focusable = dialog.querySelector('input, button, a');
      if (focusable) focusable.focus();
    });
    dialog.querySelector('.nav-dialog-close').addEventListener('click', () => {
      closeDialogs();
      trigger.focus();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openEntry) {
      const { trigger } = openEntry;
      close();
      trigger.focus();
    }
    // eslint-disable-next-line no-use-before-define
    if (nav.classList.contains('is-menu-open')) toggleMenu(false);
    closeDialogs();
  });
  document.addEventListener('click', (e) => {
    if (openEntry && !nav.contains(e.target)) close();
  });

  // priority nav: hide menu items that do not fit on one row (desktop)
  const fitMenu = () => {
    const items = [...menu.children];
    items.forEach((li) => { li.hidden = false; });
    if (!DESKTOP.matches) return;
    const limit = menu.getBoundingClientRect().right;
    items.forEach((li) => {
      if (li.getBoundingClientRect().right > limit + 1) li.hidden = true;
    });
  };

  // mobile menu
  const toggleMenu = (force) => {
    const expanded = typeof force === 'boolean' ? force : hamburger.getAttribute('aria-expanded') !== 'true';
    hamburger.setAttribute('aria-expanded', String(expanded));
    hamburger.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-menu-open', expanded);
    document.body.style.overflowY = expanded && !DESKTOP.matches ? 'hidden' : '';
  };
  hamburger.addEventListener('click', () => toggleMenu());

  const onBreakpoint = () => {
    close();
    closeDialogs();
    toggleMenu(false);
    fitMenu();
  };
  DESKTOP.addEventListener('change', onBreakpoint);
  if (window.ResizeObserver) new ResizeObserver(() => fitMenu()).observe(sectionsInner);
  fitMenu();
}
