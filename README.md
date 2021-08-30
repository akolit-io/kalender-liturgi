# Kalender Liturgi
Serve __Kalender Liturgi__ from [imankatolik.or.id/kalender.php]() as static API by scraping from origin source and save to JSON format. Then you could use this for your web / app.


## Notice
It is always a good idea to re-confirm the actual content (readings, colors) with pastor-in-charge / liturgy division.

Please include credits to the origin ([imankatolik.or.id]()).


## Static API
__Kalender__ is automatically scraped every month, and available on this repo : [https://github.com/akolit-io/kalender-liturgi/tree/main/api/v1](). Note that latest `kalender.json` is symlink so it cannot be called directly, just query by the filename by format: `yyyy-mm.json`


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
- [imankatolik.or.id]()
