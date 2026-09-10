# WORK_STATE

Atualizado: 2026-09-10. Bloco atual: 08, merge seguro do LATEST com carimbos automáticos, page flip e CI revisado. Blocos 00–07 permanecem preservados como checkpoints; não reiniciar nem sobrescrever decisões válidas.

## Decisões permanentes
Next.js App Router, React, TypeScript strict, Drizzle/PostgreSQL/PostGIS; monólito modular. Dados fictícios, sem branding final. Icon System v2 fornecido. Providers mock substituíveis; sem autenticação real, QR, reservas, pagamentos ou mapa territorial. O motor procedural de carimbos fornecido foi integrado no Bloco 08; ele não valida presença nem substitui as regras futuras de QR/antifraude. PGlite é fallback explícito sem PostGIS. Preservar os arquivos de referência em reference/ e documentação existente.

## Estado técnico e validações
Home, Explorar, lugares/parceiros, Admin operacional, onboarding, roteiro determinístico, calendário e Passaporte implementados. Lint, typecheck e 13 testes unitários passaram. Fluxos cloud de Admin (draft/preview/publicação/audit), roteiro (geração/movimento/fixado), calendário e Passaporte verificados em 1363×936. CI e testes E2E de três viewports preparados, não executados. PostGIS ainda estava pendente no Bloco 07. Build completo e persistência isolada daquele checkpoint permaneceram PASS histórico. O Bloco 08 altera o caminho do Passaporte e exige nova regressão remota: carimbos agora persistem `visitNumber`, `stampSeed` e `stampSnapshot`; o livro possui page flip 3D. A validação sintática e o smoke isolado do motor passaram, mas lint/typecheck/build/Playwright completos do estado pós-merge ainda precisam rodar no GitHub Actions.

## Arquivos principais
README.md; package.json/package-lock.json; src/app/; src/modules/; src/core/db/; drizzle/; seed/; public/; docs/decisions/; docs/validation/; tests/; artifacts/playwright/; scripts/deliver-block.py. Entregas antigas passaporte-bloco-00.zip a passaporte-bloco-05.zip preservadas. Nova regra: deliveries/block_XX, ZIP delta, LATEST completo, relatórios e manifests.

## Dependências e comandos
Node 24, npm, Docker Compose para PostGIS. `npm ci`; copiar `.env.example` para `.env.local`; `docker compose up -d`; `npm run db:migrate`; `npm run db:seed`; `npm run dev`. Sem Docker: definir DB_MODE=pglite, ALLOW_DEMO=true, executar migrate e seed com servidor parado. Não abrir o mesmo banco PGlite em dois processos. `npm run lint`; `npm run typecheck`; `npm test`; `ALLOW_DEMO=true npm run build`; `npx playwright install chromium`; `npm run test:e2e`.

## Continuidade dos dados
Snapshot distribui seed sintético reproduzível, não o diretório binário do banco. Edições cloud são evidências nos relatórios/screenshots, não conteúdo canônico do seed. Checkouts novos iniciam nos fixtures originais. Não alegar reprodução idêntica de dados transitórios.

## Problemas abertos
PostGIS/Docker e Chromium standalone indisponíveis na execução anterior. G1–G7 parciais. i18n parcialmente extraído; esquema v0 JSONB com relações na aplicação; CRUD completo das seis entidades e matriz responsiva ainda exigem regressão E2E. Não conectar APIs reais nem publicar sem escopo explícito.

## Próximo bloco recomendado
08: patch implementado; executar o workflow `Validation` no GitHub para regressão completa com Chromium e PostGIS em três viewports. Depois, completar CRUD/arquivo/relações ainda pendentes e atualizar gates. Relatório final em VALIDATION_REPORT.md. Não reiniciar o projeto. Conferir ZIP atual antes de avançar. Pacotes devem ter CRC válido e SHA-256 de todos os arquivos, sem caches/segredos/dependências reinstaláveis.

## Entrega atual
O snapshot recebido `LATEST(1).zip` é a base do Bloco 08. O patch incremental gerado contém somente arquivos novos/modificados do merge; os blocos anteriores permanecem preservados em `docs/validation/`. Gates G1–G8 continuam parciais até o novo workflow remoto passar.
