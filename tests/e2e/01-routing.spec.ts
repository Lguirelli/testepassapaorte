import {test,expect} from '@playwright/test';

const routes:[string,string][]=[
  ['/','home'],
  ['/explorar','explore'],
  ['/parceiros','partner-acquisition'],
  ['/parceiros/cafe-neblina-alta','partner-detail'],
  ['/lugares/mirante-alto-da-serra','tourism-detail'],
  ['/roteiro','onboarding'],
  ['/viagens/demo-trip-001/roteiro','trip-route'],
  ['/viagens/demo-trip-001/calendario','calendar'],
  ['/meu-passaporte','passport'],
  ['/admin','admin'],
];

for(const [route,kind] of routes){
  test(`dynamic route scope ${kind}`,async({page})=>{
    await page.goto(route);
    await expect(page.locator('body')).toHaveAttribute('data-page',kind);
  });
}

test('explore, tourist points and map have distinct navigation state',async({page})=>{
  await page.goto('/explorar');
  await expect(page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Explorar',exact:true})).toHaveAttribute('aria-current','page');
  await page.goto('/explorar?relation=public_point');
  await expect(page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Pontos turísticos',exact:true})).toHaveAttribute('aria-current','page');
  await page.goto('/explorar?view=map');
  await expect(page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Mapa',exact:true})).toHaveAttribute('aria-current','page');
});
