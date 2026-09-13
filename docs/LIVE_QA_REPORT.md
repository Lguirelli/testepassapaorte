# Live QA Report — Passaporte Serra Negra

Atualizado em: 2026-09-13

## Escopo

Branch de trabalho: `work/live-runtime-uxui-fix`

Objetivo da rodada: remover a queda global da Home quando o PostgreSQL estiver ausente, vazio ou temporariamente indisponível, preservar a exigência de banco para fluxos autenticados/escrita e validar a experiência pública em Preview Vercel com Playwright.

## Diagnóstico

A Home executava `publicDataset()` sem degradação controlada. `publicDataset()` chamava diretamente o dataset relacional e a camada de banco lança erro em produção quando `DATABASE_URL` não está disponível. A exceção chegava ao Error Boundary global e produzia a tela "Falha temporária".

Classificação: HIGH.

## Correção aplicada

- leitura pública possui fallback somente leitura para `seed/tourism-real.json`;
- fallback contém somente catálogo turístico canônico pesquisado;
- nenhuma relação comercial/partner é inferida;
- conteúdo demo, experiências e eventos sintéticos não entram no fallback;
- Admin, autenticação, escrita e demais fluxos dependentes de persistência continuam estritos ao banco;
- logs de fallback são sanitizados e não serializam erro, secrets ou connection strings;
- dataset vazio também ativa o fallback para evitar uma Home sem conteúdo após banco recém-criado sem seed.

## Regressão automatizada

- teste unitário garante catálogo real, ausência de parceiros inventados e ausência de conteúdo sintético no fallback;
- teste Playwright da superfície pública reprova a presença de "Falha temporária" e "Não foi possível carregar";
- teste Playwright monitora `pageerror` e erros de console;
- Axe continua exigindo zero violações `critical` e `serious` na superfície pública;
- runner remoto agora aceita URL compartilhada de Preview Vercel e inicializa a sessão protegida antes da suíte.

## Vercel

Commit da primeira correção de runtime: `5134a6aa097d1a4fcdf147acb1c17dd2949df592`

Deployment: `dpl_5zNVKWe8k5AqMojPB8iBs1NvTBpY`

Preview: `https://testepassapaorte-e4778hz6q-guirellilorenzo1-3182s-projects.vercel.app`

Estado observado: `READY`.

Runtime error clusters no intervalo consultado: nenhum encontrado.

A Preview está protegida por Vercel Authentication. O runner remoto suporta bootstrap por `_vercel_share` para browser QA sem desabilitar a proteção permanentemente.

## Estado da rodada

- [x] causa da tela de erro identificada no código
- [x] fallback público canônico implementado
- [x] Vercel Preview da primeira correção chegou a READY
- [x] regressão unitária adicionada
- [x] regressão Playwright adicionada
- [x] suporte Playwright para Preview protegida adicionado
- [ ] Preview do commit consolidado chegar a READY
- [ ] GitHub CI completo
- [ ] Playwright + Axe do PR
- [ ] inspeção remota da Preview consolidada
- [ ] validação `/health` e definição do estado real do PostgreSQL
- [ ] aprovação para merge em `main`

## Observação de banco

O fallback não substitui PostgreSQL. Ele garante continuidade da descoberta pública. `/health` deve continuar retornando indisponibilidade enquanto o banco real não estiver conectado e operacional; isso é intencional para não mascarar falha de infraestrutura.
