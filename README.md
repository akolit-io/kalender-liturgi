# Kalender Liturgi
Serve __Kalender Liturgi__ from [https://imankatolik.or.id/kalender.php](https://imankatolik.or.id/kalender.php) as static API by scraping from origin source and save to JSON format. Then you could use this for your web / app.


## Notice
Please include credits to the origin ([https://imankatolik.or.id](https://imankatolik.or.id)).

It is always a good idea to re-confirm the actual content (readings, colors) with pastor-in-charge / liturgy division.


## Static API
To use the static API, [https://akolites.github.io/kalender-liturgi/api/v1/]() is strongly suggested as endpoint instead of [https://raw.githubusercontent.com/akolites/kalender-liturgi/main/api/v1/](), as the former was hosted on Github Pages, which is backed by CDN.

use `kalender.json` which is clone (hardlink) of the current month. if you need another month, use `yyyy-mm.json`.

the scraped json format is like this : 
```json
//v1
{
    date: Date;
    localDate: string;
    url: URL;
    name: string;
    dayColor: string;
    dayType: string;
    color: string;
    readings: {
        innerHTML: string; // recommended to use this for re-render on html
        links: {
            url: URL;
            text: string;
        }[]; // experimental, since the source format tends to change
    };
}
```


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
- [https://imankatolik.or.id](https://imankatolik.or.id)
