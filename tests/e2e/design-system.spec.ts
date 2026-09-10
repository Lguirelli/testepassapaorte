import { test, expect } from '@playwright/test';

test.describe('Design System V1', () => {
  test('showcase carrega tokens e stacks tipográficos oficiais', async ({ page }) => {
    await page.goto('/');
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const home = document.querySelector('.hero-copy h1');
      const editorial = document.querySelector('.section-head h2');
      return {
        bg: root.getPropertyValue('--psn-neutral-050').trim().toUpperCase(),
        ink: root.getPropertyValue('--psn-neutral-950').trim().toUpperCase(),
        cocoa: root.getPropertyValue('--psn-cocoa').trim().toUpperCase(),
        homeFont: home ? getComputedStyle(home).fontFamily : '',
        editorialFont: editorial ? getComputedStyle(editorial).fontFamily : '',
        bodyFont: getComputedStyle(document.body).fontFamily,
      };
    });
    expect(values.bg).toBe('#E7E7DE');
    expect(values.ink).toBe('#141416');
    expect(values.cocoa).toBe('#594536');
    expect(values.homeFont).toMatch(/CuturilaDEMO|Bebas Neue/i);
    expect(values.editorialFont).toMatch(/Inter/i);
    expect(values.bodyFont).toMatch(/Inter/i);
  });

  test('página interna usa Arimo no título', async ({ page }) => {
    await page.goto('/explorar');
    const font = await page.locator('.section-head h1').first().evaluate(el => getComputedStyle(el).fontFamily);
    expect(font).toMatch(/Arimo/i);
  });
});
