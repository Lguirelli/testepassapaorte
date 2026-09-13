import {test,expect} from '@playwright/test';

test('Encontros treats cards as separate draggable objects with center-only emphasis',async({page})=>{
  await page.setViewportSize({width:1371,height:936});
  await page.goto('/');

  const gallery=page.getByTestId('home-partner-gallery');
  await expect(gallery).toBeVisible();

  const geometry=await gallery.evaluate(node=>{
    const center=node.querySelector<HTMLElement>('[data-offset="0"] .card');
    const left=node.querySelector<HTMLElement>('[data-offset="-1"] .card');
    const right=node.querySelector<HTMLElement>('[data-offset="1"] .card');
    const centerMotion=node.querySelector<HTMLElement>('[data-offset="0"] > div:first-child');
    const leftMotion=node.querySelector<HTMLElement>('[data-offset="-1"] > div:first-child');
    const rightMotion=node.querySelector<HTMLElement>('[data-offset="1"] > div:first-child');
    if(!center||!left||!right||!centerMotion||!leftMotion||!rightMotion)throw new Error('Encontros geometry nodes missing');
    const c=center.getBoundingClientRect();
    const l=left.getBoundingClientRect();
    const r=right.getBoundingClientRect();
    return {
      leftGap:c.left-l.right,
      rightGap:r.left-c.right,
      centerFilter:getComputedStyle(centerMotion).filter,
      leftFilter:getComputedStyle(leftMotion).filter,
      rightFilter:getComputedStyle(rightMotion).filter,
      centerWidth:c.width,
      leftEdge:l.left,
      rightEdge:r.right,
    };
  });

  expect(geometry.leftGap).toBeGreaterThan(8);
  expect(geometry.rightGap).toBeGreaterThan(8);
  expect(geometry.centerFilter==='none'||geometry.centerFilter==='').toBeTruthy();
  expect(geometry.leftFilter).toContain('blur');
  expect(geometry.rightFilter).toContain('blur');

  const sideButton=gallery.locator('[data-offset="1"] > button[aria-label^="Centralizar"]').first();
  await expect(sideButton).toBeVisible();
  const sideLabel=await sideButton.getAttribute('aria-label');
  expect(sideLabel).toBeTruthy();
  const sideName=sideLabel!.replace(/^Centralizar\s+/,'');
  await sideButton.click();
  await expect(page.getByText(`Parceiro em destaque: ${sideName}`,{exact:true})).toBeVisible();

  const centerMotion=gallery.locator('[data-offset="0"] > div:first-child');
  const beforeHover=await gallery.evaluate(node=>{
    const center=node.querySelector<HTMLElement>('[data-offset="0"] .card')!.getBoundingClientRect();
    const left=node.querySelector<HTMLElement>('[data-offset="-1"] .card')!.getBoundingClientRect();
    const right=node.querySelector<HTMLElement>('[data-offset="1"] .card')!.getBoundingClientRect();
    return {centerWidth:center.width,leftEdge:left.left,rightEdge:right.right};
  });
  await centerMotion.hover();
  await page.waitForTimeout(420);
  const afterHover=await gallery.evaluate(node=>{
    const center=node.querySelector<HTMLElement>('[data-offset="0"] .card')!.getBoundingClientRect();
    const left=node.querySelector<HTMLElement>('[data-offset="-1"] .card')!.getBoundingClientRect();
    const right=node.querySelector<HTMLElement>('[data-offset="1"] .card')!.getBoundingClientRect();
    return {centerWidth:center.width,leftEdge:left.left,rightEdge:right.right};
  });
  expect(afterHover.centerWidth).toBeGreaterThan(beforeHover.centerWidth);
  expect(afterHover.leftEdge).toBeLessThan(beforeHover.leftEdge-10);
  expect(afterHover.rightEdge).toBeGreaterThan(beforeHover.rightEdge+10);

  await page.mouse.move(1,1);
  const live=page.locator('.sr-only[aria-live="polite"]').filter({hasText:'Parceiro em destaque:'});
  const beforeDrag=(await live.textContent())?.trim();
  const centerBox=await gallery.locator('[data-offset="0"] .card').boundingBox();
  expect(centerBox).toBeTruthy();
  await page.mouse.move(centerBox!.x+centerBox!.width/2,centerBox!.y+centerBox!.height/2);
  await page.mouse.down();
  await page.mouse.move(centerBox!.x+centerBox!.width/2-150,centerBox!.y+centerBox!.height/2,{steps:8});
  await page.mouse.up();
  await expect.poll(async()=>(await live.textContent())?.trim()).not.toBe(beforeDrag);
});
