import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('public pages render without a database',async({page,request})=>{
 const health=await request.get('/health');
 expect(health.status()).toBe(200);
 expect(await health.json()).toMatchObject({ok:true,mode:'visual',database:'not_used',persistence:false});
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 page.on('response',response=>{if(response.status()>=500)errors.push('HTTP '+response.status()+' '+new URL(response.url()).pathname);});
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
