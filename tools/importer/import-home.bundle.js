/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel-pills.js
  function parse(element, { document: document2 }) {
    let items = [...element.querySelectorAll(".carousel-item")];
    if (!items.length) items = [...element.querySelectorAll('.pill-card, [class*="PillCard"]')];
    if (!items.length) items = [...element.querySelectorAll('button[class*="pill"], a[class*="pill"]')];
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    items.forEach((item) => {
      const existing = item.querySelector("a[href]");
      const source = item.querySelector('button[class*="pill"], [role="button"], p') || item;
      const text = (existing || source).textContent.replace(/\s+/g, " ").trim();
      if (!text || seen.has(text.toLowerCase())) return;
      seen.add(text.toLowerCase());
      const link3 = document2.createElement("a");
      if (existing) {
        const raw = existing.getAttribute("href");
        link3.href = raw.startsWith("/") ? `https://www.lowes.com${raw}` : raw;
      } else {
        link3.href = `https://www.lowes.com/search?searchTerm=${encodeURIComponent(text)}`;
      }
      link3.textContent = text;
      cells.push([link3]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-pills", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-hero.js
  function absUrl(href) {
    if (!href) return "";
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) return `https://www.lowes.com${href}`;
    return href;
  }
  function mobileImage(srcImg, desktopSrc, document2) {
    var _a;
    const sources = ((_a = srcImg == null ? void 0 : srcImg.closest("picture")) == null ? void 0 : _a.querySelectorAll("source[media][srcset]")) || [];
    const source = [...sources].find((s) => {
      const media = s.getAttribute("media") || "";
      return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
    });
    const url = source ? absUrl(source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0]) : "";
    if (!url || url === desktopSrc) return null;
    const img = document2.createElement("img");
    img.src = url;
    img.alt = (srcImg.getAttribute("alt") || "").trim();
    return img;
  }
  function parse2(element, { document: document2 }) {
    let slides = [...element.querySelectorAll('[class*="CarouselItemWrapper"]')];
    if (!slides.length) slides = [...element.querySelectorAll('[class*="BannerWrapper"]')];
    if (!slides.length) {
      slides = [...element.querySelectorAll("img")].map((img) => {
        var _a;
        return ((_a = img.closest("a")) == null ? void 0 : _a.parentElement) || img.parentElement;
      });
    }
    const cells = [];
    slides.forEach((slide) => {
      var _a, _b;
      const srcImg = slide.querySelector("img");
      if (!srcImg) return;
      const src = srcImg.getAttribute("src") || srcImg.getAttribute("data-src") || ((_b = (_a = slide.querySelector("source[srcset]")) == null ? void 0 : _a.getAttribute("srcset")) == null ? void 0 : _b.split(/[\s,]/)[0]);
      if (!src) return;
      const img = document2.createElement("img");
      img.src = absUrl(src);
      img.alt = (srcImg.getAttribute("alt") || "").trim();
      const mobileImg = mobileImage(srcImg, absUrl(src), document2);
      const images = mobileImg ? [img, mobileImg] : [img];
      const anchor = srcImg.closest("a[href]") || slide.querySelector('a.carousel-linkWrapper[href], a[class*="LinkWrapper"][href]');
      let imageCell = images;
      if (anchor) {
        const link3 = document2.createElement("a");
        link3.href = absUrl(anchor.getAttribute("href"));
        link3.append(...images);
        imageCell = link3;
      }
      let detailsCell = "";
      const details = slide.querySelector('.secondary-link-wrapper, [data-testid="playwright-secondary-link"], [class*="SecondaryLinkWrapper"]');
      if (details) {
        const label = details.textContent.replace(/\s+/g, " ").trim();
        const dLink = details.querySelector("a[href]");
        if (dLink && label) {
          const a = document2.createElement("a");
          a.href = absUrl(dLink.getAttribute("href"));
          a.textContent = label;
          detailsCell = a;
        } else if (label) {
          const p = document2.createElement("p");
          p.textContent = label;
          detailsCell = p;
        }
      }
      cells.push([imageCell, detailsCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function absUrl2(href) {
    if (!href) return "";
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) return `https://www.lowes.com${href}`;
    return href;
  }
  function mobileImage2(srcImg, desktopSrc, document2) {
    var _a;
    const sources = ((_a = srcImg == null ? void 0 : srcImg.closest("picture")) == null ? void 0 : _a.querySelectorAll("source[media][srcset]")) || [];
    const source = [...sources].find((s) => {
      const media = s.getAttribute("media") || "";
      return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
    });
    const url = source ? absUrl2(source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0]) : "";
    if (!url || url === desktopSrc) return null;
    const img = document2.createElement("img");
    img.src = url;
    img.alt = (srcImg.getAttribute("alt") || "").trim();
    return img;
  }
  function parse3(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll(':scope > div[class*="ColumnWrapper"]')];
    if (!tiles.length) tiles = [...element.querySelectorAll(":scope > div")];
    const cells = [];
    tiles.forEach((tile) => {
      const srcImg = tile.querySelector("img");
      const anchor = tile.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]') || (srcImg == null ? void 0 : srcImg.closest("a[href]")) || tile.querySelector("a[href]");
      if (!srcImg && !anchor) return;
      let imageCell = "";
      if (srcImg) {
        const src = srcImg.getAttribute("src") || srcImg.getAttribute("data-src");
        if (src) {
          const img = document2.createElement("img");
          img.src = absUrl2(src);
          img.alt = (srcImg.getAttribute("alt") || "").trim();
          const mobileImg = mobileImage2(srcImg, absUrl2(src), document2);
          imageCell = mobileImg ? [img, mobileImg] : img;
        }
      }
      let linkCell = "";
      if (anchor) {
        const a = document2.createElement("a");
        a.href = absUrl2(anchor.getAttribute("href"));
        const label = anchor.textContent.replace(/\s+/g, " ").trim();
        a.textContent = label || "Shop Now";
        linkCell = a;
      }
      if (!imageCell && !linkCell) return;
      cells.push([imageCell, linkCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function absUrl3(href) {
    if (!href) return "";
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) return `https://www.lowes.com${href}`;
    return href;
  }
  function mobileImage3(srcImg, desktopSrc, document2) {
    var _a;
    const sources = ((_a = srcImg == null ? void 0 : srcImg.closest("picture")) == null ? void 0 : _a.querySelectorAll("source[media][srcset]")) || [];
    const source = [...sources].find((s) => {
      const media = s.getAttribute("media") || "";
      return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
    });
    const url = source ? absUrl3(source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0]) : "";
    if (!url || url === desktopSrc) return null;
    const img = document2.createElement("img");
    img.src = url;
    img.alt = (srcImg.getAttribute("alt") || "").trim();
    return img;
  }
  function parse4(element, { document: document2 }) {
    let columns = [...element.querySelectorAll(':scope > div[class*="ColumnWrapper"]')];
    if (!columns.length) columns = [...element.querySelectorAll(":scope > div")];
    const row = [];
    columns.forEach((col) => {
      const content = [];
      const srcImg = col.querySelector("img");
      if (srcImg) {
        const src = srcImg.getAttribute("src") || srcImg.getAttribute("data-src");
        if (src) {
          const img = document2.createElement("img");
          img.src = absUrl3(src);
          img.alt = (srcImg.getAttribute("alt") || "").trim();
          const mobileImg = mobileImage3(srcImg, absUrl3(src), document2);
          const images = mobileImg ? [img, mobileImg] : [img];
          const anchor = srcImg.closest("a[href]") || col.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]');
          if (anchor) {
            const a = document2.createElement("a");
            a.href = absUrl3(anchor.getAttribute("href"));
            a.append(...images);
            content.push(a);
          } else {
            content.push(...images);
          }
        }
      }
      const details = col.querySelector('.secondary-link-wrapper, [data-testid="playwright-secondary-link"]');
      if (details) {
        const label = details.textContent.replace(/\s+/g, " ").trim();
        const dLink = details.querySelector("a[href]");
        if (label) {
          const p = document2.createElement("p");
          if (dLink) {
            const a = document2.createElement("a");
            a.href = absUrl3(dLink.getAttribute("href"));
            a.textContent = label;
            p.append(a);
          } else {
            p.textContent = label;
          }
          content.push(p);
        }
      }
      if (content.length) row.push(content);
    });
    if (!row.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/widget-weather.js
  var ORIGIN = "https://www.lowes.com";
  function absUrl4(href) {
    const h = (href || "").trim();
    if (!h) return "";
    if (h.startsWith("//")) return `https:${h}`;
    if (h.startsWith("/")) return `${ORIGIN}${h}`;
    return h;
  }
  function textOf(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse5(element, { document: document2 }) {
    const cells = [];
    const forecastTitle = textOf(element.querySelector(
      '[class*="WeatherForecastSlimstyles__TitleWrapper"] > p, [class*="WeatherForecast"] [class*="TitleWrapper"] > p'
    )) || "Your Local Weather";
    const titleP = document2.createElement("p");
    const strong = document2.createElement("strong");
    strong.textContent = forecastTitle;
    titleP.append(strong);
    cells.push([titleP]);
    const seen = /* @__PURE__ */ new Set();
    element.querySelectorAll('div[class*="ProjectForecastSlimstyles__SideWrap"], div[class*="ProjectForecast"][class*="SideWrap"]').forEach((side) => {
      var _a;
      const title = textOf(side.querySelector("h1, h2, h3, h4, h5, h6, .card-title"));
      const card = side.closest("a[href]") || side.closest('.item-wrapper, [class*="CarouselItemWrapper"]');
      const linkEl = card && card.matches("a[href]") ? card : card == null ? void 0 : card.querySelector("a[href]");
      const url = absUrl4(linkEl == null ? void 0 : linkEl.getAttribute("href"));
      const key = `${title}|${url}`;
      if (!title || seen.has(key)) return;
      seen.add(key);
      const srcImg = (_a = card || side.parentElement) == null ? void 0 : _a.querySelector("img");
      const src = srcImg && (srcImg.getAttribute("src") || srcImg.getAttribute("data-src"));
      let img = "";
      if (src && !src.startsWith("data:")) {
        img = document2.createElement("img");
        img.src = absUrl4(src);
        img.alt = (srcImg.getAttribute("alt") || title).trim();
      }
      const body = [];
      const h4 = document2.createElement("h4");
      h4.textContent = title;
      body.push(h4);
      const desc = textOf(side.querySelector('.card-description, [class*="CardDescription"]'));
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc;
        body.push(p);
      }
      if (url) {
        const cta = textOf(side.querySelector('.readtext, [class*="ReadLink"]')) || "Read Article";
        const a = document2.createElement("a");
        a.href = url;
        a.textContent = cta;
        const p = document2.createElement("p");
        p.append(a);
        body.push(p);
      }
      cells.push([img, body]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "widget-weather", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-thematic.js
  var ORIGIN2 = "https://www.lowes.com";
  function absUrl5(href) {
    if (!href) return "";
    const h = href.trim();
    if (h.startsWith("//")) return `https:${h}`;
    if (h.startsWith("/")) return `${ORIGIN2}${h}`;
    return h;
  }
  function textOf2(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function makeImg(document2, srcImg) {
    if (!srcImg) return null;
    const src = srcImg.getAttribute("src") || srcImg.getAttribute("data-src");
    if (!src || src.startsWith("data:")) return null;
    const img = document2.createElement("img");
    img.src = absUrl5(src);
    img.alt = (srcImg.getAttribute("alt") || "").trim();
    return img;
  }
  function para(document2, ...children) {
    const p = document2.createElement("p");
    children.forEach((c) => {
      if (c) p.append(c);
    });
    return p;
  }
  function buildProductRow(card, document2) {
    const pdp = card.querySelector('a[href*="/pd/"]') || card.querySelector("a[href]");
    const href = pdp ? absUrl5(pdp.getAttribute("href")) : "";
    const img = makeImg(document2, card.querySelector('picture img, [class*="CardImage"] img, .image-container-wrapper img'));
    const body = [];
    const brand = textOf2(card.querySelector('.brand-name, [class*="brand"]'));
    const desc = textOf2(card.querySelector('.product-desc, [class*="product-desc"]'));
    const titleText = desc || (img ? img.alt : "");
    if (brand || titleText) {
      const p = document2.createElement("p");
      if (brand) {
        const strong = document2.createElement("strong");
        strong.textContent = brand;
        p.append(strong);
        if (titleText) p.append(" ");
      }
      if (titleText) {
        if (href) {
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = titleText;
          p.append(a);
        } else {
          p.append(titleText);
        }
      }
      body.push(p);
    }
    const priceEl = card.querySelector('.recs-final-price, [class*="RegularPrice"], [class*="final-price"]');
    const price = priceEl ? priceEl.textContent.replace(/\s+/g, "") : "";
    if (/\$\d/.test(price)) body.push(para(document2, price));
    const was = textOf2(card.querySelector('.recs-strickthrough-price, [class*="Strikethrough"]'));
    const save = textOf2(card.querySelector('.recs-price-block-message, [class*="price-block-message"]'));
    if (was || save) {
      const p = document2.createElement("p");
      if (was) {
        const del = document2.createElement("del");
        del.textContent = was;
        p.append(del);
        if (save) p.append(" ");
      }
      if (save) p.append(save);
      body.push(p);
    }
    const promo = textOf2(card.querySelector('[data-component="PromoMessage"], [class*="PromoMessage"]'));
    if (promo) body.push(para(document2, promo));
    const ratingEl = card.querySelector('[role="img"][aria-label*="Star" i], .rating, [class*="RatingWrapper"]');
    const count = textOf2(card.querySelector('.rating-count, [class*="rating-count"]')).replace(/[()]/g, "");
    let rating = "";
    const label = (ratingEl == null ? void 0 : ratingEl.getAttribute("aria-label")) || "";
    const m = label.match(/(\d(?:\.\d+)?)/);
    if (m) rating = m[1];
    else if (ratingEl) {
      const filled = ratingEl.querySelectorAll(".rating-icon.filled").length;
      if (filled) rating = String(Math.min(5, filled));
    }
    if (rating) {
      body.push(para(document2, `${rating} out of 5 stars${count ? ` (${count} reviews)` : ""}`));
    }
    const social = textOf2(card.querySelector('.social-proofing-badge-label, [class*="social-proof"]'));
    if (social) body.push(para(document2, social));
    const atc = card.querySelector('[data-component="AddToCart"], [class*="AddToCart"], .atc-button');
    if (atc && href) {
      const a = document2.createElement("a");
      a.href = href;
      a.textContent = textOf2(atc.querySelector(".atc-button, button")) || "Add to Cart";
      if (!/add to cart/i.test(a.textContent)) a.textContent = "Add to Cart";
      body.push(para(document2, a));
    }
    if (!img && !body.length) return null;
    return [img || "", body.length ? body : ""];
  }
  function parse6(element, { document: document2 }) {
    const cells = [];
    const thematicLink = element.querySelector('.thematic-image-container a[href], [data-component="ThematicVariant"] a[href]');
    const thematicImg = makeImg(document2, element.querySelector('.thematic-image-container img, [data-component="ThematicVariant"] img'));
    const activeTab = element.querySelector('.recs-tab.selected, [role="tab"][aria-selected="true"], [role="tab"].selected') || element.querySelector('.recs-tab, [role="tab"]');
    const tabLabel = ((activeTab == null ? void 0 : activeTab.getAttribute("aria-label")) || textOf2(activeTab)).trim();
    if (thematicImg || tabLabel) {
      const content = [];
      const h2 = document2.createElement("h2");
      h2.textContent = tabLabel || "Featured";
      content.push(h2);
      if (thematicLink) {
        const a = document2.createElement("a");
        a.href = absUrl5(thematicLink.getAttribute("href"));
        a.textContent = "Shop All";
        content.push(para(document2, a));
      }
      cells.push([thematicImg || "", content]);
    }
    const scope = element.querySelector(".thematic-carousel-container") || element;
    let cards = [...scope.querySelectorAll('[data-component="ProductCard"]')];
    if (!cards.length) cards = [...scope.querySelectorAll('[class*="ProductCardstyles__WrapperComponent"]')];
    if (!cards.length) cards = [...scope.querySelectorAll(".product-card")];
    cards.forEach((card) => {
      const row = buildProductRow(card, document2);
      if (row) cells.push(row);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-thematic", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function absUrl6(href) {
    if (!href) return "";
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) return `https://www.lowes.com${href}`;
    return href;
  }
  function mobileImage4(srcImg, desktopSrc, document2) {
    var _a;
    const sources = ((_a = srcImg == null ? void 0 : srcImg.closest("picture")) == null ? void 0 : _a.querySelectorAll("source[media][srcset]")) || [];
    const source = [...sources].find((s) => {
      const media = s.getAttribute("media") || "";
      return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
    });
    const url = source ? absUrl6(source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0]) : "";
    if (!url || url === desktopSrc) return null;
    const img = document2.createElement("img");
    img.src = url;
    img.alt = (srcImg.getAttribute("alt") || "").trim();
    return img;
  }
  function textOf3(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function deriveLabel(col, alt, href) {
    const heading = textOf3(col.querySelector("h1, h2, h3, h4, h5, h6"));
    if (heading) return heading;
    const m = (alt || "").match(/^shop\s+(.+?)\s+now\.?$/i);
    if (m) return m[1];
    try {
      const parts = new URL(href, "https://www.lowes.com").pathname.split("/").filter(Boolean);
      const slug = parts.find((p, i) => i > 0 && !/^\d+$/.test(p)) || parts[parts.length - 1];
      if (slug) {
        return decodeURIComponent(slug).replace(/[-_]+/g, " ").replace(/\b([a-z])/g, (c) => c.toUpperCase());
      }
    } catch (e) {
    }
    return (alt || "").replace(/\s*shop now\.?$/i, "").trim();
  }
  function parse7(element, { document: document2 }) {
    let cols = [...element.querySelectorAll(':scope > div.col, :scope > div[class*="ColumnWrapper"]')];
    if (!cols.length) cols = [...element.querySelectorAll(":scope > div")];
    const cells = [];
    cols.forEach((col) => {
      const srcImg = col.querySelector("img");
      const anchor = col.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]') || (srcImg == null ? void 0 : srcImg.closest("a[href]")) || col.querySelector("a[href]");
      if (!srcImg && !anchor) return;
      let imageCell = "";
      const alt = ((srcImg == null ? void 0 : srcImg.getAttribute("alt")) || "").trim();
      const src = (srcImg == null ? void 0 : srcImg.getAttribute("src")) || (srcImg == null ? void 0 : srcImg.getAttribute("data-src"));
      if (src) {
        const img = document2.createElement("img");
        img.src = absUrl6(src);
        img.alt = alt;
        const mobileImg = mobileImage4(srcImg, absUrl6(src), document2);
        imageCell = mobileImg ? [img, mobileImg] : img;
      }
      let linkCell = "";
      if (anchor) {
        const href = absUrl6(anchor.getAttribute("href"));
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = textOf3(anchor) || deriveLabel(col, alt, href) || "Shop Now";
        linkCell = a;
      }
      cells.push([imageCell, linkCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-department.js
  function absUrl7(href) {
    if (!href) return "";
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) return `https://www.lowes.com${href}`;
    return href;
  }
  function textOf4(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanLabel(raw) {
    const label = (raw || "").trim().replace(/^shop\s+/i, "").replace(/\.$/, "").replace(/\s+now$/i, "").replace(/\s+products$/i, "").trim();
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  function parse8(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll('div[class*="FeatureTilesGridColumn"]')];
    if (!tiles.length) tiles = [...element.querySelectorAll(".row > div")];
    if (!tiles.length) {
      tiles = [...element.querySelectorAll("a[href]")].map((a) => a.parentElement).filter((p, i, arr) => arr.indexOf(p) === i);
    }
    const cells = [];
    tiles.forEach((tile) => {
      const anchor = tile.querySelector('a[class*="FeatureTilesLink"][href]') || tile.querySelector("a[href]");
      const srcImg = tile.querySelector("img");
      if (!anchor && !srcImg) return;
      let imageCell = "";
      const src = (srcImg == null ? void 0 : srcImg.getAttribute("src")) || (srcImg == null ? void 0 : srcImg.getAttribute("data-src"));
      const alt = ((srcImg == null ? void 0 : srcImg.getAttribute("alt")) || (srcImg == null ? void 0 : srcImg.getAttribute("title")) || "").trim();
      if (src) {
        const img = document2.createElement("img");
        img.src = absUrl7(src);
        img.alt = alt;
        imageCell = img;
      }
      let linkCell = "";
      if (anchor) {
        const label = textOf4(anchor) || cleanLabel(anchor.getAttribute("data-testid")) || cleanLabel(alt) || cleanLabel(anchor.getAttribute("aria-label")) || cleanLabel(anchor.getAttribute("title"));
        const a = document2.createElement("a");
        a.href = absUrl7(anchor.getAttribute("href"));
        a.textContent = label || a.href;
        linkCell = a;
      }
      cells.push([imageCell, linkCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-department", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function absUrl8(href) {
    if (!href) return "";
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) return `https://www.lowes.com${href}`;
    return href;
  }
  function mobileImage5(srcImg, desktopSrc, document2) {
    var _a;
    const sources = ((_a = srcImg == null ? void 0 : srcImg.closest("picture")) == null ? void 0 : _a.querySelectorAll("source[media][srcset]")) || [];
    const source = [...sources].find((s) => {
      const media = s.getAttribute("media") || "";
      return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
    });
    const url = source ? absUrl8(source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0]) : "";
    if (!url || url === desktopSrc) return null;
    const img = document2.createElement("img");
    img.src = url;
    img.alt = (srcImg.getAttribute("alt") || "").trim();
    return img;
  }
  function textOf5(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function ctaLabel(alt) {
    const a = (alt || "").toLowerCase();
    if (/get started/.test(a)) return "Get Started";
    if (/schedule/.test(a)) return "Schedule Now";
    if (/shop/.test(a)) return "Shop Now";
    return "Learn More";
  }
  function parse9(element, { document: document2 }) {
    let items = [...element.querySelectorAll('[data-testid="playwright-unified-scaled-image"]')];
    if (!items.length) items = [...element.querySelectorAll('[class*="Wrapper-RC"]:has(> [class*="SubWrapper"])')];
    if (!items.length) {
      items = [...element.querySelectorAll("img")].map((img) => img.closest('[class*="ColumnWrapper"]') || img.parentElement);
    }
    const cells = [];
    items.forEach((item) => {
      const srcImg = item.querySelector("img");
      const anchor = item.querySelector('a.scaled-image-primary-link[href], a[class*="LinkWrapper"][href]') || (srcImg == null ? void 0 : srcImg.closest("a[href]")) || item.querySelector("a[href]");
      if (!srcImg && !anchor) return;
      let imageCell = "";
      const alt = ((srcImg == null ? void 0 : srcImg.getAttribute("alt")) || "").trim();
      const src = (srcImg == null ? void 0 : srcImg.getAttribute("src")) || (srcImg == null ? void 0 : srcImg.getAttribute("data-src"));
      if (src) {
        const img = document2.createElement("img");
        img.src = absUrl8(src);
        img.alt = alt;
        const mobileImg = mobileImage5(srcImg, absUrl8(src), document2);
        imageCell = mobileImg ? [img, mobileImg] : img;
      }
      const body = [];
      const title = textOf5(item.querySelector("h1, h2, h3, h4, h5, h6"));
      if (title) {
        const h3 = document2.createElement("h3");
        h3.textContent = title;
        body.push(h3);
      }
      item.querySelectorAll("p, ul, ol").forEach((el) => {
        if (!textOf5(el) || anchor && anchor.contains(el)) return;
        body.push(el.cloneNode(true));
      });
      if (anchor) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = absUrl8(anchor.getAttribute("href"));
        a.textContent = textOf5(anchor) || ctaLabel(alt);
        p.append(a);
        body.push(p);
      }
      cells.push([imageCell, body.length ? body : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-deals.js
  var ORIGIN3 = "https://www.lowes.com";
  function absUrl9(href) {
    if (!href) return "";
    const h = href.trim();
    if (!h || h.startsWith("#") || h.startsWith("javascript:")) return "";
    if (h.startsWith("//")) return `https:${h}`;
    if (h.startsWith("/")) return `${ORIGIN3}${h}`;
    if (/^https?:/i.test(h)) return h;
    return "";
  }
  function textOf6(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para2(document2, ...children) {
    const p = document2.createElement("p");
    children.forEach((c) => {
      if (c !== null && c !== void 0 && c !== "") p.append(c);
    });
    return p;
  }
  function link(document2, href, text) {
    const a = document2.createElement("a");
    a.href = href;
    a.textContent = text;
    return a;
  }
  function productName(tile) {
    const desc = tile.querySelector(
      '.productDescription, [class*="TwoProductCardstyles__Brand-"], [class*="BrandWrapper"] p, [class*="product-desc"]'
    );
    if (!desc) return "";
    const b = desc.querySelector("b, strong");
    const brand = textOf6(b).replace(/,\s*$/, "").trim();
    let rest = textOf6(desc);
    const bText = textOf6(b);
    if (bText && rest.startsWith(bText)) rest = rest.slice(bText.length).trim();
    return [brand, rest].filter(Boolean).join(" ");
  }
  function buildTile(tile, document2) {
    const out = [];
    const pdpAnchor = tile.querySelector('a.gauge-click[href], a[href*="/pd/"], a[href*="/configure/"]') || tile.querySelector("a[href]");
    const href = pdpAnchor ? absUrl9(pdpAnchor.getAttribute("href")) : "";
    const name = productName(tile);
    const srcImg = tile.querySelector("img.product-image, img");
    const src = srcImg ? (srcImg.getAttribute("src") || srcImg.getAttribute("data-src") || "").trim() : "";
    const imgSrc = absUrl9(src);
    if (!imgSrc) return out;
    const img = document2.createElement("img");
    img.src = imgSrc;
    img.alt = name;
    if (href) {
      const a = document2.createElement("a");
      a.href = href;
      if (name) a.title = name;
      a.append(img);
      out.push(para2(document2, a));
    } else {
      out.push(para2(document2, img));
    }
    const badge = [...tile.querySelectorAll('.badge-label, [data-testid="badge-container"]')].map(textOf6).find((t) => /^save\b|%\s*off/i.test(t));
    if (badge) out.push(para2(document2, badge));
    const desc = tile.querySelector(
      '.productDescription, [class*="TwoProductCardstyles__Brand-"], [class*="BrandWrapper"] p, [class*="product-desc"]'
    );
    if (desc) {
      const b = desc.querySelector("b, strong");
      const brandText = textOf6(b);
      let rest = textOf6(desc);
      if (brandText && rest.startsWith(brandText)) rest = rest.slice(brandText.length).trim();
      const p = document2.createElement("p");
      if (brandText) {
        const strong = document2.createElement("strong");
        strong.textContent = brandText;
        p.append(strong);
        if (rest) p.append(" ");
      }
      if (rest) p.append(rest);
      if (p.textContent.trim()) out.push(p);
    }
    const price = textOf6(tile.querySelector('.striker-final-price, [class*="final-price"]'));
    const was = textOf6(tile.querySelector('.striker-previous-price, [class*="previous-price"]'));
    const oos = textOf6(tile.querySelector('.oos-info, [class*="oos-info"]'));
    if (price) {
      const p = para2(document2, price);
      if (was && was !== price) {
        const del = document2.createElement("del");
        del.textContent = was;
        p.append(" ", del);
      }
      out.push(p);
    } else if (oos) {
      out.push(para2(document2, oos));
    }
    const ratingMatch = [...tile.querySelectorAll('[class*="RatingWrapper"][aria-label], span[aria-label], div[aria-label]')].map((el) => (el.getAttribute("aria-label") || "").trim().match(/^(\d+(?:\.\d+)?)\s*stars?$/i)).find(Boolean) || null;
    const count = textOf6(tile.querySelector('.rating-count, [class*="rating-count"]'));
    if (ratingMatch && count) out.push(para2(document2, `${ratingMatch[1]} stars (${count})`));
    else if (ratingMatch) out.push(para2(document2, `${ratingMatch[1]} stars`));
    else if (count) out.push(para2(document2, count));
    const atc = [...tile.querySelectorAll("button, a")].find((b) => /add to cart/i.test(textOf6(b)));
    if (atc && href) out.push(para2(document2, link(document2, href, "Add to Cart")));
    return out;
  }
  function findTiles(card) {
    let tiles = [...card.querySelectorAll('.box[data-testid^="product-test-card"], [class*="TwoProductCardstyles__ContainerItem"]')];
    if (!tiles.length) tiles = [...card.querySelectorAll('[class*="gridstyles__ContainerItem"], .column-wrapper')];
    return tiles.filter((t) => !tiles.some((o) => o !== t && o.contains(t)));
  }
  function parse10(element, { document: document2 }) {
    let cards = [...element.querySelectorAll('.carousel-item-custom, [data-testid="carouselTestId"]')];
    cards = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
    if (!cards.length) cards = [...element.querySelectorAll('[class*="parent-slot-"]')];
    const cells = [];
    cards.forEach((card) => {
      const title = textOf6(card.querySelector('#recs-card-title p, [class*="styles__Title"], #recs-card-title'));
      const viewAll = card.querySelector('a[data-testid="count-down-view-more-link"][href], a[class*="ViewMore"][href]');
      const viewHref = viewAll ? absUrl9(viewAll.getAttribute("href")) : "";
      const head = [];
      if (title) {
        const h3 = document2.createElement("h3");
        h3.textContent = title;
        head.push(h3);
      }
      if (viewHref) head.push(para2(document2, link(document2, viewHref, "View All")));
      const tileContent = [];
      findTiles(card).forEach((tile) => tileContent.push(...buildTile(tile, document2)));
      if (!head.length && !tileContent.length) return;
      cells.push([head.length ? head : "", tileContent.length ? tileContent : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-deals", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  var ORIGIN4 = "https://www.lowes.com";
  function absUrl10(href) {
    if (!href) return "";
    const h = href.trim();
    if (h.startsWith("//")) return `https:${h}`;
    if (h.startsWith("/")) return `${ORIGIN4}${h}`;
    return h;
  }
  function textOf7(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function makeImg2(document2, srcImg) {
    if (!srcImg) return null;
    const src = srcImg.getAttribute("src") || srcImg.getAttribute("data-src");
    if (!src || src.startsWith("data:")) return null;
    const img = document2.createElement("img");
    img.src = absUrl10(src);
    img.alt = (srcImg.getAttribute("alt") || "").trim();
    return img;
  }
  function para3(document2, ...children) {
    const p = document2.createElement("p");
    children.forEach((c) => {
      if (c) p.append(c);
    });
    return p;
  }
  function link2(document2, href, text) {
    const a = document2.createElement("a");
    a.href = href;
    a.textContent = text;
    return a;
  }
  function buildCardRow(card, document2) {
    const pdp = card.querySelector('a[href*="/pd/"], a.article-link[href]') || card.querySelector("a[href]");
    const href = pdp ? absUrl10(pdp.getAttribute("href")) : "";
    const img = makeImg2(document2, card.querySelector('picture img, [class*="image-container"] img, img'));
    const body = [];
    const brand = textOf7(card.querySelector('.brand-name, [class*="brand-name"]'));
    const desc = textOf7(card.querySelector('.product-desc, [class*="product-desc"], .article-name, [class*="article-name"]'));
    const titleText = desc || (img ? img.alt : "");
    if (brand || titleText) {
      const p = document2.createElement("p");
      if (brand) {
        const strong = document2.createElement("strong");
        strong.textContent = brand;
        p.append(strong);
        if (titleText) p.append(" ");
      }
      if (titleText) p.append(href ? link2(document2, href, titleText) : titleText);
      body.push(p);
    }
    const articleDesc = textOf7(card.querySelector(".article-desc"));
    if (articleDesc) body.push(para3(document2, articleDesc));
    const priceEl = card.querySelector('.recs-final-price, [class*="RegularPrice"], [class*="final-price"]');
    const price = priceEl ? priceEl.textContent.replace(/\s+/g, "") : "";
    if (/\$\d/.test(price)) body.push(para3(document2, price));
    const was = textOf7(card.querySelector('.recs-strickthrough-price, [class*="Strikethrough"]'));
    const save = textOf7(card.querySelector('.recs-price-block-message, [class*="price-block-message"]'));
    if (was || save) {
      const p = document2.createElement("p");
      if (was) {
        const del = document2.createElement("del");
        del.textContent = was;
        p.append(del);
        if (save) p.append(" ");
      }
      if (save) p.append(save);
      body.push(p);
    }
    const promo = textOf7(card.querySelector('[data-component="PromoMessage"], [class*="PromoMessage"]'));
    if (promo) body.push(para3(document2, promo));
    const ratingEl = card.querySelector('[role="img"][aria-label*="Star" i], .rating, [class*="RatingWrapper"]');
    const count = textOf7(card.querySelector('.rating-count, [class*="rating-count"]')).replace(/[()]/g, "");
    let rating = "";
    const m = ((ratingEl == null ? void 0 : ratingEl.getAttribute("aria-label")) || "").match(/(\d(?:\.\d+)?)/);
    if (m) rating = m[1];
    else if (ratingEl) {
      const filled = ratingEl.querySelectorAll(".rating-icon.filled").length;
      if (filled) rating = String(Math.min(5, filled));
    }
    if (rating) body.push(para3(document2, `${rating} out of 5 stars${count ? ` (${count} reviews)` : ""}`));
    const social = textOf7(card.querySelector('.social-proofing-badge-label, [class*="social-proof"]'));
    if (social) body.push(para3(document2, social));
    const atc = card.querySelector('[data-component="AddToCart"], [class*="AddToCart"], .atc-button');
    if (atc && href) body.push(para3(document2, link2(document2, href, "Add to Cart")));
    if (!img && !body.length) return null;
    return [img || "", body.length ? body : ""];
  }
  function parse11(element, { document: document2 }) {
    var _a, _b;
    const cells = [];
    const titleEl = element.querySelector('.recs-carousel-title, [class*="carousel-title"]:is(h1, h2, h3, h4, h5, h6)') || element.querySelector("h1, h2, h3, h4, h5, h6");
    const title = textOf7(titleEl) || ((titleEl == null ? void 0 : titleEl.getAttribute("aria-label")) || "").trim();
    if (title) {
      const heading = [];
      const h3 = document2.createElement("h3");
      h3.textContent = title;
      heading.push(h3);
      const helper = textOf7(element.querySelector('.recs-carousel-title-wrapper .helper-text, [class*="Titlestyles"] .helper-text'));
      if (helper) heading.push(para3(document2, helper));
      const titleWrap = (titleEl == null ? void 0 : titleEl.closest(".recs-carousel-title-wrapper")) || (titleEl == null ? void 0 : titleEl.parentElement);
      if (titleWrap) {
        [...titleWrap.querySelectorAll(":scope > p > a[href], .recs-carousel-title-cta a[href]")].forEach((a) => {
          const text = textOf7(a);
          if (text) heading.push(para3(document2, link2(document2, absUrl10(a.getAttribute("href")), text)));
        });
      }
      cells.push([heading, ""]);
    }
    const slot = (element.id || ((_a = element.querySelector(".mfe-app[data-testid]")) == null ? void 0 : _a.getAttribute("data-testid")) || ((_b = element.querySelector('[id^="lws_hp_recommendations"]')) == null ? void 0 : _b.id) || "").trim();
    if (/^[a-z0-9]+(?:[_-][a-z0-9]+)+$/i.test(slot)) cells.push(["slot", slot]);
    const pillLabels = [];
    element.querySelectorAll('button[class*="PillButtonstyles__ButtonWrapper"], [data-component="PillButton"], .recs-pill-button').forEach((btn) => {
      const label = textOf7(btn.querySelector("p")) || textOf7(btn) || (btn.getAttribute("aria-label") || "").replace(/\s*filter option.*$/i, "").trim();
      if (label && !pillLabels.includes(label)) pillLabels.push(label);
    });
    if (pillLabels.length) {
      const ul = document2.createElement("ul");
      pillLabels.forEach((label) => {
        const li = document2.createElement("li");
        li.textContent = label;
        ul.append(li);
      });
      cells.push(["pills", ul]);
    }
    let cards = [...element.querySelectorAll('[data-component="ProductCard"], [data-component="NPCContentCard"]')];
    if (!cards.length) {
      cards = [...element.querySelectorAll('[class*="ProductCardstyles__WrapperComponent"], [class*="NPCContentCardstyles__WrapperComponent"]')];
    }
    if (!cards.length) cards = [...element.querySelectorAll(".carousel-item .product-card")];
    if (!cards.length) cards = [...element.querySelectorAll(".carousel-item")];
    let productRows = 0;
    cards.forEach((card) => {
      const row = buildCardRow(card, document2);
      if (row) {
        cells.push(row);
        productRows += 1;
      }
    });
    if (!productRows && !title) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lowes-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var CHROME = [
    "#headerApp",
    'header[data-testid="full-mast-header"]',
    "header",
    "#footerApp",
    "footer",
    // Found: <div class="skip-content"><button class="skip-to-content">Skip to main content</button></div> (inside header)
    ".skip-content",
    // Found: <div class="baymax parbase section"><div class="baymax-exp" data-exp-id="bym-global-selector"></div></div>
    ".baymax"
  ];
  var OVERLAYS = [
    // Found: <div id="sec-overlay" style="display:none;"><div id="sec-container"></div></div>
    "#sec-overlay",
    // Found: three <div id="overlay" class="... CartPreviewOverlay"> body-level overlays
    '[id="overlay"]',
    // Found: <div id="luca-app"><div class="... ChatInviteButton"> (Mylow chat)
    "#luca-app",
    '[class*="ChatInviteButton"]',
    // Found: <div id="cb-dialog-root"> (ScreenMeet co-browse dialog root)
    "#cb-dialog-root",
    // Found: <span id="vshb" class="vshb">
    "#vshb",
    // Found: empty ATC / personalization mount points
    "#npc-atc",
    "#home-atc",
    "#user-specific-content-false",
    // Found: <span id="kampyleButtonContainer"><button id="nebula_div_btn" alt="Feedback"> (Medallia feedback tab)
    "#kampyleButtonContainer"
  ];
  var JUNK = [
    // Found: <div class="styles__GAMWrapper-RC__..." data-testid="gam"><div id="gpt-1" class="gpt" style="display:none">
    '[data-testid="gam"]',
    '[class*="GAMWrapper-RC"]',
    ".gpt",
    // Found: tracking pixels at body level
    'img[src*="ojrq.net"]',
    'img[src*="analytics.yahoo.com"]',
    "img.ywa-10000",
    'img[src*="t.co/1/i/adsct"]',
    'img[src*="analytics.twitter.com"]',
    'img[src*="flashtalking.com"]',
    'img[src*="adsrvr.org"]',
    // Found (browser "Save Page As" source): pixels rewritten to the unsaved assets folder,
    // e.g. <img src="./Lowe’s Home Improvement_files/adsct" alt="">
    'picture:has(> img[src*="_files/"])',
    'img[src*="_files/"]',
    // Found: universal_pixel / doubleclick / pbbl / hidden iframes
    "iframe",
    // Found: <div class="styles__SkeletonWrapper-sc-1e8y019-0 ... weather-skeleton"> / project-skeleton
    '[class*="SkeletonWrapper"]'
  ];
  var ORIGIN5 = "https://www.lowes.com";
  function absUrl11(href) {
    const h = (href || "").trim();
    if (h.startsWith("//")) return `https:${h}`;
    if (h.startsWith("/")) return `${ORIGIN5}${h}`;
    return h;
  }
  function liftHeadingCtas(element, document2) {
    element.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
      const ctas = [...heading.querySelectorAll(".recs-carousel-title-cta")];
      if (!ctas.length) return;
      let anchor = heading;
      ctas.forEach((cta) => {
        [...cta.querySelectorAll("a[href]")].forEach((a) => {
          const text = a.textContent.replace(/\s+/g, " ").trim();
          if (!text) return;
          const link3 = document2.createElement("a");
          link3.href = absUrl11(a.getAttribute("href"));
          link3.textContent = text;
          const p = document2.createElement("p");
          p.append(link3);
          anchor.after(p);
          anchor = p;
        });
        cta.remove();
      });
    });
  }
  function restoreViewAllLinks(element, payload) {
    const headers = [...element.querySelectorAll('[data-testid="count-down-clock-with-title"]')];
    if (!headers.length || !payload || typeof payload.html !== "string") return;
    const hrefs = [...payload.html.matchAll(/<a\b[^>]*data-testid="count-down-view-more-link"[^>]*>/g)].map((m) => (m[0].match(/\shref="([^"]*)"/) || [])[1]).filter(Boolean).map((h) => h.replace(/&amp;/g, "&"));
    if (hrefs.length !== headers.length) return;
    headers.forEach((header, i) => {
      if (header.querySelector('a[data-testid="count-down-view-more-link"][href]')) return;
      const visible = header.querySelector('a[class*="ViewMore"]');
      if (visible) visible.setAttribute("href", absUrl11(hrefs[i]));
    });
  }
  function queryAll(root, selector) {
    try {
      return [...root.querySelectorAll(selector)];
    } catch (e) {
      return [];
    }
  }
  function addDefaultContentMobileImages(element, payload, document2) {
    const template = payload && payload.template;
    if (!template) return;
    const selectors = (template.sections || []).flatMap((s) => s.defaultContent || []);
    const blockEls = (template.blocks || []).flatMap((b) => b.instances || []).flatMap((sel) => queryAll(element, sel));
    const done = /* @__PURE__ */ new Set();
    selectors.flatMap((sel) => queryAll(element, sel)).forEach((match) => {
      const pictures = match.matches("picture") ? [match] : [...match.querySelectorAll("picture")];
      pictures.forEach((picture) => {
        if (done.has(picture) || blockEls.some((b) => b.contains(picture))) return;
        done.add(picture);
        const img = picture.querySelector("img");
        const source = [...picture.querySelectorAll("source[media][srcset]")].find((s) => {
          const media = s.getAttribute("media") || "";
          return /max-width:\s*35\.9375rem/.test(media) && !/min-width/.test(media);
        });
        if (!img || !source) return;
        const url = absUrl11(source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0]);
        if (!url || url === absUrl11(img.getAttribute("src") || img.getAttribute("data-src"))) return;
        const mobile = document2.createElement("img");
        mobile.setAttribute("src", url);
        mobile.setAttribute("alt", (img.getAttribute("alt") || "").trim());
        picture.replaceWith(img, mobile);
      });
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      restoreViewAllLinks(element, payload);
      WebImporter.DOMUtils.remove(element, [...CHROME, ...OVERLAYS, ...JUNK]);
      liftHeadingCtas(element, payload.document || element.ownerDocument);
      addDefaultContentMobileImages(element, payload, payload.document || element.ownerDocument);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ...CHROME,
        ...OVERLAYS,
        ...JUNK,
        "link",
        "style",
        "script",
        "noscript"
      ]);
      element.querySelectorAll("[onclick], [data-linkid], [data-tracking]").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-linkid");
        el.removeAttribute("data-tracking");
      });
    }
  }

  // tools/importer/transformers/lowes-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      let el = null;
      try {
        el = root.querySelector(sel);
      } catch (e) {
        el = null;
      }
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        if (!sectionEl.textContent.trim() && !sectionEl.querySelector("img, picture")) continue;
        const doc = element.ownerDocument || document;
        const hr = doc.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker;
        if (!anchor) continue;
        const doc = element.ownerDocument || document;
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "carousel-pills": parse,
    "carousel-hero": parse2,
    "cards-promo": parse3,
    "columns-promo": parse4,
    "widget-weather": parse5,
    "carousel-thematic": parse6,
    "cards-category": parse7,
    "cards-department": parse8,
    "cards-article": parse9,
    "carousel-deals": parse10,
    "carousel-product": parse11
  };
  var PAGE_TEMPLATE = {
    "name": "home",
    "description": "Lowe's homepage: recommendation pills, sponsored banner, hero carousel, promo tiles/banners, weather widget, thematic product carousel, category/department/article cards, personalized product carousels",
    "urls": [
      "https://www.lowes.com/"
    ],
    "blocks": [
      {
        "name": "carousel-pills",
        "instances": [
          '[id^="lws_hp_recommendations_aboveimage"] .pill-carousel'
        ]
      },
      {
        "name": "carousel-hero",
        "instances": [
          '[data-testid="playwright-hero-cyclic-carousel-v2"]',
          'div[class*="HeroBannerContainer-RC"]:not([data-testid])'
        ]
      },
      {
        "name": "cards-promo",
        "instances": [
          'div[class*="RowWrapper-RC"]:has(> [class~="d-span-2.4"])'
        ]
      },
      {
        "name": "columns-promo",
        "instances": [
          'div[class*="RowWrapper-RC"]:has(> [class~="d-span-8"]):has(> [class~="d-span-4"])'
        ]
      },
      {
        "name": "widget-weather",
        "instances": [
          'div[class*="WeatherWidgetSlimstyles__WeatherForeCastWrapper"]'
        ]
      },
      {
        "name": "carousel-thematic",
        "instances": [
          '[data-component="ThematicV2"]',
          'div[class*="Thematicstyles__WrapperComponent"]:not([data-component])'
        ]
      },
      {
        "name": "cards-category",
        "instances": [
          '[data-testid="playwright-column-control"] div.row',
          'div.row[class*="RowWrapper-RC"]:has(> div.col.md-3):not([data-testid="playwright-column-control"] div.row)'
        ]
      },
      {
        "name": "cards-department",
        "instances": [
          'div[class*="FeatureTilesWrapper-RC"]'
        ]
      },
      {
        "name": "cards-article",
        "instances": [
          'div[class*="ContentInnerWrapper-RC"] > div[class*="RowWrapper-RC"]:has(div[class*="GridWrapper-RC"])'
        ]
      },
      {
        "name": "carousel-deals",
        "instances": [
          ".dynamic-cards-wrapper-container"
        ]
      },
      {
        "name": "carousel-product",
        "instances": [
          '[id^="lws_hp_recommendations_belowimage_0"]',
          '[id^="lws_hp_recommendations_belowimage_1"]'
        ]
      }
    ],
    "sections": [
      {
        "id": "1",
        "name": "Recommended searches pill strip",
        "selector": [
          '#app > div > div > div:has([id^="lws_hp_recommendations_aboveimage"] .pill-carousel)'
        ],
        "style": "recommended-searches",
        "blocks": [
          "carousel-pills"
        ],
        "defaultContent": [
          '[id^="lws_hp_recommendations_aboveimage"] .recs-carousel-title-wrapper'
        ]
      },
      {
        "id": "2",
        "name": "Sponsored brand banner (DEWALT Days)",
        "selector": [
          '#app > div > div > [data-testid="playwright-unified-scaled-image"]',
          "#app > div > div > div:has(> div > a.scaled-image-primary-link)"
        ],
        "style": "sponsored-banner",
        "blocks": [],
        "defaultContent": [
          "#app > div > div > div > div > a.scaled-image-primary-link"
        ]
      },
      {
        "id": "3",
        "name": "Hero area: static rewards tile + rotating hero carousel",
        "selector": [
          '[data-testid="playwright-unified-column-control"]:has([data-testid="playwright-hero-cyclic-carousel-v2"])',
          'div[class*="GridWrapper-RC"]:has(div[class*="HeroBannerContainer-RC"])'
        ],
        "style": "hero-split",
        "blocks": [
          "carousel-hero"
        ],
        "defaultContent": [
          'div[class*="GridWrapper-RC"]:has(div[class*="HeroBannerContainer-RC"]) [class~="d-span-3"] a.scaled-image-primary-link'
        ]
      },
      {
        "id": "4",
        "name": "Five-up promo deal tiles",
        "selector": [
          'div[class*="GridWrapper-RC"]:has([class~="d-span-2.4"])'
        ],
        "style": null,
        "blocks": [
          "cards-promo"
        ],
        "defaultContent": []
      },
      {
        "id": "5",
        "name": "Home Improvement Projects Made Easy (two promo banners)",
        "selector": [
          'div[class*="GridWrapper-RC"]:has([class~="d-span-8"]):has([class~="d-span-4"])'
        ],
        "style": null,
        "blocks": [
          "columns-promo"
        ],
        "defaultContent": [
          'div[class*="GridWrapper-RC"]:has([class~="d-span-8"]):has([class~="d-span-4"]) .column-control-title h2'
        ]
      },
      {
        "id": "6",
        "name": "Weather / plan-your-day widget",
        "selector": [
          'div[class*="WeatherWidgetSlimstyles__Wrapper"]'
        ],
        "style": null,
        "blocks": [
          "widget-weather"
        ],
        "defaultContent": [
          'div[class*="WeatherWidgetSlimstyles__Wrapper"] > h3'
        ]
      },
      {
        "id": "7",
        "name": "Tabbed thematic product carousel (Gift Zone / Top Deals)",
        "selector": [
          '#app > div > div > div:has([data-testid="thematic_carousel"])',
          '#app > div > div > div:has(div[class*="Thematicstyles__WrapperComponent"])'
        ],
        "style": null,
        "blocks": [
          "carousel-thematic"
        ],
        "defaultContent": []
      },
      {
        "id": "8",
        "name": "Popular Categories banner tiles",
        "selector": [
          '[data-testid="playwright-column-control"]',
          'div[class*="GridWrapper-RC"]:has(div.row > div.col.md-3)'
        ],
        "style": null,
        "blocks": [
          "cards-category"
        ],
        "defaultContent": [
          'div[class*="GridWrapper-RC"]:has(div.row > div.col.md-3) .column-control-title h2'
        ]
      },
      {
        "id": "9",
        "name": "Shop-by-department icon tiles",
        "selector": [
          'div[class*="FeatureTilesWrapper-RC"]'
        ],
        "style": null,
        "blocks": [
          "cards-department"
        ],
        "defaultContent": []
      },
      {
        "id": "10",
        "name": "Explore More for Your Home & Community (article / how-to cards)",
        "selector": [
          'div[class*="GridWrapper-RC"]:has(div[class*="GridWrapper-RC"])'
        ],
        "style": null,
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          'div[class*="GridWrapper-RC"]:has(div[class*="GridWrapper-RC"]) > div > .column-control-title h2'
        ]
      },
      {
        "id": "14",
        "name": "Deals quadrant carousel (Top Trending Deals / 4 Stars & Above / We Picked These Deals for You)",
        "selector": [
          ".dynamic-cards-wrapper-container"
        ],
        "style": null,
        "blocks": [
          "carousel-deals"
        ],
        "defaultContent": []
      },
      {
        "id": "11",
        "name": "Personalized product recommendation carousel (below-image 0)",
        "selector": [
          '#app > div > div > div:has([id^="lws_hp_recommendations_belowimage_0"])'
        ],
        "style": null,
        "blocks": [
          "carousel-product"
        ],
        "defaultContent": []
      },
      {
        "id": "12",
        "name": "Personalized multi-product recommendations with filter pills (below-image 1)",
        "selector": [
          '#app > div > div > div:has([id^="lws_hp_recommendations_belowimage_1"])'
        ],
        "style": null,
        "blocks": [
          "carousel-product"
        ],
        "defaultContent": []
      },
      {
        "id": "13",
        "name": "Text-messaging sign-up offer toast",
        "selector": [
          '[data-testid="playwright-sms-opt-in-modal"]',
          "#app > div > div > div:has(.sms-modal-content)"
        ],
        "style": "toast",
        "blocks": [],
        "defaultContent": [
          ".sms-modal-text"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        let elements = [];
        try {
          elements = document2.querySelectorAll(selector);
        } catch (e) {
          console.warn(`Block "${blockDef.name}" selector invalid: ${selector}`);
        }
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
