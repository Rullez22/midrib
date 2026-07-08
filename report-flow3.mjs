import { chromium } from 'playwright-core';
const EXE='/Users/shavkat/Library/Caches/ms-playwright/chromium-1228/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const b = await chromium.launch({ executablePath: EXE });
const pg = await b.newPage({ viewport: { width: 1440, height: 1200 } });
const errs = [];
pg.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
pg.on('pageerror', e => errs.push('PAGEERR: '+e.message));
const shot = (n)=>pg.screenshot({path:n,fullPage:true});

await pg.goto('http://localhost:3000/cabinet/report', {waitUntil:'networkidle'});
await pg.getByRole('button',{name:'Выбрать период'}).first().click();
await pg.waitForTimeout(300);
const popover = pg.locator('.shadow-lg');
await popover.getByRole('button',{name:'11',exact:true}).click();
await pg.waitForTimeout(120);
await popover.getByRole('button',{name:'24',exact:true}).click();
await pg.waitForTimeout(300);
await pg.getByRole('button',{name:'Создать отчет'}).click();
await pg.waitForTimeout(400);

// X close -> /cabinet (client-side, preserves state)
await pg.getByRole('button',{name:'Закрыть'}).click();
await pg.waitForTimeout(500);
console.log('after close url:', pg.url());
// click sidebar voting nav
const votingNav = pg.locator('text=Голосования').first();
console.log('voting nav visible:', await votingNav.isVisible().catch(()=>false));
await votingNav.click();
await pg.waitForTimeout(600);
console.log('after voting url:', pg.url());
await shot('rr7-voting-list.png');

await pg.locator('text=Финансовый отчет для совета').first().click();
await pg.waitForTimeout(400);
await pg.getByRole('button',{name:'Подробнее'}).first().click().catch(()=>{});
await pg.waitForTimeout(500);
await shot('rr8-vote-detail.png');
await pg.getByRole('button',{name:'За',exact:true}).click();
await pg.waitForTimeout(400);
await shot('rr9-voted.png');
console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
await b.close();
