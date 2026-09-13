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

test('route steps produce a visual preview without login',async({page})=>{
 await page.goto('/roteiro');
 for(let i=0;i<7;i++)await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await page.getByRole('button',{name:'Visualizar meu roteiro',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Uma prévia dos seus caminhos'})).toBeVisible();
 await expect(page).toHaveURL(/\/roteiro$/);
 await page.getByRole('button',{name:'Voltar',exact:true}).focus();
 await expect(page.getByRole('button',{name:'Voltar',exact:true})).toBeFocused();
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
