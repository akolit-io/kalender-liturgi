'use strict';

const fs = require('fs');
const { chromium } = require('playwright-chromium');

(async () => {
    const _HEADLESS = process.env.HEADLESS === 'true' ? true : false;

    let urlParam = '';
    if (process.env.YEARMONTH != null) {
        process.env.YEARMONTH.match(/^\d{4}-\d{2}$/) || (() => { throw new Error('YEARMONTH must be in format : YYYY-mm (4 digits year, dash, 2 digits month)') })();
        
        const [year, month] = process.env.YEARMONTH.split('-');
        urlParam = `?t=${year}&b=${month}`;
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
        console.info("Open your browser to see the process");
        await page.pause();
    }

    // close our browser
    await browser.close();
    // save the file
    await fs.writeFile(`./${process.env.YEARMONTH}.json`, JSON.stringify(kalenderData, null, 4), (err) => {
        if (err) throw err;
        console.log(`Data written to file ./${process.env.YEARMONTH}.json`);
    });

})();
