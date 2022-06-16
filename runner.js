'use strict';

const fs = require('fs');
const { chromium } = require('playwright-chromium');

(async () => {
    const headlessMode = process.env.HEADLESS === 'false' ? false : true;
    const maxRetries = parseInt(process.env.MAXRETRIES) || 3;

    let urlParam = '';
    if (process.env.YEARMONTH != null) {
        process.env.YEARMONTH.match(/^\d{4}-\d{2}$/) || (() => { throw new Error('YEARMONTH must be in format : YYYY-mm (4 digits year, dash, 2 digits month).') })();

        const [year, month] = process.env.YEARMONTH.split('-');
        urlParam = `?t=${year}&b=${month}`;
    }

    const browser = await chromium.launch({
        headless: headlessMode,
    });

    // use https, but expecting errors
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();
    const url = 'https://www.imankatolik.or.id/kalender.php' + urlParam;

    const gotoWithRetry = async (page, url, retryCount = 3) => {
        if (retryCount < 0) {
            throw new Error(`Failed to open ${url} : max retries reached.`);
        }
        console.debug(`Attempted to open ${url} : ${retryCount} retry(s) left.`);

        // open link, no need to wait whole page to load
        await Promise.all([
            page.goto(url, {
                timeout: 30 * 1000,
                waitUntil: 'commit'
            }),
            page.waitForResponse((response) => response.ok(), { timeout: 6000 })
        ]).catch(() => {
            gotoWithRetry(page, url, maxRetries - 1);
        });
    };
    await gotoWithRetry(page, url, maxRetries);

    // inject our js scraper first
    await page.addScriptTag({ path: 'scraper/kalender.js' });

    // after table is seen, evaluate injected script on browser
    await page.waitForSelector('.k_tbl');
    let kalenderData = await page.evaluate(`scrapeKalender(document)`);

    if (!headlessMode) {
        console.info("Running headless mode, check out the browser.");
        await page.pause();
    }

    await browser.close();

    // save the file
    await fs.writeFile(`./${process.env.YEARMONTH}.json`, JSON.stringify(kalenderData, null, 4), (err) => {
        if (err) throw err;
        console.log(`Write to : ./${process.env.YEARMONTH}.json`);
    });

})();
