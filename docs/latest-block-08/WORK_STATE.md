# WORK_STATE

Atualizado: 2026-09-11. Bloco atual: 08, integridade editorial e integração Admin concluídas. Bloco 07 preservado. Bloco 06 entregue com ZIP validado. Blocos 00–05 concluídos como checkpoints, com gates técnicos parciais documentados; não reiniciar.

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
09: matriz UI/PostGIS com Chromium e PostGIS disponíveis. Validar arquivo/categorias no navegador, três viewports e Axe. Não reiniciar projeto. Não contar os 11 cenários de integração como 51 casos E2E.

## Entrega atual
block_07.zip contém apenas arquivos relacionados à regressão; LATEST.zip contém fontes completas. O bloco 06 permanece em block_06.zip. Relatórios específicos em docs/validation/ e em cada pasta de entrega. Gates G1–G8 ainda parciais, sem promoção a produção.

## Bloco 08
Serviço transacional extraído, autorização permanece na server action. 11 cenários de integração PASS em PGlite em memória; 13 unitários, lint e typecheck PASS. Categorias desativadas/ordenadas corretamente, relações públicas de arquivos filtradas e restauração preserva estado arquivado até publicar. Compatibilidade do ícone legado do seed para perfil-relaxar. Comando: `node --import tsx scripts/verify-admin.ts`. Logs em artifacts/validation/block-08/. Nova tentativa de download não confirmou Chromium; Docker/PostGIS ausentes. Gate G4 tem cobertura de persistência ampliada, ainda sem aprovação E2E.

Entrega mais recente: deliveries/block_08.zip e deliveries/LATEST.zip. Pacotes 06/07 preservados. Snapshot completo possui 08 e todos os fontes anteriores, sem cache, dependências ou banco binário.
