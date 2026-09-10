# Conteúdo do pacote

## Entrega principal: demonstração funcional

- `demo/index.html`: entrada da versão navegável;
- `demo/app.js`: navegação e interações do protótipo;
- `demo/data.js`: conteúdo sintético de demonstração;
- `demo/styles.css`: layout responsivo e temas;
- `demo/assets/`: Icon System v2 e placeholders usados pela interface;
- `.github/workflows/pages.yml`: publicação da pasta `demo/` no GitHub Pages.

A demonstração funciona como site estático, sem PostgreSQL, PostGIS, credenciais ou backend externo. O estado de roteiro, Passaporte e Admin é mantido no navegador para permitir validação visual e funcional pelo GitHub Pages.

## Base técnica preservada

O restante do repositório mantém integralmente a implementação e as evidências acumuladas até o Bloco 08 PARCIAL, incluindo Next.js, Drizzle, seeds, testes, Playwright, CI, documentação de arquitetura e relatórios. A criação da demo navegável não promove os gates técnicos existentes nem inicia o Bloco 09.
