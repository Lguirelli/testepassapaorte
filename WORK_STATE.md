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
