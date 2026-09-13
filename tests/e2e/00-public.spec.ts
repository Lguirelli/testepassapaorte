import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home, discovery and legal shell are usable',async({page},info)=>{
  const runtimeErrors:string[]=[];
  page.on('pageerror',error=>runtimeErrors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')runtimeErrors.push(message.text());});

  const homeResponse=await page.goto('/');
  expect(homeResponse?.status()).toBeLessThan(500);
  await expect(page.getByRole('heading',{name:/Comece pela curiosidade/i})).toBeVisible();
  await expect(page.getByRole('heading',{name:/Falha temporária/i})).toHaveCount(0);
  await expect(page.getByText(/Não foi possível carregar/i)).toHaveCount(0);

  await page.getByRole('link',{name:/Explorar/i}).first().click();
  await expect(page).toHaveURL(/\/explorar/);
  await expect(page.locator('[data-testid^="place-card-"]').first()).toBeVisible();

  await page.goto('/privacidade');
  await expect(page.getByRole('heading',{name:/Privacidade/i})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBeTruthy();

  const result=await new AxeBuilder({page}).analyze();
  expect(result.violations.filter(v=>['critical','serious'].includes(v.impact||''))).toEqual([]);
  expect(runtimeErrors).toEqual([]);
  await page.screenshot({path:`docs/validation/${info.project.name}-public.png`,fullPage:true});
});
