import {test,expect} from '@playwright/test';

test('demo partner access rejects invalid credentials and requires login again after logout',async({page})=>{
 await page.goto('/area-parceiro/dados');
 await expect(page.getByRole('heading',{name:'Que bom ter você aqui.'})).toBeVisible();
 await page.getByRole('textbox',{name:'E-mail',exact:true}).fill('parceiro@passaporte.demo');
 await page.getByRole('textbox',{name:'Senha',exact:true}).fill('incorreta');
 await page.getByRole('button',{name:'Entrar no meu painel →'}).click();
 await expect(page.getByRole('alert')).toContainText('E-mail ou senha incorretos');
 await page.getByRole('textbox',{name:'Senha',exact:true}).fill('Serra2026!');
 await page.getByRole('button',{name:'Entrar no meu painel →'}).click();
 await expect(page.getByRole('heading',{name:'Resultados do seu negócio'})).toBeVisible();
 await page.getByRole('button',{name:'7 dias',exact:true}).click();
 await expect(page.locator('.db-metrics article').first()).toContainText('620');
 await page.getByRole('combobox',{name:'Métrica do gráfico'}).selectOption('visits');
 await expect(page.getByRole('img',{name:/Presenças: 37 no período/})).toBeVisible();
 await page.getByRole('link',{name:'Dados do negócio',exact:true}).click();
 await page.getByRole('textbox',{name:'Nome de apresentação'}).fill('Café de exemplo');
 await page.getByRole('button',{name:'Salvar demonstração'}).click();
 await expect(page.locator('.db-profile-preview h2')).toHaveText('Café de exemplo');
 await page.getByRole('button',{name:'Sair da conta →'}).click();
 await page.goto('/area-parceiro/dados');
 await expect(page.getByRole('heading',{name:'Que bom ter você aqui.'})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Nome de apresentação'})).toHaveCount(0);
});

test('admin review changes only the demonstrated partner state',async({page})=>{
 await page.goto('/gestao/parceiros');
 await page.getByRole('textbox',{name:'E-mail',exact:true}).fill('parceiro@passaporte.demo');
 await page.getByRole('textbox',{name:'Senha',exact:true}).fill('Serra2026!');
 await page.getByRole('button',{name:'Entrar na administração →'}).click();
 await expect(page.getByRole('alert')).toContainText('E-mail ou senha incorretos');
 await page.getByRole('textbox',{name:'E-mail',exact:true}).fill('admin@passaporte.demo');
 await page.getByRole('textbox',{name:'Senha',exact:true}).fill('AdminSerra2026!');
 await page.getByRole('button',{name:'Entrar na administração →'}).click();
 await page.getByRole('link',{name:'Parceiros',exact:true}).click();
 await page.getByRole('searchbox',{name:'Buscar parceiro'}).fill('inexistente');
 await expect(page.locator('.db-empty')).toContainText('Nenhum parceiro encontrado');
 await page.getByRole('button',{name:'Limpar filtros'}).click();
 await page.getByRole('combobox',{name:'Situação'}).selectOption('Em análise');
 await page.getByRole('button',{name:'Revisar →',exact:true}).click();
 await page.getByRole('button',{name:'Simular aprovação'}).click();
 await page.getByRole('combobox',{name:'Situação'}).selectOption('Ativo');
 await expect(page.getByRole('row').filter({hasText:'Ateliê da Serra'})).toContainText('Ativo');
 await page.getByRole('button',{name:'Sair da conta →'}).click();
 await page.goto('/gestao/conteudo');
 await expect(page.getByRole('button',{name:'Entrar na administração →'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Revisar conteúdo →'})).toHaveCount(0);
});
