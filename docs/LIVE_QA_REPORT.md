# Visual development
Date: 2026-09-13
Base commit: 7f05909678449e9d1a189f3d6ac296c7c8329fab
Branch: work/visual-development

The user deferred database implementation and authorized visual development.
APP_MODE defaults explicitly to visual; APP_MODE=database restores the existing persistent application.
Existing tourism and synthetic fixtures feed the canonical Next.js public pages.
Synthetic partners remain marked; fake contact links are omitted.
No migrations, seed, Supabase changes or TLS bypass were applied.
Health reports mode=visual, database=not_used and persistence=false. This is not database health.
Auth sessions are unavailable in visual mode. Existing database CI explicitly selects APP_MODE=database.
The route form previews up to three interest matches without persisting or claiming a completed itinerary.
Public page components, styling and interaction implementations are preserved.
Playwright visual CI builds Next.js with no database and tests routes, Axe, overflow, runtime errors and the route preview.
Run against Preview: BASE_URL=<preview> npx playwright test --config=playwright.visual.config.ts

Local terminal, browser and environment restart tools are not exposed in this Work session.
Local build, Playwright and visual inspection: NOT EXECUTED.
Remote CI and Vercel results: pending.
Authenticated pages, saved trips, QR registration and backend workflows remain outside visual acceptance.

## Retomada: validação do main atual, 2026-09-13

Este registro atualiza os estados antigos de ferramenta indisponível acima.
Base atual: `64d8ee9973645cfc5bd333436587a9ba8bdb7af0`.
Branch de validação: `work/current-visual-validation`.
Production: https://testepassapaorte-iota.vercel.app
Deployment Vercel: `dpl_Fk4tDNefeb6yPDHar2Xqww7dAYkq`, READY.

Evidências consultadas: GitHub Actions run `34778365458`.
- validate: PASS, incluindo build, typecheck, lint e unitários no CI.
- visual: PASS com 56 casos, 54 passaram de primeira, 2 passaram após retry.
- Os dois retries registraram contraste intermediário durante a animação de entrada do slider em dark mode.
- Correção no teste: aguardar a conclusão das animações finitas antes do Axe; nenhuma regra desabilitada, nenhuma violação filtrada além do nível critical/serious já existente.
- A suíte cobre oito rotas públicas, health, galeria com drag e geometria, roteiro, FAQ, menu, teclado, dark mode, reduced motion e larguras contínuas.
- Navegador cloud voltou a funcionar. Production abriu; próximo parceiro mudou a seleção; aba Natureza e FAQ responderam; overflow da Home medido em 0 px.
- Playwright standalone local: instalação do Chromium anteriormente falhou por timeout/502 e arquivo truncado. Nova tentativa em andamento. Não declarar execução local aprovada.
- Acrescentado job separado de smoke visual contra Production. Esse job valida o produto publicado, não a aplicação candidata da PR. O job visual local continua validando a candidata.
- Resultado remoto desta nova rodada: pendente.
- Banco permanece adiado; nenhuma migration/seed/alteração Supabase nesta rodada.
- A main já foi alterada externamente para Node 24.x; esta rodada preserva essa alteração existente e usa o package.json como referência do job remoto.

Ferramentas de apoio: Context7, documentação oficial do Playwright sobre baseURL/deployment; Building React Native Apps, princípio medir antes de otimizar. Aplicação permanece Next.js; não foram adicionadas dependências nativas ou otimizações sem medição.

Pendências comprovadas: estabilizar os dois retries de Axe, finalizar smoke remoto e classificar separadamente o E2E de persistência, que permanece fora da aceitação visual.
