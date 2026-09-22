import {test,expect} from '@playwright/test';
import {E2E_AUTH} from './auth-credentials';

test('guest experiences the full trip before login and saves without rebuilding',async({page},info)=>{
  await page.goto('/roteiro');
  for(let step=0;step<7;step++)await page.getByRole('button',{name:'Continuar'}).click();
  await page.getByRole('button',{name:'Montar meu roteiro'}).click();
  await expect(page).toHaveURL(/\/experiencia\/roteiro/);
  await expect(page.getByRole('heading',{name:/Seu roteiro, dia a dia/i})).toBeVisible();
  await expect(page.getByText(/Nada exige conta até você escolher salvar/i)).toBeVisible();

  const simulate=page.getByRole('button',{name:'Simular carimbo'}).first();
  await simulate.click();
  await expect(page.getByRole('button',{name:'Remover carimbo simulado'}).first()).toBeVisible();

  await page.getByRole('link',{name:'Calendário',exact:true}).click();
  await expect(page).toHaveURL(/\/experiencia\/calendario/);
  await expect(page.getByRole('heading',{name:/Calendário da viagem/i})).toBeVisible();

  await page.getByRole('link',{name:'Passaporte',exact:true}).click();
  await expect(page).toHaveURL(/\/experiencia\/passaporte/);
  await expect(page.getByRole('heading',{name:'Meu Passaporte'})).toBeVisible();
  await expect(page.getByText(/Passaporte aberto sem login/i)).toBeVisible();

  await page.getByRole('button',{name:'Salvar minha viagem'}).click();
  await expect(page).toHaveURL(/\/login\?next=%2Fexperiencia%2Fsalvar/);
  await expect(page.getByRole('heading',{name:/Entre para salvar sem recomeçar/i})).toBeVisible();
  await page.getByLabel('E-mail').fill(E2E_AUTH.tourist.email);
  await page.getByLabel('Senha').fill(E2E_AUTH.tourist.password);
  await page.getByRole('button',{name:'Entrar e salvar minha viagem'}).click();

  await expect(page).toHaveURL(/\/viagens\/[^/]+\/roteiro/,{timeout:20000});
  await expect(page.getByRole('heading',{name:/Seu roteiro, dia a dia/i})).toBeVisible();
  const calendar=page.getByRole('link',{name:/calendário/i}).first();
  await calendar.click();
  await expect(page).toHaveURL(/\/calendario/);
  await expect(page.getByRole('heading',{name:/Calendário/i})).toBeVisible();
  await page.screenshot({path:`docs/validation/${info.project.name}-calendar.png`,fullPage:true});
});
