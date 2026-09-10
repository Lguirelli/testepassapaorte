# Inventário estático da implementação

Data: 2026-09-10. Este inventário descreve o que existe no snapshot; não transforma presença de código em validação executada.

## Aplicação

- 12 arquivos `page.tsx` no App Router.
- 2 route handlers: `/health` e `/api/tracking`.
- Módulos funcionais em `src/modules/`: `admin`, `content`, `passport`, `tracking` e `trips`.
- Design system de ícones integrado em `src/design-system/` e assets canônicos em `public/icons/`.
- Providers mock substituíveis em `src/providers/`.
- Drizzle em `src/core/db/` e migration v0 em `drizzle/`.

## Conteúdo sintético canônico

`seed/validation-content.json` contém:

- 6 categorias;
- 8 lugares;
- 5 parceiros;
- 7 experiências;
- 3 eventos;
- 1 fonte sintética.

`seed/validation-trip.json` contém uma viagem demo com 3 dias, 3 visitas e 3 entradas de clima fictício.

## Superfícies implementadas

- Home e Explorar.
- Página de Lugar.
- Página de Parceiro.
- Admin para lugares, experiências, parceiros, eventos, categorias e fontes.
- Onboarding de roteiro e viagem demo editável.
- Calendário Dia/Semana/Mês.
- Meu Passaporte com navegação por capítulos e registro demo.
- Tracking local mínimo.

## Testes presentes

- 6 arquivos de testes unitários, com 13 casos registrados no relatório e no log de execução.
- 7 arquivos E2E Playwright.
- A enumeração registrada em `artifacts/validation/e2e-list.log` totaliza 51 execuções considerando desktop, tablet e mobile e os casos parametrizados.
- Projetos Playwright: desktop 1440×1000, tablet 1024×768 e mobile 390×844 com `reducedMotion: reduce`.

## Infraestrutura presente

- `docker-compose.yml` com PostGIS 16/3.4.
- Fallback PGlite explicitamente documentado.
- `.github/workflows/ci.yml` com PostGIS, migration, seed, persistência, lint, typecheck, unitários, build e E2E.
- `.devcontainer/` adicionado neste pacote para revisão em GitHub Codespaces usando PGlite.

## Pontos que continuam deliberadamente incompletos

- branding final;
- fotografias finais;
- mapa territorial oficial;
- motor oficial de carimbos;
- QR de produção;
- autenticação real;
- providers externos reais;
- reservas e pagamentos;
- Travel Engine definitivo;
- regressão E2E completa e auditoria Axe;
- validação PostGIS executada no ambiente anterior.
