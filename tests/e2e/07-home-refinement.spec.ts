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
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');

  const hero=page.getByTestId('home-hero');
  await expect(hero).toBeVisible();
  const heroBox=await hero.boundingBox();
  expect(heroBox?.height||0).toBeGreaterThanOrEqual(880);

  const headerCta=page.getByRole('link',{name:/Montar meu roteiro/i}).first();
  const ctaStyles=await headerCta.evaluate(element=>({
    background:getComputedStyle(element).backgroundColor,
    color:getComputedStyle(element).color,
  }));
  expect(ctaStyles.background).toMatch(/rgb\(255, 255, 255\)|rgb\(247, 247, 245\)/);
  expect(ctaStyles.color).toBe('rgb(32, 32, 32)');

  await expect(page.getByTestId('home-featured-grid').locator('article')).toHaveCount(3);
  await expect(page.getByRole('link',{name:/Conhecer todos os pontos/i})).toBeVisible();

  const gallery=page.getByTestId('home-partner-gallery');
  const central=gallery.locator('[data-offset="0"]');
  const left=gallery.locator('[data-offset="-1"]');
  const right=gallery.locator('[data-offset="1"]');
  const before=await Promise.all([left,right].map(locator=>locator.evaluate(element=>getComputedStyle(element).transform)));
  await central.locator('div').first().hover();
  await page.waitForTimeout(80);
  const after=await Promise.all([left,right].map(locator=>locator.evaluate(element=>getComputedStyle(element).transform)));
  expect(after[0]).not.toBe(before[0]);
  expect(after[1]).not.toBe(before[1]);

  await gallery.focus();
  await page.keyboard.press('ArrowRight');
  await expect(gallery.locator('[data-offset="0"]')).toBeVisible();

  const faq=page.getByTestId('home-faq');
  const second=faq.getByRole('button',{name:/Existe reserva/i});
  await second.click();
  await expect(second).toHaveAttribute('aria-expanded','true');
  await expect(faq.getByRole('button',{name:/Os lugares/i})).toHaveAttribute('aria-expanded','false');

  await page.getByRole('tab',{name:'Natureza'}).click();
  await expect(page.getByTestId('home-route-slider')).toContainText('Mais tempo ao ar livre');

  const routeDot=page.getByTestId('home-route-track').locator('span').first();
  const routeTransformBefore=await routeDot.evaluate(element=>getComputedStyle(element).transform);
  await routeDot.hover();
  await page.waitForTimeout(80);
  const routeTransformAfter=await routeDot.evaluate(element=>getComputedStyle(element).transform);
  expect(routeTransformAfter).not.toBe(routeTransformBefore);

  const finalTitle=page.getByTestId('home-final-cta').locator('h2 span');
  await expect(finalTitle).toHaveCount(2);
  const lines=await finalTitle.evaluateAll(elements=>elements.map(element=>Math.round(element.getBoundingClientRect().top)));
  expect(lines[1]).toBeGreaterThan(lines[0]);

  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});

test('internal header has no lower divider',async({page})=>{
  await page.goto('/explorar');
  const styles=await page.locator('header').evaluate(element=>({
    borderBottom:getComputedStyle(element).borderBottomWidth,
    shadow:getComputedStyle(element).boxShadow,
    backgroundImage:getComputedStyle(element).backgroundImage,
  }));
  expect(styles.borderBottom).toBe('0px');
  expect(styles.shadow).toBe('none');
  expect(styles.backgroundImage).toBe('none');
});

for(const viewport of viewports){
  test(`home responsive without overflow ${viewport.width}x${viewport.height}`,async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto('/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
    const hero=page.getByTestId('home-hero');
    const box=await hero.boundingBox();
    expect(box?.height||0).toBeGreaterThanOrEqual(viewport.height-2);
  });
}

test('home honors reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const card=page.locator('a').filter({hasText:'Explorar este caminho'}).first();
  const transition=await card.evaluate(element=>getComputedStyle(element).transitionDuration);
  expect(['0s','0.001s']).toContain(transition.split(',')[0]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});
