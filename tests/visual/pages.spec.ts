import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('public pages render without a database',async({page,request})=>{
 const health=await request.get('/health');
 expect(health.status()).toBe(200);
 expect(await health.json()).toMatchObject({ok:true,mode:'visual',database:'not_used',persistence:false});
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 page.on('response',response=>{if(response.status()>=400)errors.push('HTTP '+response.status()+' '+new URL(response.url()).pathname);});
 for(const path of ['/','/explorar','/mapa','/parceiros','/pontos-turisticos','/roteiro','/lugares/igreja-matriz-nossa-senhora-do-rosario','/parceiros/cafe-neblina-alta']){
  const response=await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByText('Falha temporária',{exact:true})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`Overflow on ${path}`).toBeLessThanOrEqual(2);
  const axe=await new AxeBuilder({page}).analyze();
  expect(axe.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);
 }
 expect(errors).toEqual([]);
});

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

test('home adapts continuously and in dark mode',async({page})=>{
 await page.goto('/');await expect(page.locator('h1')).toBeVisible();
 for(const width of [347,529,713,887,1113,1371]){
  await page.setViewportSize({width,height:700});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),{message:`Home overflow at ${width}px`}).toBeLessThanOrEqual(2);
 }
 await page.getByRole('combobox',{name:'Aparência',exact:true}).selectOption('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 const axe=await new AxeBuilder({page}).analyze();
 expect(axe.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);
 await page.screenshot({path:test.info().outputPath('home-dark.png'),fullPage:true});
});
