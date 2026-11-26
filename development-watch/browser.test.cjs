const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const status = JSON.parse(fs.readFileSync(path.join(root,'status.json'),'utf8'));
const milestones = JSON.parse(fs.readFileSync(path.join(root,'milestones.json'),'utf8'));
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const fallback = JSON.parse(html.match(/<script id="snapshot" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const source = 'https://raw.githubusercontent.com/tyrellp416-lang/RINGBOUND-Community/main/';
const reportUrl = source+'development-watch/reports.json';
const reportFeed = JSON.parse(fs.readFileSync(path.join(__dirname,'reports.json'),'utf8'));
const url = pathToFileURL(path.join(__dirname,'index.html')).href;
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:720}]) {
      const page = await browser.newPage({viewport});
      const errors = [];
      const unexpected = [];
      let mode = 'success';
      page.on('pageerror', e => errors.push(e.message));
      await page.route('**/*', async route => {
        const target = route.request().url();
        if (target.startsWith('file:')) return route.continue();
        if (target === reportUrl) return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(reportFeed)});
        if (![source+'status.json',source+'milestones.json'].includes(target)) {unexpected.push(target); return route.abort();}
        if (mode === 'offline') return route.abort();
        const isStatus = target.endsWith('status.json');
        let payload = isStatus ? structuredClone(status) : structuredClone(milestones);
        if (mode === 'unapproved' && !isStatus) payload.milestones.push({state:'complete',public_release_approved:false,name:'UNAPPROVED_MARKER'});
        if (mode === 'malformed' && isStatus) payload.timeline_forecast.release_announced = true;
        if (mode === 'stale' && isStatus) payload.updated_at = '2000-01-01';
        if (mode === 'injection' && isStatus) payload.areas[0].name = '<img src=x onerror=alert(1)>';
        return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(payload)});
      });
      const ready = async (expected) => {await page.waitForFunction(t => document.getElementById('sync').textContent.includes(t),expected); await page.waitForFunction(() => !document.getElementById('refresh').disabled);};
      const refresh = async (next, expected) => {mode=next;await page.locator('#refresh').click();await ready(expected);};
      await page.goto(url);
      await ready('Public feeds checked');
      await page.waitForFunction(()=>document.getElementById('reports-sync').textContent.includes('Public archive checked'));
      assert.ok((await page.locator('#report-list').textContent()).includes('No approved RINGSIDE editions'));
      const count = milestones.milestones.filter(m=>m.state==='complete'&&m.public_release_approved===true).length;
      assert.equal(await page.locator('#count').textContent(),String(count));
      assert.equal(await page.locator('#areas article').count(),status.areas.length);
      assert.equal(await page.locator('#timeline article').count(),4);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow at '+viewport.width);
      if (count) {
        const summary=page.locator('#records summary').first();
        await summary.focus();await page.keyboard.press('Enter');
        assert.equal(await page.locator('#records details').first().getAttribute('open'),'');
      }
      await refresh('unapproved','Public feeds checked');
      assert.equal(await page.locator('#count').textContent(),String(count));
      assert.ok(!(await page.locator('body').textContent()).includes('UNAPPROVED_MARKER'));
      await refresh('malformed','Last accepted public snapshot retained');
      assert.equal(await page.locator('#count').textContent(),String(count));
      await refresh('stale','Last accepted public snapshot retained');
      await refresh('offline','Last accepted public snapshot retained');
      assert.equal(await page.locator('#count').textContent(),String(count));
      await refresh('injection','Public feeds checked');
      assert.equal(await page.locator('#areas article h3').first().textContent(),'<img src=x onerror=alert(1)>');
      assert.equal(await page.locator('#areas img').count(),0);
      assert.deepEqual(errors,[]);
      assert.deepEqual(unexpected,[]);
      await page.close();
      const offline=await browser.newPage({viewport});
      await offline.route('https://raw.githubusercontent.com/**',route=>route.abort());
      await offline.goto(url);
      await offline.waitForFunction(()=>document.getElementById('sync').textContent.includes('Last accepted public snapshot retained'));
      assert.equal(await offline.locator('#count').textContent(),String(fallback.milestones.length));
      await offline.close();
      console.log('PASS: '+viewport.width+'px; rendering, keyboard details, approved-only filter, invalid/stale/offline fallback, text injection, request boundary, first-load fallback');
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
