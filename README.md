# Kalender Liturgi
An unofficial static JSON API of '__Kalender Liturgi__' / Indonesian Liturgy Calendar.
Sourced by scraping from [https://imankatolik.or.id/kalender.php](https://imankatolik.or.id/kalender.php)


## Notice
Since this is unofficial, please take care of the usage, especially for non-ordinary day. Stable for the usage of the ordinary day.
In any way, it is always a good idea to re-confirm the date with pastor-in-charge / liturgy division.


## Usage
Example : 
`https://akolites.github.io/kalender-liturgi/api/v1/kalender.json`
`https://akolites.github.io/kalender-liturgi/api/v1/2022-02.json`

.json name could be either `kalender.json` (the current month) or year-month (YYYY-mm) format. Up until next month is available, and will be updated on month change. e.g.

it is strongly advised to use this endpoint, as this was hosted on Github Pages, backed by CDN:
`https://akolites.github.io/kalender-liturgi/api/v1/`
you could also use this:
`https://raw.githubusercontent.com/akolites/kalender-liturgi/main/api/v1/` 


## Static API Specs

v1

| Name | Type | Info |
| ------------- |:-------------:| -----:|
| `date` | Date | date in epoch time |
| `localDate` | string | date in Indonesian text |
| `url` | URL | link to the daily readings of the day |
| `name` | string | name of the feast |
| `dayType` | enum [ minggu hariRaya pesta biasa ] | type of the day |
| `dayColor` | string | color hex code of the day |
| `color` | enum [ merah merah/putih putih hijau ungu ... ] | displayed color of the day (subject to change) |
| `readings.innerHTML` | string | raw html content, use this for re-render on html |
| `readings.links.url` | URL | link to the bible readings on `imankatolik.or.id/alkitabq.php` |
| `readings.links.text` | string | the displayed readings text (subject to change) |

## How to
- Install : 
    - `make install`
    - to use existing browser and more options, visit [Playwright Documentation](playwright.dev)
- Development : 
    - `make develop`
    - (Chrome/Chromium) Right-click, `Inspect` / <kbd>F12</kbd> > `Source` > `Overrides` > `Select folder for overrides`
    - Add this folder to workspace, allow DevTools to add folder.
    - Check `Page` tab, then `top/(no domain)/` should point to the repo directory. Any change on DevTools will be live.
    - Try change on `scraper/kalender.js`, call function `scrapeKalender(document)` on `Console` tab
    - Continue play on 'Playwright Console' to stop.
- Action
    - `make action`
    - `HEADLESS=false  make action` to use open browser (need display system)
    - `YEAR=2021 MONTH=08  make action` to scrape August 2021 calendar


## Credits
- Credits to the origin ([https://imankatolik.or.id](https://imankatolik.or.id)).
