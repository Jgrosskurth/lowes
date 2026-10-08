import { createOptimizedPicture } from '../../scripts/aem.js';
import { buildProductCard, createScroller } from '../../scripts/product-carousel.js';

/**
 * carousel-thematic: tabbed thematic panel + horizontally scrolling product cards.
 *
 * Content contract (one block instance per tab):
 *   row 1     = thematic panel: cell 1 = image, cell 2 = heading (tab label) + "Shop All" link
 *   rows 2..n = products: cell 1 = image, cell 2 = brand + linked title, price,
 *               was-price + savings, rating / reviews, social proof, "Add to Cart" link
 * Consecutive instances in the same section are merged into one tab group: the first instance
 * hosts the tab bar and later instances are moved into it as additional tab panels.
 */
const PREFIX = 'carousel-thematic';
let instanceCount = 0;

function isThematicRow(row) {
  return !!row.querySelector('h1, h2, h3, h4, h5, h6');
}

function buildThematic(row) {
  const cells = [...row.children];
  const panel = document.createElement('div');
  panel.className = 'carousel-thematic-feature';
  const imageCell = cells.find((c) => c.querySelector('picture, img') && !c.querySelector('h1, h2, h3, h4, h5, h6'));
  if (imageCell) {
    imageCell.className = 'carousel-thematic-feature-image';
    imageCell.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    });
    panel.append(imageCell);
  }
  const content = document.createElement('div');
  content.className = 'carousel-thematic-feature-content';
  cells.filter((c) => c !== imageCell).forEach((c) => content.append(...c.childNodes));
  content.querySelectorAll('a[href]').forEach((a) => a.classList.add('carousel-thematic-feature-link'));

  // the thematic artwork carries its own headline and "Shop All" button: the whole image becomes
  // the link and the authored copy stays available to assistive technology only
  const picture = imageCell?.querySelector('picture, img');
  const link = content.querySelector('a[href]');
  if (picture && link && !picture.closest('a')) {
    const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
    const imageLink = document.createElement('a');
    imageLink.href = link.href;
    imageLink.className = 'carousel-thematic-feature-image-link';
    const label = [heading?.textContent, link.textContent].map((t) => (t || '').trim()).filter(Boolean);
    if (label.length) imageLink.setAttribute('aria-label', label.join(': '));
    picture.replaceWith(imageLink);
    imageLink.append(picture);
    const linkLine = link.closest('p') || link;
    linkLine.remove();
    content.classList.add('carousel-thematic-feature-content-hidden');
  }
  if (content.textContent.trim()) panel.append(content);
  return panel;
}

function createTab(group, panel, label) {
  const tablist = group.querySelector('.carousel-thematic-tabs');
  const index = tablist.children.length;
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'carousel-thematic-tab';
  tab.setAttribute('role', 'tab');
  tab.id = `${panel.id}-tab`;
  tab.setAttribute('aria-controls', panel.id);
  tab.textContent = label || `Tab ${index + 1}`;
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  tablist.append(tab);
  if (label) tab.dataset.label = label;
  // the tab bar shows as soon as a tab has an authored label (a lone tab still reads as the title)
  group.classList.toggle('has-tabs', tablist.children.length > 1 || !!tablist.querySelector('[data-label]'));
  return tab;
}

function selectTab(group, tab) {
  group.querySelectorAll('.carousel-thematic-tab').forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', selected);
    t.tabIndex = selected ? 0 : -1;
    const panel = group.querySelector(`#${t.getAttribute('aria-controls')}`);
    if (panel) panel.hidden = !selected;
  });
}

function initTabGroup(block) {
  const tablist = document.createElement('div');
  tablist.className = 'carousel-thematic-tabs';
  tablist.setAttribute('role', 'tablist');
  block.prepend(tablist);
  block.classList.add('carousel-thematic-group');

  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) selectTab(block, tab);
  });
  tablist.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const tabs = [...tablist.children];
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let target = i;
    if (e.key === 'ArrowLeft') target = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'ArrowRight') target = (i + 1) % tabs.length;
    if (e.key === 'Home') target = 0;
    if (e.key === 'End') target = tabs.length - 1;
    e.preventDefault();
    tabs[target].focus();
    selectTab(block, tabs[target]);
  });
}

/** The tab-group host for this block: the immediately preceding instance in the section. */
function findGroupHost(block) {
  const wrapper = block.parentElement;
  if (!wrapper || !wrapper.classList.contains('carousel-thematic-wrapper')) return null;
  const prev = wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('carousel-thematic-wrapper')) return null;
  return prev.querySelector(':scope > .carousel-thematic-group');
}

export default function decorate(block) {
  instanceCount += 1;
  const rows = [...block.children];

  const panel = document.createElement('div');
  panel.className = 'carousel-thematic-pane';
  panel.id = `carousel-thematic-${instanceCount}-panel`;

  let label = '';
  const productRows = [...rows];
  if (rows.length && isThematicRow(rows[0])) {
    const thematicRow = productRows.shift();
    label = thematicRow.querySelector('h1, h2, h3, h4, h5, h6').textContent.trim();
    panel.append(buildThematic(thematicRow));
    panel.classList.add('has-feature');
  }

  const track = document.createElement('ul');
  track.className = 'carousel-thematic-track';
  productRows.forEach((row) => {
    const card = buildProductCard(row, PREFIX);
    if (card) track.append(card);
  });
  if (track.children.length) panel.append(createScroller(track, PREFIX));

  const host = findGroupHost(block);
  if (host) {
    // merge into the preceding instance's tab group, then drop this now-empty wrapper
    host.append(panel);
    const tab = createTab(host, panel, label);
    panel.hidden = true;
    tab.setAttribute('aria-selected', 'false');
    tab.tabIndex = -1;
    const wrapper = block.parentElement;
    block.replaceChildren();
    block.classList.add('carousel-thematic-merged');
    wrapper.hidden = true;
    return;
  }

  block.replaceChildren(panel);
  initTabGroup(block);
  const tab = createTab(block, panel, label);
  selectTab(block, tab);
}
