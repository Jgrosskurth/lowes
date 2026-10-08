/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselPillsParser from './parsers/carousel-pills.js';
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsPromoParser from './parsers/cards-promo.js';
import columnsPromoParser from './parsers/columns-promo.js';
import widgetWeatherParser from './parsers/widget-weather.js';
import carouselThematicParser from './parsers/carousel-thematic.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsDepartmentParser from './parsers/cards-department.js';
import cardsArticleParser from './parsers/cards-article.js';
import carouselDealsParser from './parsers/carousel-deals.js';
import carouselProductParser from './parsers/carousel-product.js';

// TRANSFORMER IMPORTS (cleanup must run before sections)
import lowesCleanupTransformer from './transformers/lowes-cleanup.js';
import lowesSectionsTransformer from './transformers/lowes-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-pills': carouselPillsParser,
  'carousel-hero': carouselHeroParser,
  'cards-promo': cardsPromoParser,
  'columns-promo': columnsPromoParser,
  'widget-weather': widgetWeatherParser,
  'carousel-thematic': carouselThematicParser,
  'cards-category': cardsCategoryParser,
  'cards-department': cardsDepartmentParser,
  'cards-article': cardsArticleParser,
  'carousel-deals': carouselDealsParser,
  'carousel-product': carouselProductParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "home",
  "description": "Lowe's homepage: recommendation pills, sponsored banner, hero carousel, promo tiles/banners, weather widget, thematic product carousel, category/department/article cards, personalized product carousels",
  "urls": [
    "https://www.lowes.com/"
  ],
  "blocks": [
    {
      "name": "carousel-pills",
      "instances": [
        "[id^=\"lws_hp_recommendations_aboveimage\"] .pill-carousel"
      ]
    },
    {
      "name": "carousel-hero",
      "instances": [
        "[data-testid=\"playwright-hero-cyclic-carousel-v2\"]",
        "div[class*=\"HeroBannerContainer-RC\"]:not([data-testid])"
      ]
    },
    {
      "name": "cards-promo",
      "instances": [
        "div[class*=\"RowWrapper-RC\"]:has(> [class~=\"d-span-2.4\"])"
      ]
    },
    {
      "name": "columns-promo",
      "instances": [
        "div[class*=\"RowWrapper-RC\"]:has(> [class~=\"d-span-8\"]):has(> [class~=\"d-span-4\"])"
      ]
    },
    {
      "name": "widget-weather",
      "instances": [
        "div[class*=\"WeatherWidgetSlimstyles__WeatherForeCastWrapper\"]"
      ]
    },
    {
      "name": "carousel-thematic",
      "instances": [
        "[data-component=\"ThematicV2\"]",
        "div[class*=\"Thematicstyles__WrapperComponent\"]:not([data-component])"
      ]
    },
    {
      "name": "cards-category",
      "instances": [
        "[data-testid=\"playwright-column-control\"] div.row",
        "div.row[class*=\"RowWrapper-RC\"]:has(> div.col.md-3):not([data-testid=\"playwright-column-control\"] div.row)"
      ]
    },
    {
      "name": "cards-department",
      "instances": [
        "div[class*=\"FeatureTilesWrapper-RC\"]"
      ]
    },
    {
      "name": "cards-article",
      "instances": [
        "div[class*=\"ContentInnerWrapper-RC\"] > div[class*=\"RowWrapper-RC\"]:has(div[class*=\"GridWrapper-RC\"])"
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
        "[id^=\"lws_hp_recommendations_belowimage_0\"]",
        "[id^=\"lws_hp_recommendations_belowimage_1\"]"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Recommended searches pill strip",
      "selector": [
        "#app > div > div > div:has([id^=\"lws_hp_recommendations_aboveimage\"] .pill-carousel)"
      ],
      "style": "recommended-searches",
      "blocks": [
        "carousel-pills"
      ],
      "defaultContent": [
        "[id^=\"lws_hp_recommendations_aboveimage\"] .recs-carousel-title-wrapper"
      ]
    },
    {
      "id": "2",
      "name": "Sponsored brand banner (DEWALT Days)",
      "selector": [
        "#app > div > div > [data-testid=\"playwright-unified-scaled-image\"]",
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
        "[data-testid=\"playwright-unified-column-control\"]:has([data-testid=\"playwright-hero-cyclic-carousel-v2\"])",
        "div[class*=\"GridWrapper-RC\"]:has(div[class*=\"HeroBannerContainer-RC\"])"
      ],
      "style": "hero-split",
      "blocks": [
        "carousel-hero"
      ],
      "defaultContent": [
        "div[class*=\"GridWrapper-RC\"]:has(div[class*=\"HeroBannerContainer-RC\"]) [class~=\"d-span-3\"] a.scaled-image-primary-link"
      ]
    },
    {
      "id": "4",
      "name": "Five-up promo deal tiles",
      "selector": [
        "div[class*=\"GridWrapper-RC\"]:has([class~=\"d-span-2.4\"])"
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
        "div[class*=\"GridWrapper-RC\"]:has([class~=\"d-span-8\"]):has([class~=\"d-span-4\"])"
      ],
      "style": null,
      "blocks": [
        "columns-promo"
      ],
      "defaultContent": [
        "div[class*=\"GridWrapper-RC\"]:has([class~=\"d-span-8\"]):has([class~=\"d-span-4\"]) .column-control-title h2"
      ]
    },
    {
      "id": "6",
      "name": "Weather / plan-your-day widget",
      "selector": [
        "div[class*=\"WeatherWidgetSlimstyles__Wrapper\"]"
      ],
      "style": null,
      "blocks": [
        "widget-weather"
      ],
      "defaultContent": [
        "div[class*=\"WeatherWidgetSlimstyles__Wrapper\"] > h3"
      ]
    },
    {
      "id": "7",
      "name": "Tabbed thematic product carousel (Gift Zone / Top Deals)",
      "selector": [
        "#app > div > div > div:has([data-testid=\"thematic_carousel\"])",
        "#app > div > div > div:has(div[class*=\"Thematicstyles__WrapperComponent\"])"
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
        "[data-testid=\"playwright-column-control\"]",
        "div[class*=\"GridWrapper-RC\"]:has(div.row > div.col.md-3)"
      ],
      "style": null,
      "blocks": [
        "cards-category"
      ],
      "defaultContent": [
        "div[class*=\"GridWrapper-RC\"]:has(div.row > div.col.md-3) .column-control-title h2"
      ]
    },
    {
      "id": "9",
      "name": "Shop-by-department icon tiles",
      "selector": [
        "div[class*=\"FeatureTilesWrapper-RC\"]"
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
        "div[class*=\"GridWrapper-RC\"]:has(div[class*=\"GridWrapper-RC\"])"
      ],
      "style": null,
      "blocks": [
        "cards-article"
      ],
      "defaultContent": [
        "div[class*=\"GridWrapper-RC\"]:has(div[class*=\"GridWrapper-RC\"]) > div > .column-control-title h2"
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
        "#app > div > div > div:has([id^=\"lws_hp_recommendations_belowimage_0\"])"
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
        "#app > div > div > div:has([id^=\"lws_hp_recommendations_belowimage_1\"])"
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
        "[data-testid=\"playwright-sms-opt-in-modal\"]",
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

// TRANSFORMER REGISTRY
const transformers = [
  lowesCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [lowesSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements = [];
      try {
        elements = document.querySelectorAll(selector);
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
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Initial cleanup + section breaks
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Final cleanup + section metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root URL maps to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
