import {test,expect,type Page} from '@playwright/test';

async function noHorizontalOverflow(page:Page){
  const {scrollWidth,clientWidth}=await page.evaluate(()=>({
    scrollWidth:document.documentElement.scrollWidth,
    clientWidth:document.documentElement.clientWidth,
  }));
  expect(scrollWidth,'não deve existir overflow horizontal acidental').toBeLessThanOrEqual(clientWidth+1);
}

async function activeGalleryDot(page:Page){
  const dots=page.locator('[data-testid^="home-gallery-dot-"]');
  for(let i=0;i<await dots.count();i++)if(await dots.nth(i).getAttribute('aria-pressed')==='true')return i;
  return -1;
}

test('Dock responde por proximidade sem alterar geometria',async({page},info)=>{
  test.skip(!info.project.name.startsWith('desktop'),'efeito Dock é validado em pointer fino');
  await page.goto('/');
  const nav=page.getByTestId('main-dock-navigation');
  await expect(nav).toBeVisible();
  const first=nav.locator('a').first();
  const box=await first.boundingBox();
  expect(box).not.toBeNull();
  const before=await nav.boundingBox();
  await page.mouse.move(box!.x+box!.width/2,box!.y+box!.height/2);
  await expect.poll(async()=>Number(await first.evaluate(el=>getComputedStyle(el).getPropertyValue('--dock-scale')||'1'))).toBeGreaterThan(1.02);
  const after=await nav.boundingBox();
  expect(Math.abs((after?.height||0)-(before?.height||0))).toBeLessThanOrEqual(1);
  await page.mouse.move(2,2);
  await expect.poll(async()=>Number(await first.evaluate(el=>getComputedStyle(el).getPropertyValue('--dock-scale')||'1'))).toBeLessThanOrEqual(1.001);
});

test('Warp Text reage ao pointer e mantém título acessível',async({page},info)=>{
  test.skip(!info.project.name.startsWith('desktop'),'Warp interativo é validado em pointer fino');
  await page.goto('/');
  const title=page.getByTestId('home-warp-title');
  await expect(title).toBeVisible();
  await expect(title).toHaveAttribute('aria-label',/Descubra Serra Negra/i);
  const box=await title.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x+box!.width*.82,box!.y+box!.height*.3);
  await expect.poll(async()=>await title.evaluate(el=>getComputedStyle(el).getPropertyValue('--warp-a-x').trim())).not.toBe('0px');
  await page.mouse.move(1,1);
  await expect.poll(async()=>await title.evaluate(el=>getComputedStyle(el).getPropertyValue('--warp-a-x').trim())).toBe('0px');
});

test('Circular Gallery funciona por teclado, wheel e ação lateral',async({page})=>{
  await page.goto('/');
  const stage=page.getByTestId('home-partner-gallery');
  await expect(stage).toBeVisible();
  const initial=await activeGalleryDot(page);
  expect(initial).toBeGreaterThanOrEqual(0);
  await stage.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(()=>activeGalleryDot(page)).not.toBe(initial);
  const afterKeyboard=await activeGalleryDot(page);
  await stage.dispatchEvent('wheel',{deltaY:120,deltaX:0});
  await expect.poll(()=>activeGalleryDot(page)).not.toBe(afterKeyboard);
  const side=page.locator('[data-testid^="home-gallery-center-"]:visible').first();
  if(await side.count()){
    const before=await activeGalleryDot(page);
    await side.click();
    await expect.poll(()=>activeGalleryDot(page)).not.toBe(before);
  }
});

test('slider de roteiro preserva semântica tabs e teclado',async({page})=>{
  await page.goto('/');
  const first=page.getByTestId('home-route-tab-0');
  const second=page.getByTestId('home-route-tab-1');
  await expect(first).toHaveAttribute('aria-selected','true');
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-selected','true');
  await expect(page.getByTestId('home-route-slider')).toBeVisible();
});

test('FAQ comunica expansão e mantém foco no controle',async({page})=>{
  await page.goto('/');
  const trigger=page.getByTestId('home-faq-trigger-0');
  const answer=page.getByTestId('home-faq-answer-0');
  await expect(trigger).toHaveAttribute('aria-expanded','false');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded','true');
  await expect(trigger).toBeFocused();
  await expect(answer).toHaveAttribute('data-open','true');
});

test('menu móvel prende foco, fecha com Escape e devolve foco',async({page},info)=>{
  test.skip(!['mobile','tablet'].includes(info.project.name),'Card Nav compacto');
  await page.goto('/');
  const trigger=page.getByRole('button',{name:/Abrir menu/i});
  await trigger.click();
  const layer=page.getByTestId('mobile-navigation');
  await expect(layer).toHaveAttribute('data-open','true');
  await expect(page.locator('body')).toHaveCSS('overflow','hidden');
  await page.keyboard.press('Escape');
  await expect(layer).toHaveAttribute('data-open','false');
  await expect(trigger).toBeFocused();
  await noHorizontalOverflow(page);
});

test('reduced motion mantém conteúdo e remove movimentos essenciais',async({page},info)=>{
  test.skip(info.project.name!=='reduced-motion','projeto dedicado');
  await page.goto('/');
  const title=page.getByTestId('home-warp-title');
  const animation=await title.locator('span').first().evaluate(el=>getComputedStyle(el).animationDuration);
  expect(['0s','0.001s','1ms']).toContain(animation);
  const gallery=page.getByTestId('home-partner-gallery');
  await gallery.focus();
  await page.keyboard.press('ArrowRight');
  expect(await activeGalleryDot(page)).toBeGreaterThanOrEqual(0);
  await noHorizontalOverflow(page);
});

test('mapa mantém pins operáveis por teclado quando seleção está disponível',async({page},info)=>{
  test.skip(info.project.name!=='desktop','cenário único');
  await page.goto('/mapa');
  const map=page.getByTestId('place-map');
  await expect(map).toBeVisible();
  const pins=map.getByRole('button');
  if(await pins.count()){
    const pin=pins.first();
    await pin.focus();
    await page.keyboard.press('Enter');
    await expect(pin).toHaveAttribute('aria-pressed','true');
  }
  await noHorizontalOverflow(page);
});
