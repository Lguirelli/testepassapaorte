# Patch V11 — merge incremental sobre LATEST(1).zip

Este patch foi produzido por comparação direta com a versão `LATEST(1).zip` recebida em 2026-09-10.

## Regra de aplicação

Aplique **sobre a raiz exata do repositório correspondente ao LATEST(1).zip**. Extraia o conteúdo deste ZIP na raiz e permita substituir os arquivos com o mesmo caminho.

**Não aplique o Patch V10 depois deste V11.** O V11 reaproveita a arquitetura mais nova encontrada no LATEST e porta apenas as funcionalidades compatíveis do V10.

## O que entra

- motor procedural de carimbos integrado ao código da aplicação;
- criação automática de `visitNumber`, `stampSeed` e `stampSnapshot` ao registrar visita demo;
- preservação do snapshot histórico do carimbo;
- backfill idempotente para visitas existentes;
- seed novo já persistindo snapshots;
- renderização SVG real no Meu Passaporte;
- virada de página 3D no Passaporte, com teclado e `prefers-reduced-motion`;
- testes unitários do ciclo de carimbo e regressão E2E do Passaporte;
- pipeline único de GitHub Actions: quality/build/persistence -> Chromium + PostGIS em desktop/tablet/mobile;
- artifacts Playwright em cada viewport;
- Codespaces com Playwright UI na porta 9323.

## O que foi preservado do LATEST

Não foram substituídos por versões antigas do V10:

- repository/DB architecture atual baseada em Drizzle, Postgres/PostGIS e PGlite;
- Admin e fluxos editoriais atuais;
- rotas e páginas públicas atuais;
- design/tokens atuais do repositório;
- suíte Playwright existente, exceto a ampliação específica do Passaporte;
- estrutura atual de documentação e gates.

## Banco já existente

Em uma base criada antes deste patch, execute uma vez:

```bash
npm run db:backfill-stamps
```

O comando mantém snapshots já válidos e cria somente os ausentes.

## Validação local recomendada

```bash
npm ci --no-audit --no-fund
npm run lint
npm run typecheck
npm test
DB_MODE=pglite ALLOW_DEMO=true npm run db:migrate
DB_MODE=pglite ALLOW_DEMO=true npm run db:seed
DB_MODE=pglite ALLOW_DEMO=true npm run db:backfill-stamps
DB_MODE=pglite ALLOW_DEMO=true node --import tsx scripts/verify-persistence.ts
ALLOW_DEMO=true npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

## GitHub

Após commit/push, abra **Actions -> Validation**. O job de navegador só inicia se o gate `Quality + build + persistence` passar.

Em falha E2E, baixe o artifact `playwright-<viewport>-<run_id>` para consultar `playwright-report`, `test-results`, screenshots e traces.

## Ver a tela durante o teste

No GitHub Codespaces:

```bash
npm run dev
```

Abra a porta **4173** para ver a aplicação. Em outro terminal:

```bash
npm run pw:ui
```

Abra a porta **9323** para a Playwright UI. Ela permite acompanhar ações, snapshots do DOM, erros e traces interativamente.

Em uma máquina com interface gráfica também estão disponíveis:

```bash
npm run pw:headed
npm run pw:debug
```

## Observação sobre o motor de carimbos

O código procedural foi integrado sem distribuir arquivos de fonte. O renderer usa uma pilha de fallback e não embute payloads de fonte no SVG.

## Estado de validação desta montagem

Foram executados neste ambiente:

- comparação de arquivos com o LATEST;
- transpile/syntax check dos 24 arquivos TS/TSX adicionados ou alterados;
- parse dos arquivos JSON/YAML alterados;
- conferência de consistência das dependências declaradas com a raiz do `package-lock.json`;
- smoke do motor com três categorias, gerando SVGs válidos sem fonte embutida;
- inspeção para ausência de arquivos `.woff`, `.woff2`, `.ttf`, `.otf` e `.eot` na entrega.

O sandbox não possui o conjunto npm utilizável para executar Next/ESLint/Playwright do projeto integralmente. A regressão completa deve ser executada pelo workflow `Validation` após o push.
