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

## Validação de 2026-09-14

Esta seção atualiza as pendências históricas acima. O banco continua adiado por decisão do usuário; nenhuma migration, seed ou alteração de infraestrutura de banco foi executada nesta rodada.

- Base: `3017c4c667ee27660d9f20ee4f4a2e222fb86ee5`.
- Branch: `work/visual-validation-september14`.
- Correção: `d05b07ad74f3fd48f515cc156439f93d00af14c7`.
- PR: https://github.com/Lguirelli/testepassapaorte/pull/15
- CI da correção: https://github.com/Lguirelli/testepassapaorte/actions/runs/34793873612
- Production inspecionada: https://testepassapaorte-iota.vercel.app/
- Deployment de Production: `dpl_ActkynoWFxJUzSTwZXWWwpPe6Fok`, READY, commit base `3017c4c`.

### MEDIUM: teste de altura confundia layout com perspectiva

Os runs `34792418288` (main) e `34793272109` (outra branch) falharam no mesmo teste: a altura projetada de um card lateral era 183,481 px, abaixo do mínimo de 189 px. Os outros 52 casos E2E passaram em ambas as execuções.

A inspeção DOM no navegador da Production confirmou oito imagens com `offsetHeight=220`; os retângulos projetados eram 220, 202,104 ou 183,481 px conforme a posição na galeria. A escala/perspectiva explica a diferença, sem erro na altura de layout.

`tests/e2e/05-responsive.spec.ts` agora compara `offsetHeight`. Os limites de 189–221 px e diferença máxima de 1 px permanecem. A suíte `tests/visual/encontros.spec.ts` continua verificando os retângulos projetados, separação entre cards, blur, centralização, drag e hover. Nenhum CSS ou comportamento foi alterado para satisfazer o teste.

### Evidências executadas

- CI validate: PASS, incluindo instalação, auditoria estática, TypeScript, lint, testes unitários e build.
- CI visual: **68 PASS, 0 FAIL, sem retries**, Chromium, 2,8 minutos, job `103823107155`.
- Axe: nenhuma violação critical/serious nos casos auditados da suíte visual; isso não declara ausência de violações moderate/minor.
- Matriz visual: 1371×936, 347×844 com touch, 844×390 com touch e 887×700 com reduced motion. Resize de Home/mapa nas larguras 347, 529, 713, 887, 979, 1113 e 1371 px.
- Rotas auditadas: `/`, `/explorar`, `/mapa`, `/parceiros`, `/pontos-turisticos`, `/roteiro`, `/lugares/igreja-matriz-nossa-senhora-do-rosario`, `/parceiros/cafe-neblina-alta`; fluxo temporário até calendário e Passaporte. Health visual 200 verificado pelo Playwright do CI, com banco explicitamente não utilizado.
- A suíte captura console.error, pageerror e respostas HTTP >=400 nas páginas públicas. Screenshots de interações, dark mode e paleta ficam nos artifacts do run, juntamente com o relatório Playwright.
- TypeScript e lint também executados localmente: PASS; lint apresenta 8 warnings preexistentes, sem erros.
- Navegador cloud em Production: Home renderizada; próximo parceiro seleciona Bistrô Estação Verde; slider seleciona Natureza; FAQ abre; formulário de oito etapas gera roteiro sem login; carimbo simulado aparece no calendário; Passaporte abre sem login. Inspeção de screenshots da galeria e do roteiro realizada.
- Logs consultados no navegador apresentaram erros da extensão do próprio browser; não foram classificados como erros da aplicação.
- E2E da correção: **53 PASS, 47 SKIPPED, 0 FAIL**, sem retries, 5,1 minutos, job `103823280179`. A quantidade total coletada foi 100; os skips existentes não contam como casos aprovados. O teste de altura anteriormente falho passou.

### HIGH: nova Preview bloqueada pela cota Vercel

O status Vercel do commit `d05b07a` retornou literalmente `Deployment rate limited — retry in 24 hours.` Nenhum deployment foi criado para esse commit. A Production inspecionada corresponde à base, não à correção candidata. Não foi solicitado upgrade pago nem tentado contornar a cota.

A validação remota do commit candidato e sua aceitação de deployment permanecem bloqueadas. O job remoto de Production do workflow atual executa apenas em main ou workflow_dispatch; não foi executado nesta PR. Os resultados remotos históricos não substituem essa pendência.

### Limitações locais e configuração preservada

Playwright standalone local permanece bloqueado pela instalação do Chromium, que retornou timeout/502 e download truncado. Chromium e Playwright executaram efetivamente no GitHub Actions; a navegação cloud foi uma verificação adicional. A tentativa de abrir `/health` no browser cloud retornou `ERR_BLOCKED_BY_CLIENT`, sem evidência de falha do servidor; não foi considerada aprovação de health remoto.

Node 24.x já estava na base externa e foi preservado, sem mudança de versão nesta rodada. Nenhuma dependência foi adicionada. Context7 e Building React Native Apps foram consultados anteriormente como apoio; a aplicação canônica continua Next.js.

## Revisão do header e continuidade pelo GitHub, 2026-09-14

O usuário dispensou temporariamente a Vercel e pediu continuidade das correções e aplicação no GitHub. A Preview deixa de ser gate desta etapa; nenhuma validação remota nova é alegada.

- LOW: seletor de aparência cortava o rótulo no header. Inspeção na versão publicada confirmou largura máxima de 88 px, fonte de 16 px e padding horizontal de 10,4 px por lado.
- Commit `4f450535145a410965928a23f1f20e27675e3137`: permite largura intrínseca do seletor e antecipa a navegação compacta de 1120 para 1180 px para acomodar os controles. Os três blocos CSS relacionados mantêm o mesmo breakpoint.
- Teste novo verifica espaço para todos os rótulos e ausência de sobreposição com o Dock em 1181, 1200 e 1371 px.
- CI: https://github.com/Lguirelli/testepassapaorte/actions/runs/34795005384
- Validate: PASS, incluindo static, TypeScript, lint, unitários e build.
- Visual: **72 PASS**, sem retries, 2,9 minutos, job `103826263415`. Axe critical/serious = 0 nos casos auditados.
- E2E: **53 PASS, 47 SKIPPED, 0 FAIL**, sem retries, 8,3 minutos, job `103826469851`. Skips existentes dependem de projeto/input e não representam testes aprovados.
- TypeScript e lint locais: PASS, com os mesmos oito warnings preexistentes. O processo de build local perdeu seu identificador; somente o build efetivamente concluído no CI é considerado aprovado.
- Nenhuma alteração de banco, framework, dependências ou conteúdo. Alterações externas na main, inclusive a camada GitHub Pages, serão preservadas no merge.

## Navegação: resize e foco, 2026-09-14

A PR #15 foi integrada por merge normal em `e101e206a08cde5637849fa92045d3356465f61c`, preservando a main externa `8b4a722`. A auditoria estática da base consolidada passou localmente.

PR desta rodada: https://github.com/Lguirelli/testepassapaorte/pull/18

- MEDIUM, `fad6002c04dfa57d7327b3384e21532af73bba69`: o menu compacto escondido pelo CSS após resize mantinha o estado modal e `body.style.overflow=hidden`. ResizeObserver agora fecha o menu ao desaparecer o trigger e leva o foco ao link atual do Dock. Cleanup desconecta o observer e cancela o frame inicial de foco. Playwright verifica abertura, resize, liberação do scroll, foco e retorno à largura compacta.
- `999db6cff4c6ca747b98d0cf61d43a5d880fcca0`: smoke da Vercel disponível somente por workflow_dispatch com `validate_production=true`. As verificações locais e do CI continuam automáticas. Mudança solicitada pelo usuário ao dispensar a Vercel temporariamente.
- MEDIUM, `0d0765474b216e475364ca9b6b4821ccce6df032`: o foco das abas do slider era adiado por requestAnimationFrame e podia capturar o teclado depois de o usuário avançar ao FAQ. Como as abas permanecem montadas, o foco agora é imediato. Teste reproduz dois eventos no mesmo frame e verifica foco/Enter no FAQ após os frames seguintes.
- Evidência anterior à correção de foco: run `34822910648`, 75 casos visuais aprovados e 1 flaky no FAQ. O teste novo de menu passou nos quatro projetos. Esse resultado não foi tratado como execução sem retries.
- TypeScript e lint locais passaram; oito warnings preexistentes permanecem.
- CI final: https://github.com/Lguirelli/testepassapaorte/actions/runs/34823505768 , commit `0d07654`. Validate PASS, incluindo build. Visual: **80 PASS, sem retries**, 2,9 minutos, job `103910210449`; Axe critical/serious = 0 nos casos auditados. Os testes novos de resize e foco passaram nos quatro projetos. E2E: **53 PASS, 47 SKIPPED, 0 FAIL**, sem retries, 7 minutos, job `103910518831`. Smoke remoto corretamente SKIPPED nesta execução de PR.
- Nenhuma consulta, migration ou seed em banco externo. Nenhum deployment Vercel foi usado como gate desta etapa.
