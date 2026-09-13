# Relatório de testes

**Data:** 2026-09-12

## Executado nesta revisão

- `node scripts/validate-static.mjs` — **PASS**.
- `node scripts/scan-sensitive.mjs` — **PASS, 0 achados**.
- `node scripts/audit-sanitization.mjs` — **PASS**.
- `node scripts/audit-responsive.mjs` — **PASS**.
  - sem `100vh` no runtime;
  - sem device sniffing, `innerWidth` ou media query JS para arquitetura de layout;
  - safe areas, `dvh`, container queries e grids intrínsecos presentes;
  - Passaporte container-aware com `ResizeObserver`;
  - suíte E2E responsiva presente com larguras 347, 529, 713, 887, 1113 e 1371 px, baixa altura/landscape, texto 200%, overflow e preservação de estado.
- Transpilação sintática com TypeScript global em **279 arquivos TS/TSX** (excluindo `.d.ts`) — **PASS, 0 erros**.
- Balanceamento de chaves CSS dos arquivos principais alterados — **PASS**.

## QA responsivo implementado no repositório

`tests/e2e/05-responsive.spec.ts` testa redimensionamento em larguras intermediárias aleatórias, ausência de overflow horizontal, alvo mínimo dos principais controles, landscape/altura reduzida, texto ampliado a 200% e preservação do valor de busca durante resize.

## Dependente de instalação

O ambiente de geração continua sem conseguir concluir `npm ci` por indisponibilidade do registry/cache incompleto. Portanto os comandos abaixo permanecem **não declarados como aprovados sem execução real**:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run local:prepare`
- `npm run build`
- `npm run test:e2e`
- Axe/Playwright em browser real

## Sanitização

O novo refinamento responsivo foi submetido novamente ao scan sensível e à auditoria de sanitização. Ambos passaram sem regressões.

## Regra de interpretação

A revisão responsiva está concluída no nível de implementação e QA estático verificável. A validação visual/browser-dependent permanece explicitamente bloqueada por dependência externa; nenhum teste não executado foi convertido em aprovação.

## GitHub Pages correction

- `node --check` nos principais scripts da prévia: PASS
- referências locais de `github-pages/index.html`: PASS, 0 ausentes
- HTTP smoke local: PASS (`index.html`, `app.js`, logo SVG)
- varredura por caminhos internos/IDs/segredos na prévia: PASS
- `npm run validate:static`: PASS
- GitHub Pages real: depende de push e configuração **Settings → Pages → Source: GitHub Actions**, não executável localmente nesta sessão.
