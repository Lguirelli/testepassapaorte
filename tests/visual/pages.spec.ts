import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicPaths=['/','/explorar','/mapa','/parceiros','/pontos-turisticos','/roteiro','/lugares/igreja-matriz-nossa-senhora-do-rosario','/parceiros/cafe-neblina-alta'];

async function seriousA11yViolations(page:import('@playwright/test').Page){
 // Audit the settled UI, not intermediate opacity during page/slide entry.
 await page.evaluate(async()=>{
  const animations=document.getAnimations().filter(animation=>animation.playState==='running'&&Number.isFinite(Number(animation.effect?.getComputedTiming().endTime)));
  await Promise.all(animations.map(animation=>animation.finished.catch(()=>undefined)));
 });
 const axe=await new AxeBuilder({page}).analyze();
 return axe.violations.filter(v=>v.impact==='critical'||v.impact==='serious');
}

test('visual runtime health does not depend on a database',async({request})=>{
 const health=await request.get('/health');
 expect(health.status()).toBe(200);
 expect(await health.json()).toMatchObject({ok:true,mode:'visual',database:'not_used',persistence:false});
});

for(const path of publicPaths){
 test(`public page ${path} renders without overflow or serious accessibility violations`,async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('response',response=>{if(response.status()>=400)errors.push('HTTP '+response.status()+' '+new URL(response.url()).pathname);});
  const response=await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByText('Falha temporária',{exact:true})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`Overflow on ${path}`).toBeLessThanOrEqual(2);
  expect(await seriousA11yViolations(page)).toEqual([]);
  expect(errors).toEqual([]);
 });
}

test('route steps build a full guest itinerary without login',async({page})=>{
 await page.goto('/roteiro');
 for(let i=0;i<7;i++)await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await page.getByRole('button',{name:'Montar meu roteiro',exact:true}).click();
 await expect(page).toHaveURL(/\/experiencia\/roteiro/);
 await expect(page.getByRole('heading',{name:/Seu roteiro, dia a dia/i})).toBeVisible();
 await expect(page.getByRole('button',{name:'Salvar minha viagem',exact:true})).toBeVisible();
 await expect(page).not.toHaveURL(/\/login/);
});

test('gallery, route tabs, FAQ and mobile menu respond to keyboard',async({page})=>{
 await page.goto('/');
 const next=page.getByRole('button',{name:'Próximo parceiro',exact:true});
 await next.click();
 await expect(page.getByText('Parceiro em destaque: Bistrô Estação Verde',{exact:true})).toBeVisible();
 const gallery=page.getByTestId('home-partner-gallery');
 await gallery.focus();
 await page.keyboard.press('ArrowLeft');
 await expect(page.getByText('Parceiro em destaque: Café Neblina Alta',{exact:true})).toBeVisible();
 const firstTab=page.getByRole('tab',{name:'Primeira visita',exact:true});
 await firstTab.focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Natureza',exact:true})).toHaveAttribute('aria-selected','true');
 const faq=page.getByRole('button',{name:'É possível reservar ou pagar pelo Passaporte?',exact:true});
 await faq.focus();await page.keyboard.press('Enter');
 await expect(faq).toHaveAttribute('aria-expanded','true');
 const menu=page.getByRole('button',{name:'Abrir menu',exact:true});
 if(await menu.isVisible()){
  await menu.click();
  await expect(page.getByRole('dialog',{name:'Menu principal'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(menu).toBeFocused();
 }
 await page.screenshot({path:test.info().outputPath('home-interactions.png'),fullPage:true});
});

test('Encontros gallery keeps the center card readable and controls outside the card',async({page})=>{
 await page.setViewportSize({width:1371,height:936});
 await page.goto('/');
 const gallery=page.getByTestId('home-partner-gallery');
 await expect(gallery).toBeVisible();
 const geometry=await gallery.evaluate(node=>{
  const center=node.querySelector<HTMLElement>('[data-offset="0"] .card');
  const left=node.querySelector<HTMLElement>('[data-offset="-1"] .card');
  const right=node.querySelector<HTMLElement>('[data-offset="1"] .card');
  const next=document.querySelector<HTMLElement>('button[aria-label="Próximo parceiro"]');
  if(!center||!left||!right||!next)throw new Error('Gallery geometry nodes missing');
  const c=center.getBoundingClientRect();
  const l=left.getBoundingClientRect();
  const r=right.getBoundingClientRect();
  const n=next.getBoundingClientRect();
  return {
   centerHeight:c.height,
   centerBottom:c.bottom,
   controlsTop:n.top,
   leftExposure:c.left-l.left,
   rightExposure:r.right-c.right,
  };
 });
 expect(geometry.centerHeight).toBeLessThan(500);
 expect(geometry.controlsTop).toBeGreaterThanOrEqual(geometry.centerBottom-8);
 expect(geometry.leftExposure).toBeGreaterThan(90);
 expect(geometry.rightExposure).toBeGreaterThan(90);
});

test('home and map adapt continuously across intermediate widths and dark mode remains accessible',async({page})=>{
 const widths=[347,529,713,887,979,1113,1371];
 for(const path of ['/','/mapa']){
  await page.goto(path);await expect(page.locator('h1')).toBeVisible();
  for(const width of widths){
   await page.setViewportSize({width,height:700});
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),{message:`Overflow on ${path} at ${width}px`}).toBeLessThanOrEqual(2);
  }
 }
 await page.goto('/');
 await page.setViewportSize({width:1371,height:936});
 await page.getByRole('combobox',{name:'Aparência',exact:true}).selectOption('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 expect(await seriousA11yViolations(page)).toEqual([]);
 await page.screenshot({path:test.info().outputPath('home-dark.png'),fullPage:true});
});


test('desktop Dock labels remain on one line',async({page})=>{
 await page.setViewportSize({width:1371,height:936});
 await page.goto('/');
 const nav=page.getByRole('navigation',{name:'Navegação principal',exact:true});
 await expect(nav).toBeVisible();
 const labels=await nav.locator('a').evaluateAll(links=>links.map(link=>{
  const range=document.createRange();range.selectNodeContents(link);
  return {text:link.textContent,lines:new Set([...range.getClientRects()].map(rect=>Math.round(rect.top))).size};
 }));
 for(const label of labels)expect(label.lines,`Dock label wraps: ${label.text}`).toBe(1);
});

test('lime marks selected/current state while hover stays dark green',async({page})=>{
 await page.setViewportSize({width:1371,height:936});
 await page.goto('/');
 const palette=await page.evaluate(()=>{
  const style=getComputedStyle(document.documentElement);
  return {
   lime:style.getPropertyValue('--lime').trim().toUpperCase(),
   darkGreen:style.getPropertyValue('--dark-green').trim().toUpperCase(),
   greenBlack:style.getPropertyValue('--green-black').trim().toUpperCase(),
  };
 });
 expect(palette).toEqual({lime:'#D8E600',darkGreen:'#003328',greenBlack:'#001F18'});

 const current=page.locator('.main-nav a[aria-current="page"]').first();
 await expect(current).toBeVisible();
 const currentBefore=await current.evaluate(node=>({background:getComputedStyle(node).backgroundColor,shadow:getComputedStyle(node).boxShadow}));
 expect(currentBefore.shadow).toContain('216, 230, 0');
 await current.hover();
 const currentAfter=await current.evaluate(node=>({background:getComputedStyle(node).backgroundColor,shadow:getComputedStyle(node).boxShadow}));
 expect(currentAfter).toEqual(currentBefore);

 const neutralNav=page.locator('.main-nav a:not(.button):not([aria-current="page"])').first();
 await neutralNav.hover();
 const neutralNavStyle=await neutralNav.evaluate(node=>({background:getComputedStyle(node).backgroundColor,shadow:getComputedStyle(node).boxShadow}));
 expect(neutralNavStyle.background).not.toBe('rgb(216, 230, 0)');
 expect(neutralNavStyle.shadow).not.toContain('216, 230, 0');

 const selectedTab=page.getByRole('tab',{name:'Primeira visita',exact:true});
 await expect(selectedTab).toHaveAttribute('aria-selected','true');
 const selectedStyle=await selectedTab.evaluate(node=>({background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color}));
 expect(selectedStyle.background).toBe('rgb(216, 230, 0)');
 expect(selectedStyle.color).toBe('rgb(0, 31, 24)');
 await selectedTab.hover();
 expect(await selectedTab.evaluate(node=>getComputedStyle(node).backgroundColor)).toBe('rgb(216, 230, 0)');

 const neutralTab=page.getByRole('tab',{name:'Natureza',exact:true});
 await neutralTab.hover();
 expect(await neutralTab.evaluate(node=>getComputedStyle(node).backgroundColor)).not.toBe('rgb(216, 230, 0)');

 await page.getByRole('combobox',{name:'Aparência',exact:true}).selectOption('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 expect(await selectedTab.evaluate(node=>({background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color}))).toEqual({background:'rgb(216, 230, 0)',color:'rgb(0, 31, 24)'});
 expect(await seriousA11yViolations(page)).toEqual([]);
 await page.screenshot({path:test.info().outputPath('palette-selected-and-hover.png'),fullPage:true});
});
