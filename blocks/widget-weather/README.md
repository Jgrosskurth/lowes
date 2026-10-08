# widget-weather

Custom **widget** block. Purpose: local-weather-planner.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. All rows are optional:

| Row | Content |
| --- | --- |
| Config | A single cell with a link to `/widgets/weather/weather.html` (config via query params, e.g. `?layout=slim`). The link text must equal the href. If that runtime widget exists in the code base it replaces the static rendering. |
| Forecast | First row without an image, e.g. **Your Local Weather**. Rendered as the forecast panel (left third on desktop) with a runtime placeholder. Do not author temperatures, days or locations: the forecast is live, location-specific data. |
| Project ideas | One row per idea: cell 1 = image, cell 2 = title (heading) + link (e.g. "Read Article" / "Shop Now"). Rendered as a horizontally scrollable list of cards (right two-thirds on desktop). |

Without a forecast row a "Your Local Weather" placeholder panel is rendered.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
