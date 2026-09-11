# ESTADO ATUAL — MIGRAÇÃO DINÂMICA

Atualizado em 2026-09-11. A arquitetura foi consolidada: **Next.js em `src/` é agora o único runtime**. A antiga SPA estática da raiz, seus CSS/JS, redirects HTML e o deploy GitHub Pages foram removidos. Rotas oficiais estão em `src/core/routing/routes.ts`; classificação de páginas em `src/core/routing/page-kind.ts`; detalhes em `docs/DYNAMIC_ARCHITECTURE.md`.

As seções abaixo permanecem apenas como histórico dos checkpoints anteriores e não devem ser interpretadas como arquitetura vigente.

---

# Checkpoint atual: Bloco 08 PARCIAL

Baseline local concluída; Validation V1 NÃO fechada. Próxima ação: continuar Bloco 08. Blocos 09–12 não iniciados. Nenhuma mudança de produto, seed ou lockfile nesta sessão.

## Evidência desta execução
Lint, typecheck, 13 unitários, persistência PGlite, build e migração/seed PASS. Smoke HTTP: nove rotas 200. Playwright: 51 tentativas, 51 falhas de inicialização, zero corpos executados. Chromium indisponível; download com timeout. Docker/PostgreSQL/PostGIS ausentes; apt-get falhou por permissões. Sem nova inspeção visual ou Axe. G0 PASS; G1–G8 PARCIAL.

## Continuação exata
Executar PostGIS real e Chromium, ampliar/executar CRUD/status das seis entidades e demais fluxos requeridos, corrigir apenas defeitos comprovados, inspecionar screenshots/acessibilidade e reempacotar Bloco 08 antes do checkpoint visual. Consultar docs/validation/BLOCK-08.md e artifacts/block_08/.

## Artefatos
Entregas desta sessão: deliveries/block_08.zip e deliveries/LATEST.zip. SHA-256 de ambos no DELIVERY_RECEIPT.json externo e na cópia externa deste WORK_STATE.md, gerados após fechar os ZIPs para evitar hash circular. ZIP íntegro não significa gate aprovado. Base recebida sem Git; SHA-256: f758bed53abb8d8ac0664f52efa156d0f4f2618d25281d8fb5a5032ade2f25e7.

## Histórico preservado do Bloco 07

# WORK_STATE

Atualizado: 2026-09-10. Bloco atual: 07, regressão e entrega consolidadas. Bloco 06 entregue com ZIP validado. Blocos 00–05 concluídos como checkpoints, com gates técnicos parciais documentados; não reiniciar.

## Decisões permanentes
Next.js App Router, React, TypeScript strict, Drizzle/PostgreSQL/PostGIS; monólito modular. Dados fictícios, sem branding final. Icon System v2 fornecido. Providers mock substituíveis; sem autenticação real, QR, reservas, pagamentos, motor oficial de carimbos ou mapa territorial. PGlite é fallback explícito sem PostGIS. Preservar os arquivos de referência em reference/ e documentação existente.

## Estado técnico e validações
Home, Explorar, lugares/parceiros, Admin operacional, onboarding, roteiro determinístico, calendário e Passaporte implementados. Lint, typecheck e 13 testes unitários passaram. Fluxos cloud de Admin (draft/preview/publicação/audit), roteiro (geração/movimento/fixado), calendário e Passaporte verificados em 1363×936. CI e testes E2E de três viewports preparados, não executados. PostGIS ainda pendente. Build completo final PASS. Persistência isolada PASS: 30 conteúdos, 1 viagem, idempotência e edição preservada. 51 casos E2E enumerados; smoke falhou antes do corpo por Chromium ausente. Logs em artifacts/validation/.

## Arquivos principais
README.md; package.json/package-lock.json; src/app/; src/modules/; src/core/db/; drizzle/; seed/; public/; docs/decisions/; docs/validation/; tests/; artifacts/playwright/; scripts/deliver-block.py. Entregas antigas passaporte-bloco-00.zip a passaporte-bloco-05.zip preservadas. Nova regra: deliveries/block_XX, ZIP delta, LATEST completo, relatórios e manifests.

## Dependências e comandos
Node 24, npm, Docker Compose para PostGIS. `npm ci`; copiar `.env.example` para `.env.local`; `docker compose up -d`; `npm run db:migrate`; `npm run db:seed`; `npm run dev`. Sem Docker: definir DB_MODE=pglite, ALLOW_DEMO=true, executar migrate e seed com servidor parado. Não abrir o mesmo banco PGlite em dois processos. `npm run lint`; `npm run typecheck`; `npm test`; `ALLOW_DEMO=true npm run build`; `npx playwright install chromium`; `npm run test:e2e`.

## Continuidade dos dados
Snapshot distribui seed sintético reproduzível, não o diretório binário do banco. Edições cloud são evidências nos relatórios/screenshots, não conteúdo canônico do seed. Checkouts novos iniciam nos fixtures originais. Não alegar reprodução idêntica de dados transitórios.

## Problemas abertos
PostGIS/Docker e Chromium standalone indisponíveis na execução anterior. G1–G7 parciais. i18n parcialmente extraído; esquema v0 JSONB com relações na aplicação; CRUD completo das seis entidades e matriz responsiva ainda exigem regressão E2E. Não conectar APIs reais nem publicar sem escopo explícito.

## Próximo bloco recomendado
08: executar regressão completa com Chromium e PostGIS; completar CRUD/arquivo/relações e três viewports, corrigir defeitos e atualizar gates. Relatório final em VALIDATION_REPORT.md. Não reiniciar o projeto. Conferir ZIP atual antes de avançar. Pacotes devem ter CRC válido e SHA-256 de todos os arquivos, sem caches/segredos/dependências reinstaláveis.

## Entrega atual
block_07.zip contém apenas arquivos relacionados à regressão; LATEST.zip contém fontes completas. O bloco 06 permanece em block_06.zip. Relatórios específicos em docs/validation/ e em cada pasta de entrega. Gates G1–G8 ainda parciais, sem promoção a produção.


## GitHub Pages na raiz

A demonstração funcional foi movida de `demo/` para a raiz do repositório. `index.html`, `app.js`, `data.js`, `styles.css`, `404.html`, `.nojekyll` e `assets/` passam a ser a entrada de publicação. Esta é uma alteração de empacotamento/apresentação e não muda o estado PARCIAL do Bloco 08.

## Checkpoint de apresentação visual v2

Aplicada uma camada visual e modular sobre a demonstração GitHub Pages, sem alterar seed, banco ou contratos de produção. Home e página pública de parceiro foram reconstruídas segundo o Guia de Construção Visual v2. A Home usa um `sectionRegistry` local para 12 seções configuradas. Foi adicionada a rota `#/para-parceiros` e o Public Shell passou a expor a navegação prevista no guia.

A superfície Pages continua na raiz (`index.html`, `app.js`, `data.js`, `styles.css`, `visual-v2.css`, `assets/`). As referências visuais não são exibidas como conteúdo final. A ausência de fotografia final, galeria de parceiro e FAQ estruturado continua sendo tratada sem inventar dados.

Validação desta camada: `node --check` PASS; smoke estático de 8 rotas PASS; ícones referenciados 0 ausentes. Browser smoke autocontido PASS para Home e Parceiro em desktop 1440×1100 e mobile 390×844, com interações e ausência de overflow horizontal verificadas. Capturas estão em `artifacts/visual-v2/`. Os gates G1–G8 do Bloco 08 permanecem PARCIAIS porque essa validação não substitui a suíte E2E/PostGIS original.


## Correção de paleta — 2026-09-10

A camada Visual v2 foi corrigida para usar a paleta principal oficial em grandes superfícies, header, fundos, textos, bordas e CTA. O verde deixou de ser tratado como identidade global. A paleta complementar permanece disponível apenas em usos contextuais por nicho, como categorias, mídia ilustrativa, chips, pinos, carimbos e pequenos destaques. Light/Dark/System foram alinhados aos tokens fornecidos pelo usuário.


## Logo oficial + regras de construção (2026-09-10)

O SVG `Ativo 2logo passaporte.svg` foi incorporado sem alteração de conteúdo e usado na marca do Header/Footer e favicon. Foram aplicadas à demo estática as regras compatíveis de transparência, privacidade, cookies, acessibilidade, 404, títulos/meta descriptions, breadcrumbs e robots. RBAC/Clerk permanece requisito de produção e não é falsamente simulado no GitHub Pages.
