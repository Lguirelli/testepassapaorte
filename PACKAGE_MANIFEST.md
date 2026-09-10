# Conteúdo do pacote

## Entrega principal: site funcional na raiz

A demonstração do Passaporte Serra Negra agora fica diretamente na raiz do repositório, de modo que o GitHub Pages encontre `index.html` como entrada principal sem transformar o `README.md` em página do site.

Arquivos publicados:

- `index.html`: entrada da versão navegável;
- `404.html`: fallback da aplicação estática;
- `app.js`: navegação e interações;
- `data.js`: conteúdo sintético da demonstração;
- `styles.css`: layout responsivo e temas;
- `assets/`: Icon System v2 e placeholders;
- `.nojekyll`: impede processamento Jekyll;
- `.github/workflows/pages.yml`: empacota esses arquivos da raiz e publica no GitHub Pages.

A antiga pasta `demo/` foi removida para evitar duas fontes concorrentes da mesma interface.

## Base técnica preservada

O restante do repositório continua preservando a implementação Next.js/Drizzle, seeds, testes, Playwright, CI, documentação e evidências acumuladas até o Bloco 08 PARCIAL. A mudança desta entrega é somente de publicação/entrada do GitHub Pages e não promove os gates técnicos.
