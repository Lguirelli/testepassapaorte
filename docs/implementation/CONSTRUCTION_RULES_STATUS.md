# Aplicação das regras de construção — demo estática

Esta revisão aplica as regras recebidas somente onde elas são compatíveis com a demonstração estática do GitHub Pages e evita simular recursos de produção.

## Aplicado nesta entrega

- logo oficial fornecido pelo usuário, preservado sem alteração no SVG e usado no Header/Footer/favicon;
- Política de Privacidade, Termos de Uso, Cookies/armazenamento e Acessibilidade refletindo apenas o comportamento real desta demo;
- nenhuma ferramenta externa de analytics, publicidade, mapa, embed ou CRM carregada;
- nenhum banner de cookies artificial, pois não existem cookies opcionais nesta build;
- dados demo permanecem sintéticos e contatos externos continuam bloqueados;
- 404 útil com busca e caminhos principais;
- títulos e meta descriptions atualizados por rota;
- Open Graph básico e ícone da marca;
- breadcrumbs nas páginas hierárquicas de lugar e parceiro;
- `robots.txt` configurado para não indexar a validação;
- navegação por teclado, foco, reduced motion e labels preservados;
- CTA principal continua acima da dobra;
- FAQ principal mantém cinco perguntas reais sobre o funcionamento desta própria demo.

## Deliberadamente não simulado

- Clerk e RBAC real: GitHub Pages é estático e não possui backend seguro. O Admin permanece explicitamente como simulador local. Em produção, autorização precisa existir no frontend e no backend.
- Política de reembolso: não há venda, assinatura, pagamento ou reserva real nesta demo.
- consentimento de cookies: não há cookies opcionais ou trackers externos ativos.
- LocalBusiness schema: os estabelecimentos atuais são sintéticos, então não devem receber dados estruturados como negócios reais.
- reviews/prova social: nenhuma avaliação falsa foi criada.
- dados jurídicos do operador: não foram fornecidos e não foram inventados.
- fotografias reais: a demo continua com mídia ilustrativa/sintética, sem atribuir banco de imagem ou pessoa fictícia a um negócio real.

## Antes de produção

A versão de produção deve reavaliar autenticação/RBAC, APIs, fornecedores, analytics, cookies, política jurídica, dados do operador, direitos autorais, SEO indexável, LocalBusiness schema e fotografias reais quando os dados definitivos existirem.
