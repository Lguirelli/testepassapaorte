import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('presentation journey reaches route calendar and passport without login',async({page})=>{
  await page.goto('/roteiro');
  for(let step=0;step<7;step++)await page.getByRole('button',{name:'Continuar'}).click();
  await page.getByRole('button',{name:'Montar meu roteiro'}).click();
  await expect(page).toHaveURL(/\/experiencia\/roteiro/);
  await expect(page.getByRole('heading',{name:/Seu roteiro, dia a dia/i})).toBeVisible();
  await expect(page.getByRole('button',{name:'Simular carimbo'}).first()).toBeVisible();
  await page.getByRole('button',{name:'Simular carimbo'}).first().click();
  await page.getByRole('link',{name:'Calendário',exact:true}).click();
  await expect(page.getByRole('heading',{name:/Calendário da viagem/i})).toBeVisible();
  await page.getByRole('link',{name:'Passaporte',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Meu Passaporte'})).toBeVisible();
  await expect(page.getByText(/Passaporte aberto sem login/i)).toBeVisible();
  const axe=await new AxeBuilder({page}).analyze();
  expect(axe.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});
