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
  const badResponses=[];
  const onPageError=error=>errors.push(`pageerror: ${error.message}`);
  const onConsole=message=>{
    if(message.type()==='error'&&!message.text().includes('Failed to load resource'))errors.push(`console: ${message.text()}`);
  };
  const onResponse=response=>{
    if(response.status()>=400){
      const url=new URL(response.url());
      badResponses.push(`HTTP ${response.status()} ${url.pathname}${url.search}`);
    }
  };
  page.on('pageerror',onPageError);page.on('console',onConsole);page.on('response',onResponse);
  const response=await page.goto(`${ORIGIN}/${hash}`,{waitUntil:'networkidle'});
  assert(response?.ok(),`HTTP failure for ${hash}`);
  await page.waitForTimeout(120);
  const failures=[...new Set([...errors,...badResponses])];
  assert(failures.length===0,`${hash} emitted browser/resource errors: ${failures.join(' | ')}`);
  page.off('pageerror',onPageError);page.off('console',onConsole);page.off('response',onResponse);
}

try{
  await waitForServer();
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1371,height:936},reducedMotion:'no-preference'});
  const page=await context.newPage();

  await open(page,'#/');
  assert(await page.locator('[data-current-home="true"]').count()===1,'Current static home did not become the canonical rendered home');
  assert(await page.locator('h1').count()===1,'Static home must expose exactly one h1');
  assert(await page.locator('.ch-hero .ch-actions').count()===0,'Hero must not expose action buttons above the search');
  assert(await page.getByRole('link',{name:/Início/i}).count()>=1,'Home navigation is missing');
  assert(await page.getByRole('link',{name:/Roteiros/i}).count()>=1,'Ready-routes navigation is missing');
  assert(await page.getByRole('link',{name:'Planejar minha viagem',exact:true}).count()>=1,'Personalized-planning CTA is missing');
  assert(await page.getByText('Criar do zero',{exact:true}).count()===0,'Deprecated create-from-scratch CTA is still visible');
  assert(await page.getByRole('tab').count()===6,'Static home must expose the six ready-route tabs');

  const heroContrast=await page.locator('.ch-hero').evaluate(hero=>{
    const eyebrow=hero.querySelector('.ch-eyebrow');
    const lead=hero.querySelector('.ch-lead');
    const search=hero.querySelector('.ch-search');
    const input=hero.querySelector('.ch-search input');
    const button=hero.querySelector('.ch-search button');
    if(!eyebrow||!lead||!search||!input||!button)throw new Error('Hero contrast nodes missing');
    return {
      eyebrow:getComputedStyle(eyebrow).color,
      lead:getComputedStyle(lead).color,
      searchBackground:getComputedStyle(search).backgroundColor,
      inputColor:getComputedStyle(input).color,
      placeholder:getComputedStyle(input,'::placeholder').color,
      buttonBackground:getComputedStyle(button).backgroundColor,
      buttonColor:getComputedStyle(button).color,
    };
  });
  assert(heroContrast.eyebrow==='rgb(255, 255, 255)','Hero eyebrow must resolve to white');
  assert(heroContrast.lead!=='rgba(255, 255, 255, 0.68)','Hero lead is using the old low-contrast color');
  assert(heroContrast.inputColor==='rgb(22, 22, 24)','Search input must keep dark text on the light surface');
  assert(heroContrast.placeholder!=='rgb(190, 186, 179)','Search placeholder is still too light');
  assert(heroContrast.buttonBackground==='rgb(22, 22, 24)'&&heroContrast.buttonColor==='rgb(255, 255, 255)','Search CTA must keep high-contrast dark/white colors');

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
  assert(await page.getByRole('link',{name:'Planejar minha viagem',exact:true}).count()>=1,'Ready-routes page lost the personalized-planning CTA');

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

  console.log(JSON.stringify({status:'PASS',surface:'github-pages',checks:['canonical-home','hero-without-buttons','hero-contrast','navigation','planner-cta','six-ready-routes','keyboard-tabs','gallery-keyboard','route-detail','mobile-overflow','reduced-motion']},null,2));
} finally {
  await browser?.close().catch(()=>{});
  server.kill('SIGTERM');
}
