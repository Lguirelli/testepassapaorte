import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicPaths=['/','/explorar','/mapa','/parceiros','/pontos-turisticos','/roteiros','/roteiros/fim-de-semana-a-dois','/roteiro','/lugares/igreja-matriz-nossa-senhora-do-rosario','/parceiros/cafe-neblina-alta','/parceiros/caminho-do-cafe'];

async function seriousA11yViolations(page:import('@playwright/test').Page){
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
  const title=page.locator('h1');
  await expect(title).toHaveCount(1);
  await expect(title).toBeVisible();
  await expect(page.getByText('Falha temporária',{exact:true})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`Overflow on ${path}`).toBeLessThanOrEqual(2);
  expect(await seriousA11yViolations(page)).toEqual([]);
  expect(errors).toEqual([]);
 });
}

test('ready route creates an editable guest itinerary without onboarding',async({page})=>{
 await page.goto('/roteiros/fim-de-semana-a-dois');
 await expect(page.getByRole('heading',{name:/Dois dias para aproveitar sem pressa/i})).toBeVisible();
 await page.getByRole('button',{name:'Usar este roteiro',exact:true}).click();
 await expect(page).toHaveURL(/\/experiencia\/roteiro/);
 await expect.poll(()=>page.evaluate(()=>location.pathname)).toBe('/experiencia/roteiro');
 await expect(page.getByRole('heading',{name:/Seu roteiro, dia a dia/i})).toBeVisible();
 await expect(page.getByText(/Etapa 1 de 8/i)).toHaveCount(0);
});

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
 await page.locator('.carousel-dots button').first().waitFor();
 await page.getByRole('button',{name:'Próximo',exact:true}).click();
 await expect(page.locator('.meet-card[aria-hidden="false"]')).toContainText('Sabores da serra');
 await page.locator('.carousel-stage').focus();
 await page.keyboard.press('ArrowLeft');
 await expect(page.locator('.meet-card[aria-hidden="false"]')).toContainText('Café entre caminhos');
 await page.getByRole('tab',{name:'Primeira vez',exact:true}).focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Dia leve',exact:true})).toHaveAttribute('aria-selected','true');
 const faq=page.locator('.faq-list button').first();
 await faq.focus();await page.keyboard.press('Enter');
 await expect(page.locator('#reference-answer-0')).toBeVisible();
 const menu=page.getByRole('button',{name:'Abrir menu',exact:true});
 if(await menu.isVisible()){await menu.click();await expect(page.getByRole('dialog',{name:'Menu principal'})).toBeVisible();await page.keyboard.press('Escape');await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();}
});

test('Encontros gallery keeps the center card readable and controls outside the card',async({page})=>{
 await page.setViewportSize({width:1371,height:936});await page.goto('/');
 await page.locator('.carousel-dots button').first().waitFor();
 const geometry=await page.locator('.carousel').evaluate(node=>{
  const center=node.querySelector<HTMLElement>('.meet-card[aria-hidden="false"]')!.getBoundingClientRect();
  const next=node.querySelector<HTMLElement>('.carousel-arrow.next')!.getBoundingClientRect();
  return{height:center.height,right:center.right,controlLeft:next.left};
 });
 expect(geometry.height).toBeLessThan(500);expect(geometry.controlLeft).toBeGreaterThan(geometry.right);
});

test('home, ready routes and map adapt continuously across intermediate widths and dark mode remains accessible',async({page})=>{
 const widths=[347,529,713,887,979,1113,1371];
 for(const path of ['/','/roteiros','/mapa']){
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
 const labels=await nav.locator('a').evaluateAll(links=>links.map(link=>{const range=document.createRange();range.selectNodeContents(link);return {text:link.textContent,lines:new Set([...range.getClientRects()].map(rect=>Math.round(rect.top))).size};}));
 for(const label of labels)expect(label.lines,`Dock label wraps: ${label.text}`).toBe(1);
});

test('desktop appearance selector fits its labels and stays clear of navigation',async({page})=>{
 await page.goto('/');
 for(const width of [1181,1200,1371]){
  await page.setViewportSize({width,height:936});
  const picker=page.getByRole('combobox',{name:'Aparência',exact:true});
  await expect(picker).toBeVisible();
  const geometry=await picker.evaluate(node=>{
   const select=node as HTMLSelectElement;
   const style=getComputedStyle(select);
   const canvas=document.createElement('canvas');
   const context=canvas.getContext('2d')!;
   context.font=style.font;
   const textWidth=Math.max(...Array.from(select.options,option=>context.measureText(option.text).width));
   const nav=document.querySelector('.main-nav')!.getBoundingClientRect();
   const tools=document.querySelector('.header-tools')!.getBoundingClientRect();
   return {available:select.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),required:textWidth+parseFloat(style.fontSize),gap:tools.left-nav.right};
  });
  expect(geometry.available,`Appearance label clipped at ${width}px`).toBeGreaterThanOrEqual(geometry.required);
  expect(geometry.gap,`Header tools overlap Dock at ${width}px`).toBeGreaterThanOrEqual(0);
 }
});

test('resizing an open compact menu releases scrolling and moves focus to desktop navigation',async({page})=>{
 await page.setViewportSize({width:887,height:700});
 await page.goto('/');
 await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Menu principal'})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await page.setViewportSize({width:1371,height:936});
 await expect(page.getByRole('dialog',{name:'Menu principal'})).toBeHidden();
 await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 await expect(page.getByRole('navigation',{name:'Navegação principal',exact:true}).getByRole('link',{name:'Início',exact:true})).toBeFocused();
 await page.setViewportSize({width:887,height:700});
 await expect(page.getByRole('button',{name:'Abrir menu',exact:true})).toHaveAttribute('aria-expanded','false');
 await expect(page.getByRole('dialog',{name:'Menu principal'})).toBeHidden();
});

test('route tab keyboard handling does not steal a subsequent focus change',async({page})=>{
 await page.goto('/');await page.locator('.carousel-dots button').first().waitFor();
 await page.getByRole('tab',{name:'Primeira vez',exact:true}).focus();await page.keyboard.press('ArrowRight');
 const faq=page.locator('.faq-list button').nth(1);await faq.focus();
 await expect(faq).toBeFocused();await page.keyboard.press('Enter');
 await expect(page.locator('#reference-answer-1')).toBeVisible();
 await expect(page.getByRole('tab',{name:'Dia leve',exact:true})).toHaveAttribute('aria-selected','true');
});

test('Green marks selected/current state while hover stays in the dark greens',async({page})=>{
 await page.setViewportSize({width:1371,height:936});
 await page.goto('/');
 const palette=await page.evaluate(()=>{const style=getComputedStyle(document.documentElement);return {green:style.getPropertyValue('--green').trim().toUpperCase(),darkGreen:style.getPropertyValue('--dark-green').trim().toUpperCase(),greenBlack:style.getPropertyValue('--green-black').trim().toUpperCase()};});
 expect(palette).toEqual({green:'#008542',darkGreen:'#003328',greenBlack:'#001F18'});
 const current=page.locator('.main-nav a[aria-current="page"]').first();
 await expect(current).toBeVisible();
 await expect.poll(()=>current.evaluate(node=>getComputedStyle(node).boxShadow)).toContain('0, 133, 66');
 await current.hover();
 await expect.poll(()=>current.evaluate(node=>getComputedStyle(node).boxShadow)).toContain('0, 133, 66');
 const neutralNav=page.locator('.main-nav a:not(.button):not([aria-current="page"])').first();
 await neutralNav.hover();
 await expect.poll(()=>neutralNav.evaluate(node=>getComputedStyle(node).backgroundColor)).not.toBe('rgb(0, 133, 66)');
 await expect.poll(()=>neutralNav.evaluate(node=>getComputedStyle(node).boxShadow)).not.toContain('0, 133, 66');
 const selectedTab=page.getByRole('tab',{name:'Primeira vez',exact:true});
 await expect(selectedTab).toHaveAttribute('aria-selected','true');
 await expect.poll(()=>selectedTab.evaluate(node=>({background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color}))).toEqual({background:'rgb(23, 25, 23)',color:'rgb(255, 255, 255)'});
 await selectedTab.hover();
 await expect.poll(()=>selectedTab.evaluate(node=>getComputedStyle(node).backgroundColor)).toBe('rgb(23, 25, 23)');
 const neutralTab=page.getByRole('tab',{name:'Dia leve',exact:true});
 await neutralTab.hover();
 await expect.poll(()=>neutralTab.evaluate(node=>getComputedStyle(node).backgroundColor)).not.toBe('rgb(0, 133, 66)');
 await page.getByRole('combobox',{name:'Aparência',exact:true}).selectOption('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect.poll(()=>selectedTab.evaluate(node=>({background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color}))).toEqual({background:'rgb(23, 25, 23)',color:'rgb(255, 255, 255)'});
 expect(await seriousA11yViolations(page)).toEqual([]);
 await page.screenshot({path:test.info().outputPath('palette-selected-and-hover.png'),fullPage:true});
});
test('partner contact dialog can close with empty required fields',async({page})=>{
 await page.goto('/parceiros');await page.locator('[data-open-contact]').last().click();
 await expect(page.locator('#contact-modal')).toBeVisible();await page.getByRole('button',{name:'Fechar',exact:true}).click();await expect(page.locator('#contact-modal')).toBeHidden();
 await page.locator('[data-network="cultura"]').click();await expect(page.locator('#network-grid article:not([hidden])')).toHaveCount(1);
});
test('partner visit plan can be created, downloaded and edited locally',async({page})=>{
 await page.goto('/parceiros/caminho-do-cafe');await page.locator('[data-choice="sabores"]').click();await expect(page.locator('#experience-title')).toContainText('Descobertas');
 const date=new Date();date.setDate(date.getDate()+7);const value=date.toISOString().slice(0,10);
 await page.locator('input[name="data"]').fill(value);await page.getByRole('button',{name:'Criar meu plano',exact:true}).click();await expect(page.locator('#result')).toBeVisible();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Baixar meu plano',exact:true}).click();expect((await download).suggestedFilename()).toBe('meu-plano-demonstrativo.txt');
 await page.getByRole('button',{name:'Editar planejamento',exact:true}).click();await expect(page.locator('#plan-form')).toBeVisible();
});
