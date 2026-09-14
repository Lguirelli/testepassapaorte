import {spawn} from 'node:child_process';
import {chromium} from '@playwright/test';

const PORT=4180;
const ORIGIN=`http://127.0.0.1:${PORT}`;
const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1','--directory','github-pages'],{stdio:['ignore','pipe','pipe']});
let browser;

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitForServer(){
  for(let attempt=0;attempt<40;attempt++){
    try{const response=await fetch(`${ORIGIN}/`);if(response.ok)return;}catch{}
    await wait(250);
  }
  throw new Error('Static preview server did not become ready');
}
function assert(condition,message){if(!condition)throw new Error(message);}
async function open(page,hash){
  const errors=[];
  const onPageError=error=>errors.push(`pageerror: ${error.message}`);
  const onConsole=message=>{if(message.type()==='error')errors.push(`console: ${message.text()}`);};
  page.on('pageerror',onPageError);page.on('console',onConsole);
  const response=await page.goto(`${ORIGIN}/${hash}`,{waitUntil:'networkidle'});
  assert(response?.ok(),`HTTP failure for ${hash}`);
  await page.waitForTimeout(120);
  assert(errors.length===0,`${hash} emitted browser errors: ${errors.join(' | ')}`);
  page.off('pageerror',onPageError);page.off('console',onConsole);
}

try{
  await waitForServer();
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1371,height:936},reducedMotion:'no-preference'});
  const page=await context.newPage();

  await open(page,'#/');
  assert(await page.locator('[data-current-home="true"]').count()===1,'Current static home did not become the canonical rendered home');
  assert(await page.locator('h1').count()===1,'Static home must expose exactly one h1');
  assert(await page.getByRole('link',{name:/Início/i}).count()>=1,'Home navigation is missing');
  assert(await page.getByRole('link',{name:/Roteiros/i}).count()>=1,'Ready-routes navigation is missing');
  assert(await page.getByRole('tab').count()===6,'Static home must expose the six ready-route tabs');

  const tabs=page.getByRole('tab');
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  assert(await tabs.nth(1).getAttribute('aria-selected')==='true','Ready-route tabs do not respond to keyboard arrows');

  const gallery=page.locator('[data-current-gallery]');
  assert(await gallery.count()===1,'Partner gallery is missing');
  await gallery.focus();
  const before=await gallery.locator('[data-gallery-index]').evaluateAll(cards=>cards.map(card=>card.getAttribute('style')).join('|'));
  await page.keyboard.press('ArrowRight');
  const after=await gallery.locator('[data-gallery-index]').evaluateAll(cards=>cards.map(card=>card.getAttribute('style')).join('|'));
  assert(before!==after,'Partner gallery did not move from keyboard input');

  await open(page,'#/roteiros');
  assert(await page.locator('h1').count()===1,'Ready-routes library must expose exactly one h1');
  assert(await page.locator('a[href^="#/roteiros/"]').count()===6,'Static ready-routes library must expose six routes');

  await open(page,'#/roteiros/fim-de-semana-a-dois');
  assert(await page.getByRole('heading',{name:/Dois dias para aproveitar sem pressa/i}).count()===1,'Ready-route detail did not render the expected preset');
  assert(await page.getByRole('link',{name:/Usar este roteiro/i}).count()===1,'Ready-route detail is missing its primary action');

  await page.setViewportSize({width:390,height:844});
  await open(page,'#/');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert(overflow<=2,`Static mobile home overflows horizontally by ${overflow}px`);

  const reduced=await browser.newContext({viewport:{width:887,height:700},reducedMotion:'reduce'});
  const reducedPage=await reduced.newPage();
  await open(reducedPage,'#/');
  assert(await reducedPage.locator('[data-current-warp]').count()===1,'Reduced-motion home lost its hero title');
  await reduced.close();

  console.log(JSON.stringify({status:'PASS',surface:'github-pages',checks:['canonical-home','navigation','six-ready-routes','keyboard-tabs','gallery-keyboard','route-detail','mobile-overflow','reduced-motion']},null,2));
} finally {
  await browser?.close().catch(()=>{});
  server.kill('SIGTERM');
}
