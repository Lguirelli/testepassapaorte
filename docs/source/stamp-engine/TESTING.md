# Testes e validação

## Comandos

```sh
npm test
npm run typecheck
npm run lint
npm run test:visual
npm run build:engine
npm run build
```

O teste automatizado compila o núcleo para Node e roda node:test. A suíte cobre 100 reproduções idênticas, 1000 seeds, diversidade de forma/cor/layout, normalização, aliases, resolver, datas de todos os meses, fallbacks, paleta, sanitização, layouts compatíveis, ícone único, snapshots, SSR e antirrepetição sem alteração de registros históricos.

O teste de SSR confirma HTML idêntico e IDs distintos para duas instâncias do mesmo carimbo. A inspeção no navegador complementa esse teste para verificar hidratação efetiva.

`npm run test:visual` gera duas páginas temporárias em public/: qa-stamps.html e qa-responsive.html. Execute o servidor de desenvolvimento e abra essas páginas. A primeira contém 68 carimbos, distribuindo todas as 17 formas e 7 composições, textos longos e caracteres especiais. Ela verifica ícone único e caixas de textos retos dentro do contorno externo. Arcos e margens internas são inspecionados visualmente.

A segunda usa iframes com viewports de 320, 375, 390, 430, 1280, 1440 e 1920 px. O relatório compara scrollWidth e clientWidth, descontando corretamente a barra de rolagem. Isso testa os breakpoints CSS reais em Chrome, sem emular hardware móvel. Safari, Firefox e aparelhos físicos não foram testados.

No navegador foram verificados: edição, controles, busca de cachoeira, seleção de variações, SVG, PNG 2048 px, coleção com 50 carimbos e restauração após recarregar. O relatório de execução e eventuais limites ficam em VALIDATION.md. PERFORMANCE.json registra tempo de geração de strings SVG no Node, não FPS do navegador; DIVERSITY.json registra cobertura em 1000 seeds.

As páginas de QA são geradas para desenvolvimento e não integram a publicação final. Rode o comando novamente quando precisar delas. O script de montagem da entrega exclui as páginas temporárias e os diretórios de dependências/cache.
