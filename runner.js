'use strict';

const fs = require('fs');
const { chromium } = require('playwright-chromium');

(async () => {
    const _HEADLESS = process.env.HEADLESS === 'true' ? true : false;

    let urlParam = '';
    if (process.env.YEAR != null) {
        process.env.YEAR.match(/^\d{4}$/) || (() => { throw new Error('YEAR must be 4 digits') })();
    }

    if (process.env.MONTH != null) {
        process.env.MONTH.match(/^\d{1,2}$/) || (() => { throw new Error('MONTH must be 2 digits') })();

        urlParam = `?b=${process.env.MONTH}&t=${process.env.YEAR}`
    }

    const browser = await chromium.launch({
        headless: _HEADLESS, // so we can see what happen
    });

    const context = await browser.newContext({
        ignoreHTTPSErrors: true, // use https, better secure than nothing
    });

    // open link, no need to wait whole page to load. we only care about calendar table
    const page = await context.newPage();
    await page.goto('https://www.imankatolik.or.id/kalender.php' + urlParam);
    await page.addScriptTag({ path: 'scraper/kalender.js' }); // as devtools point too
    await page.waitForSelector('.k_tbl');

    // inject our js scraper and call from browser
    let kalenderData = await page.evaluate(`scrapeKalender(document)`);

    if (!_HEADLESS) {
        await page.pause();
    }

    // close our browser
    await browser.close();
    // save the file
    await fs.writeFile('./kalender.temp.json', JSON.stringify(kalenderData, null, 4), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });

})();
