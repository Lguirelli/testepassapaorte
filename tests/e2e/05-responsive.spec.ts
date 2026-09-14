import {test,expect} from '@playwright/test';

const widths=[347,529,713,887,1113,1371];
const routes=['/','/explorar','/mapa','/parceiros'];

async function expectNoAccidentalHorizontalOverflow(page:import('@playwright/test').Page){
  const result=await page.evaluate(()=>({
    scrollWidth:document.documentElement.scrollWidth,
    clientWidth:document.documentElement.clientWidth,
  }));
  expect(result.scrollWidth,`overflow horizontal: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.clientWidth+1);
}

for(const width of widths)test(`continuous resize preserves usable public layout at ${width}px`,async({page},info)=>{
  test.skip(info.project.name!=='desktop','matriz aleatória roda uma vez para evitar multiplicar a suíte');
    await page.setViewportSize({width,height:720});
    for(const route of routes){
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      await expectNoAccidentalHorizontalOverflow(page);
      const targetSizes=await page.locator('button:visible,a.button:visible,.mobile-menu-trigger:visible').evaluateAll(nodes=>nodes.slice(0,20).map(node=>{const r=(node as HTMLElement).getBoundingClientRect();return {w:r.width,h:r.height,text:(node.textContent||'').trim()}}));
      for(const target of targetSizes){expect(target.h,`target baixo demais: ${target.text}`).toBeGreaterThanOrEqual(44)}
    }
});

test('place card media uses one bounded viewport independent of source image ratio',async({page},info)=>{
  test.skip(info.project.name!=='desktop','cenário dedicado roda uma vez');
  for(const viewport of [{width:1371,height:900},{width:713,height:820},{width:347,height:760}]){
    await page.setViewportSize(viewport);
    await page.goto('/');
    const media=page.locator('[data-card-media="true"]:visible');
    await expect(media.first()).toBeVisible();
    // Card transforms intentionally change visual bounds in the circular gallery.
    // Compare layout heights here; gallery tests separately cover projected geometry.
    const heights=await media.evaluateAll(nodes=>nodes.slice(0,8).map(node=>(node as HTMLElement).offsetHeight));
    expect(heights.length).toBeGreaterThan(0);
    for(const height of heights){
      expect(height).toBeGreaterThanOrEqual(189);
      expect(height).toBeLessThanOrEqual(221);
    }
    expect(Math.max(...heights)-Math.min(...heights)).toBeLessThanOrEqual(1);
  }
});

test('low height and mobile landscape preserve navigation and primary content',async({page},info)=>{
  test.skip(info.project.name!=='desktop','cenário dedicado roda uma vez');
  for(const viewport of [{width:844,height:390},{width:667,height:375},{width:1024,height:480}]){
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading',{name:/Descubra Serra Negra/i})).toBeVisible();
    await expectNoAccidentalHorizontalOverflow(page);
    await page.getByRole('button',{name:/Abrir menu/i}).click().catch(()=>{});
    const mobileNav=page.locator('#mobile-navigation[data-open="true"]');
    if(await mobileNav.count()){
      await expect(mobileNav).toBeVisible();
      await expect(page.getByRole('link',{name:/Planejar minha viagem/i}).last()).toBeVisible();
    }
  }
});

test('200% text enlargement reflows instead of clipping essential content',async({page},info)=>{
  test.skip(info.project.name!=='desktop','cenário dedicado roda uma vez');
  await page.setViewportSize({width:529,height:720});
  await page.goto('/explorar');
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%'});
  await expect(page.getByRole('heading',{name:/O que você quer descobrir/i})).toBeVisible();
  await expect(page.getByRole('button',{name:'Aplicar'})).toBeVisible();
  await expectNoAccidentalHorizontalOverflow(page);
  await page.goto('/parceiros');
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%'});
  await expect(page.locator('main')).toBeVisible();
  await expectNoAccidentalHorizontalOverflow(page);
});

test('resize does not erase form state',async({page},info)=>{
  test.skip(info.project.name!=='desktop','cenário dedicado roda uma vez');
  await page.setViewportSize({width:1113,height:720});
  await page.goto('/explorar');
  const search=page.getByRole('searchbox');
  await search.fill('Mirante do Alto da Serra');
  await page.setViewportSize({width:529,height:720});
  await expect(search).toHaveValue('Mirante do Alto da Serra');
  await page.setViewportSize({width:1371,height:900});
  await expect(search).toHaveValue('Mirante do Alto da Serra');
});
