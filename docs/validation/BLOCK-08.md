# BLOCK_REPORT: Bloco 08, merge seguro do LATEST com o Patch V10

## Objetivo

Usar `LATEST(1).zip` como nova fonte de estado do repositório e reaplicar somente os conceitos válidos do Patch V10 que estavam ausentes, sem substituir a arquitetura Drizzle/PGlite/PostGIS, o Admin, os módulos de roteiro ou os resultados válidos dos blocos anteriores.

## Comparação

Já existia no LATEST: registro manual de visita demo, evento `VISIT_CONFIRMED`, Passaporte responsivo em duas páginas/uma página, projeto Playwright com três viewports, PGlite de fallback, PostGIS no CI e persistência transacional da viagem.

Faltava no LATEST: motor procedural de carimbos, `visitNumber`, `stampSeed`, `stampSnapshot`, backfill das visitas existentes, renderização SVG real, preservação histórica do carimbo, efeito físico de virar página, scripts de Playwright UI/headed/debug e CI com gates independentes e artifacts por viewport.

Não foi copiado literalmente do V10: a API/repository da V9, a showcase estática e workflows de GitHub Pages. Esses arquivos pertenciam a uma arquitetura anterior e sobrescreveriam decisões válidas do LATEST. A integração foi refeita sobre `TripData`, Drizzle e os Server Actions já existentes.

## Implementado

- motor procedural em `src/features/stamps/`, integrado sem arquivo binário de fonte;
- alias de categorias do projeto para ícones coerentes do motor;
- geração automática de número, seed e snapshot no `confirmDemoVisit`;
- seed novo já persiste snapshots determinísticos;
- `scripts/backfill-stamps.ts` para dados existentes;
- `StampRenderer` usa snapshot persistido e fallback determinístico apenas para legado;
- proteção contra três carimbos consecutivos repetirem cor, layout ou forma;
- `Book` com página 3D, teclado e reduced motion;
- CI em dois gates, com quality/persistência antes de E2E PostGIS/Chromium em três viewports;
- Codespaces com portas 4173 e 9323 para aplicação e Playwright UI;
- testes unitários de carimbo e regressão E2E do page flip + persistência do carimbo.

## Validações executadas nesta montagem

PASS: transpile sintático de 24 arquivos TS/TSX alterados/adicionados; parse YAML do workflow; smoke isolado do motor gerando SVGs para café, natureza e cultura com ícones `coffee`, `trees` e `landmark`; nenhum SVG do smoke incorporou `@font-face`, `.woff` ou payload de fonte.

NÃO EXECUTADO após o merge: lint integral, typecheck integral, build Next, PostGIS real e suíte Playwright real. `npm ci --offline` foi tentado e parou porque `zod-validation-error-4.0.2.tgz` não existe no cache deste ambiente; isso não demonstra falha do lockfile. O GitHub Actions deve executar a validação completa após o push.

## Próximo passo

Aplicar o patch sobre o snapshot LATEST, fazer commit/push e acompanhar **Actions → Validation**. Se o gate `quality` passar, o matrix E2E inicia Chromium em desktop, tablet e mobile. Para inspeção interativa, usar Codespaces + `npm run pw:ui`.
