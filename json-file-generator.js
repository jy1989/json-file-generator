const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false,
        timeout: 0,
        //slowMo: 0 // slow down by 250ms
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 2000,
        height: 1080
    })

    const navigationPromise = page.waitForNavigation()
    await page.goto(`https://www.browserling.com/tools/random-json`, { waitUntil: 'networkidle2', timeout: 0 })
    await page.evaluate(() => {
        $('#random-json-depth').val("8")
    });
    try {
        let folderExist = await fs.exists('./json')
        if (!folderExist) {
            await fs.mkdir('./json')
        }

    } catch (e) {

    }
    for (var i = 0; i < 1000; i++) {
        await page.click('#random-json-submit')

        let result = await page.evaluate(() => {
            return $('#random-json-text').val()
        });
        console.log('saving', i+1)
        await fs.writeFileSync(`./json/${(i+1)}.json`, result)

    }


    console.log("done")
    await browser.close()
    




})();