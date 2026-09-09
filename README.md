# Passaporte Serra Negra — Validation V1

Repositório de validação incremental do Passaporte Serra Negra. Esta build **não é o MVP final**: ela valida arquitetura, fluxos públicos, Admin operacional, roteiro, calendário, Passaporte e integração do motor de carimbos com conteúdo exclusivamente sintético.

## O que existe

- Next.js App Router + TypeScript strict.
- Monólito modular com contratos de providers e repository.
- Persistência `local` determinística por padrão e adapter PostgreSQL/PostGIS.
- Drizzle schema + migration SQL + seed idempotente.
- Home, Explorar, Lugar, Parceiro, onboarding, roteiro, calendário e Passaporte.
- Admin com `draft → preview → publish → history`.
- Icon System v2 fornecido como fonte oficial de ícones.
- Motor procedural de carimbos fornecido, integrado via `StampRenderer`.
- Tracking local de eventos de validação.
- Playwright desktop/tablet/mobile, incluindo reduced motion e axe.
- GitHub Actions para qualidade e E2E com PostGIS.

## Requisitos

- Node.js >= 22.13 (CI usa 22.16).
- npm compatível com o lockfile.
- Para Postgres real: Docker + Docker Compose, ou PostgreSQL com PostGIS acessível.

## Execução rápida sem credenciais

```bash
cp .env.example .env.local
npm ci
npm run db:reset-local
npm run dev
```

Abra `http://localhost:3000`. O modo padrão usa `PERSISTENCE_MODE=local` e providers mock. O banner `Modo de validação — conteúdo fictício` deve permanecer visível.

## PostgreSQL/PostGIS

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
PERSISTENCE_MODE=postgres npm run dev
```

A migration habilita PostGIS e cria o schema **v0 de validação**, que não deve ser tratado como modelo definitivo.

## Validação

```bash
npm run validate:repo
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Para usar Chromium já instalado:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

## Fallback visual offline

Se a instalação npm não estiver disponível, os scripts abaixo geram uma prévia estática a partir dos mesmos seeds/tokens e executam Chromium em três viewports. Isso **não substitui** a suíte Next/Playwright.

```bash
python3 scripts/static_preview.py
python3 scripts/run_static_visuals.py
```

## Arquitetura

Veja `docs/VALIDATION_ARCHITECTURE.md` e os ADRs em `docs/decisions/`.

## Dados e limites

Todos os lugares, parceiros, experiências, eventos, contatos, clima, visitas e métricas desta build são fictícios. O mapa territorial definitivo e integrações externas não são implementados. Nenhuma conclusão jurídica de LGPD é feita. A identidade visual final permanece propositalmente indefinida.

## Relatório

`VALIDATION_REPORT.md` registra o que foi implementado, o que foi realmente executado no ambiente de montagem, os gates e as pendências de infraestrutura.
