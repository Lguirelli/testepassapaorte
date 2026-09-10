import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { expectNoHorizontalOverflow, watchPage } from './helpers';

const surfaces = [
  { name: 'home', route: '/' },
  { name: 'explorar', route: '/explorar' },
  { name: 'lugar', route: '/lugares/mirante-vale-das-araucarias' },
  { name: 'parceiro', route: '/parceiros/cafe-neblina-alta' },
  { name: 'onboarding', route: '/roteiro' },
  { name: 'roteiro', route: '/viagens/demo-trip-001/roteiro' },
  { name: 'calendario', route: '/viagens/demo-trip-001/calendario' },
  { name: 'passaporte', route: '/meu-passaporte' },
  { name: 'admin', route: '/admin' },
] as const;

for (const surface of surfaces) {
  test(`visual audit · ${surface.name}`, async ({ page }, testInfo) => {
    const errors = watchPage(page);
    await page.goto(surface.route, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const dir = path.join(
      process.cwd(),
      'artifacts',
      'visual-audit',
      testInfo.project.name,
    );
    await fs.mkdir(dir, { recursive: true });
    await page.screenshot({
      path: path.join(dir, `${surface.name}.png`),
      fullPage: true,
      animations: 'disabled',
    });

    expect(errors, `Erros detectados em ${surface.route}`).toEqual([]);
  });
}

test('visual audit · explorar após busca e filtro', async ({ page }, testInfo) => {
  const errors = watchPage(page);
  await page.goto('/explorar');
  const search = page.getByLabel('Busca');
  await search.fill('Café');
  await search.blur();
  await page.getByRole('button', { name: 'Parceiros' }).click();
  await expect(page.getByText('Café Neblina Alta')).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const dir = path.join(process.cwd(), 'artifacts', 'visual-audit', testInfo.project.name);
  await fs.mkdir(dir, { recursive: true });
  await page.screenshot({
    path: path.join(dir, 'explorar-filtrado.png'),
    fullPage: true,
    animations: 'disabled',
  });
  expect(errors).toEqual([]);
});
