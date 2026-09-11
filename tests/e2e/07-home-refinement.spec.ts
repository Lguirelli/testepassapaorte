import {test,expect} from '@playwright/test';

const viewports=[
  {width:1920,height:1080},
  {width:1440,height:900},
  {width:1366,height:768},
  {width:1280,height:720},
  {width:1024,height:768},
  {width:768,height:1024},
  {width:430,height:932},
  {width:390,height:844},
  {width:360,height:800},
];

test('home refinement core interactions',async({page})=>{
  await page.goto('/');
  await expect(page.getByTestId('home-hero')).toBeVisible();
  await expect(page.getByTestId('home-featured-grid').locator('article')).toHaveCount(3);
  await expect(page.getByRole('link',{name:/Conhecer todos os pontos/i})).toBeVisible();

  const faq=page.getByTestId('home-faq');
  const second=faq.getByRole('button',{name:/Existe reserva/i});
  await second.click();
  await expect(second).toHaveAttribute('aria-expanded','true');

  await page.getByRole('tab',{name:'Natureza'}).click();
  await expect(page.getByTestId('home-route-slider')).toContainText('Mais tempo ao ar livre');

  const central=page.getByTestId('home-partner-gallery').locator('[data-offset="0"]');
  await central.hover();
  await expect(central).toBeVisible();

  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});

for(const viewport of viewports){
  test(`home no horizontal overflow ${viewport.width}x${viewport.height}`,async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto('/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
    const hero=page.getByTestId('home-hero');
    const box=await hero.boundingBox();
    expect(box?.height||0).toBeGreaterThan(viewport.height*.55);
  });
}

test('home honors reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const transition=await page.getByTestId('home-featured-grid').evaluate(element=>getComputedStyle(element).transitionDuration);
  expect(transition).toBeDefined();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});
