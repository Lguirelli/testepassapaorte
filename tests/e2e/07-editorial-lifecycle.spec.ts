import {test,expect,type Page} from '@playwright/test';
async function login(page:Page){await page.goto('/admin');if(await page.getByRole('button',{name:'Entrar no Admin demo'}).isVisible())await page.getByRole('button',{name:'Entrar no Admin demo'}).click();await expect(page.getByRole('heading',{name:'Admin operacional',level:1})).toBeVisible();}
async function save(page:Page){await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();await expect(page.getByText('Rascunho salvo. O público permanece na versão publicada.',{exact:true})).toBeVisible();}
async function publish(page:Page){await page.getByRole('button',{name:'Publicar',exact:true}).click();await expect(page.getByText('Conteúdo publicado.',{exact:true})).toBeVisible();await page.reload();}
test('category visibility changes only after publication',async({page,context},info)=>{
 await login(page);const publicPage=await context.newPage();
 await page.goto('/admin/categorias/cat-bem-estar');const enabled=page.getByRole('combobox',{name:'Habilitada',exact:true});const original=await enabled.inputValue();
 try{
  await enabled.selectOption('false');await save(page);await publicPage.goto('/explorar');
  if(original==='true')await expect(publicPage.getByRole('link',{name:'Bem-estar',exact:true})).toBeVisible();
  await publish(page);await publicPage.reload();await expect(publicPage.getByRole('link',{name:'Bem-estar',exact:true})).toHaveCount(0);
  await expect(page.getByRole('textbox',{name:'Ícone semântico'})).toHaveValue('perfil-relaxar');
  await page.screenshot({path:`artifacts/playwright/${info.project.name}/07-category.png`,fullPage:true});
 }finally{await page.goto('/admin/categorias/cat-bem-estar');await page.getByRole('combobox',{name:'Habilitada',exact:true}).selectOption(original);await save(page);await publish(page);await publicPage.close();}
});
test('archived partner stays hidden after editing until explicitly published',async({page,context},info)=>{
 await login(page);const publicPage=await context.newPage();await page.goto('/admin/parceiros/partner-cafe-neblina');
 try{
  await page.getByRole('button',{name:'Arquivar',exact:true}).click();await expect(page.getByText('Conteúdo arquivado.',{exact:true})).toBeVisible();
  await publicPage.goto('/explorar');await expect(publicPage.getByRole('link',{name:'Café Neblina Alta',exact:true})).toHaveCount(0);
  await save(page);await publicPage.reload();await expect(publicPage.getByRole('link',{name:'Café Neblina Alta',exact:true})).toHaveCount(0);
  await page.screenshot({path:`artifacts/playwright/${info.project.name}/07-archived-partner.png`,fullPage:true});
  await publish(page);await publicPage.reload();await expect(publicPage.getByRole('link',{name:'Café Neblina Alta',exact:true}).first()).toBeVisible();
 }finally{await page.goto('/admin/parceiros/partner-cafe-neblina');await publish(page);await publicPage.close();}
});
