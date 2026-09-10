# Patch V11 — comparação LATEST x V10

## Decisão de merge

`LATEST(1).zip` foi tratado como fonte de verdade do código atual. O Patch V10 não foi aplicado por sobreposição cega porque sua camada de repository/API pertencia a uma revisão anterior.

## Já presente no LATEST

- Next.js App Router + TypeScript strict;
- Drizzle + Postgres/PostGIS;
- PGlite de validação;
- Home, Explorar, Lugar, Parceiro, Admin, onboarding, roteiro, calendário e Passaporte;
- registro manual de visita demo;
- tracking `VISIT_CONFIRMED`;
- Passaporte responsivo em duas páginas no desktop e uma no mobile;
- Playwright desktop/tablet/mobile;
- serviço PostGIS no CI.

## Lacunas incorporadas no V11

- motor procedural oficial recebido nesta conversa;
- lifecycle `Visit -> visitNumber -> stampSeed -> stampSnapshot`;
- snapshots históricos persistidos;
- backfill de registros legados;
- SVG procedural real no Passaporte;
- page flip 3D;
- Playwright UI/Codespaces;
- CI com gate de qualidade antes da matriz Chromium/PostGIS;
- artifacts por viewport;
- testes unitários e E2E específicos dos carimbos/page flip.

## Itens propositalmente não trazidos do V10

- repository local antigo;
- APIs antigas incompatíveis com a camada Drizzle atual;
- showcase/Pages de revisões anteriores;
- estilos antigos que substituiriam a direção visual existente no LATEST.

## Regra de histórico

Depois que `stampSnapshot` é criado, ele é a representação visual histórica da visita. Atualizações futuras do algoritmo não devem redesenhar automaticamente carimbos já persistidos.
