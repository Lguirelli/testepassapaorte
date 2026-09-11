import {test,expect} from '@playwright/test';

const routes:[string,string][]=[
  ['/','home'],
  ['/explorar','explore'],
  ['/pontos-turisticos','tourist-index'],
  ['/mapa','map'],
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

test('main navigation uses independent dynamic URLs',async({page})=>{
  for(const [route,label] of [
    ['/explorar','Explorar'],
    ['/pontos-turisticos','Pontos turísticos'],
    ['/mapa','Mapa'],
    ['/parceiros','Para parceiros'],
  ] as const){
    await page.goto(route);
    await expect(page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:label,exact:true})).toHaveAttribute('aria-current','page');
  }
});
