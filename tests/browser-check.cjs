const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = (process.env.SITE_URL || 'http://127.0.0.1:8765/oolong-travel/').replace(/\/?$/, '/');
const output = path.join(__dirname, '../test-results');

(async () => {
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE ? {executablePath:process.env.BROWSER_EXECUTABLE} : {})});
  try {
    const context = await browser.newContext({viewport:{width:390,height:844}, deviceScaleFactor:1, timezoneId:'Asia/Taipei', locale:'zh-TW', serviceWorkers:'allow'});
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => requests.push(request.url()));
    const seed = new URL('/cache-seed',base).href;
    await page.route(seed, route => route.fulfill({contentType:'text/html',body:'<!doctype html><title>cache test</title>'}));
    await page.goto(seed);
    await page.evaluate(async () => {
      await caches.open('unrelated-demo-v1');
      await caches.open('oolong-travel-v0');
    });
    await page.goto(base + '?today=2026-10-05');
    assert.equal(await page.locator('h1').innerText(), '烏龍出遊記');
    assert.equal(await page.locator('.trip').count(), 1);
    assert.equal(await page.locator('.trip-status').innerText(), '旅行回憶');
    assert.match(await page.locator('#next-trip').innerText(), /還沒決定/);
    assert.equal(await page.locator('.trip-link').getAttribute('href'), 'chiayi-2026-10/');
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    const cacheNames = await page.evaluate(() => caches.keys());
    assert(cacheNames.includes('unrelated-demo-v1'), '本站 activation 必須保留其他網站快取');
    assert(!cacheNames.includes('oolong-travel-v0'), '本站 activation 必須清除自己的舊快取');
    assert(cacheNames.includes('oolong-travel-v2'));
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).scope);
    assert.equal(scope, base);
    assert(await page.locator('.trip-photo img').evaluate(img => img.complete && img.naturalWidth > 0));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({path:path.join(output,'home-mobile.png'),fullPage:true});

    for (const [date,state,note] of [
      ['2026-10-02','即將出發','明天出發'],
      ['2026-10-03','出遊中','第 1 天'],
      ['2026-10-04','出遊中','第 2 天'],
      ['2026-10-05','旅行回憶','還沒決定']
    ]) {
      await page.goto(base + '?today=' + date);
      assert.equal(await page.locator('.trip-status').innerText(),state);
      assert((await page.locator('#next-trip').innerText()).includes(note));
    }
    const valid = await page.evaluate(() => [OolongHome.validDate('2026-02-30'),OolongHome.validDate('2028-02-29'),OolongHome.validDate('2026-2-3')]);
    assert.deepEqual(valid,[false,true,false]);
    await page.evaluate(() => {
      const original=OOLONG_TRIPS[0];
      const next={...original,slug:'test-trip',destination:'下一趟測試',start:'2026-11-10',end:'2026-11-10'};
      const later={...next,slug:'later-trip',destination:'更晚的測試',start:'2026-12-01',end:'2026-12-02'};
      OolongHome.render([later,original,next],'2026-10-05');
    });
    assert.equal(await page.locator('#trip-count').innerText(),'3 趟旅行');
    assert.match(await page.locator('.next-title').innerText(),/下一趟測試/);
    assert.equal(await page.locator('.next-title').getAttribute('href'),'test-trip/');
    assert.equal(await page.locator('.trip-date').nth(1).innerText(),'2026/11/10–11/10一日遊');
    await page.evaluate(() => OolongHome.render([],'2026-10-05'));
    assert.equal(await page.locator('.trip').count(),0);
    assert.match(await page.locator('#next-trip').innerText(),/還沒決定/);
    await page.goto(base + '?today=2026-10-05');
    await page.locator('.trip-link').click();
    await page.waitForURL(base + 'chiayi-2026-10/');
    assert.equal(await page.locator('#ledger .amt').count(),13);
    assert.equal(await page.locator('#moneytotal').innerText(),'3939');
    assert.equal(await page.locator('#ledger').getAttribute('data-settled'),'1');
    assert.equal(await page.locator('#ledger').getAttribute('data-people'),'霸子,瓦特,裝逼,拓也');
    assert.equal(await page.locator('#doops .stop').count(),9);
    assert.equal(await page.locator('#scores tr').count(),8);
    assert.match(await page.locator('#sharetext').innerText(),/984\.75/);
    await page.locator('.tab[data-d="money"]').click();
    assert(await page.locator('#dmoney').isVisible());
    assert(await page.locator('#settledbanner').isVisible());
    await page.locator('.tab[data-d="oops"]').click();
    assert(await page.locator('#doops').isVisible());
    await page.locator('.tab[data-d="2"]').click();
    assert(await page.locator('#d2').isVisible());
    await page.locator('.tab[data-d="1"]').click();
    await page.locator('.num[data-k]').first().click();
    assert.match(await page.locator('#cnt').innerText(),/^1 \/ /);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    assert(await page.locator('.hero img').evaluate(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({path:path.join(output,'chiayi-mobile.png'),fullPage:true});
    assert.equal(await page.locator('link[rel="manifest"]').getAttribute('href'),'../manifest.webmanifest');
    await page.locator('.journal-nav a').click();
    await page.waitForURL(base);

    const manifest = await page.evaluate(async () => (await fetch('manifest.webmanifest')).json());
    assert.equal(manifest.name,'烏龍出遊記');
    assert.equal(new URL(manifest.start_url,base).href,base);
    assert.equal(new URL(manifest.scope,base).href,base);
    const keys = await page.evaluate(async () => (await (await caches.open('oolong-travel-v2')).keys()).map(req=>req.url));
    assert(keys.includes(base + 'chiayi-2026-10/'));
    assert(keys.includes(base + 'chiayi-2026-10/settle.js'));
    assert(keys.includes(base + 'chiayi-2026-10/cover.jpg'));
    await context.setOffline(true);
    await page.goto(base + 'chiayi-2026-10/');
    assert.match(await page.locator('h1').innerText(),/嘉義火雞肉飯/);
    assert.equal(await page.locator('#moneytotal').innerText(),'3939');
    // 此 Chromium 的網路離線模擬不改 navigator.onLine；內容驗證仍使用真正停用的網路，提示另測 offline 事件。
    await page.evaluate(() => { Object.defineProperty(navigator,'onLine',{configurable:true,value:false}); window.dispatchEvent(new Event('offline')); });
    assert(await page.locator('#offline').isVisible());
    assert(await page.locator('.hero img').evaluate(img => img.complete && img.naturalWidth > 0));
    await page.goto(base);
    assert.equal(await page.locator('h1').innerText(),'烏龍出遊記');
    await page.evaluate(() => { Object.defineProperty(navigator,'onLine',{configurable:true,value:false}); window.dispatchEvent(new Event('offline')); });
    assert(await page.locator('#offline').isVisible());
    await page.goto(base + 'never-cached/');
    assert.equal(await page.locator('h1').innerText(),'這頁還沒存到手機');
    assert.equal(await page.locator('a').getAttribute('href'),base);
    await context.setOffline(false);

    await page.goto(base + '?today=2026-10-05');
    await page.setViewportSize({width:320,height:740});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.setViewportSize({width:1280,height:900});
    await page.screenshot({path:path.join(output,'home-desktop.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    assert(!requests.some(url => url.includes('waltwait.github.io/travel/') || url.includes('/Project/Travel/')));
    console.log('PASS: 日期、下一趟選擇、手機、嘉義原內容、分帳、圖片、manifest、子路徑、離線與快取隔離。');
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
