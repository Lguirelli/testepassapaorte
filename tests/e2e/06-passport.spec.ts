import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('G7 passport book is responsive and distinguishes evidence', async ({ page }, info) => {
  await page.goto('/meu-passaporte');
  await expect(page.getByRole('heading', { name: 'Meu Passaporte', level: 1 })).toBeVisible();
  await expect(page.locator('.book-page:visible')).toHaveCount(info.project.name === 'mobile' ? 1 : 2);
  await page.getByRole('button', { name: 'Próxima página', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Página anterior', exact: true })).toBeEnabled();
  await page.getByLabel('Capítulo do Passaporte', { exact: true }).selectOption({ label: '4. Marcas da viagem' });
  await expect(page.locator('[data-stamp-generated]').first()).toBeVisible();
  await expect(page.locator('.tourism-stamp svg').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: `artifacts/playwright/${info.project.name}/06-passaporte.png`, fullPage: true });
  await page.getByRole('combobox', { name: 'Aparência', exact: true }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({ path: `artifacts/playwright/${info.project.name}/06-passaporte-dark.png`, fullPage: true });
});

test('desktop page turn animates and a confirmed demo visit persists an automatic stamp', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Mutation and 3D page-turn are validated once on desktop.');
  await page.goto('/meu-passaporte');

  const next = page.getByRole('button', { name: 'Próxima página', exact: true });
  await next.click();
  await expect(page.locator('[data-page-turn]')).toBeVisible();
  await expect(page.locator('[data-page-turn]')).toBeHidden({ timeout: 2_000 });

  await page.getByText('Registrar visita de demonstração', { exact: true }).click();
  await page.getByLabel('Lugar da visita demo').selectOption('place-centro-cultural');
  await page.getByLabel('Data da visita demo').selectOption('2026-09-13');
  await page.getByRole('button', { name: 'Salvar registro demo', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('carimbo gerado automaticamente');

  await page.getByLabel('Capítulo do Passaporte').selectOption({ label: '5. Marcas da viagem' });
  const persisted = page.locator('[data-stamp-generated="snapshot"]').filter({ hasText: 'Centro Cultural Estação da Serra' });
  await expect(persisted).toBeVisible();
  await expect(persisted.locator('.tourism-stamp svg')).toBeVisible();
});
