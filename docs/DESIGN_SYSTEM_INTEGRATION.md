# Integração do Design System V1 ao patch GitHub + Playwright V8

Este patch incorpora o pacote `passaporte-serra-negra-design-system-v1` à camada executável e à validação automática.

## Fonte de verdade

Os arquivos originais ficam em `docs/design-system-v1/`. A fonte Cuturila **não é redistribuída**. O stack usa `CuturilaDEMO` quando uma cópia licenciada estiver instalada e cai para Bebas Neue.

## Código

- `src/design-system/tokens/brand.css`: tokens CSS oficiais.
- `src/design-system/tokens/brand.json`: representação estruturada.
- `src/app/globals.css`: aliases semânticos da aplicação Next apontam para os tokens V1.
- `showcase/design-tokens.css`: tokens da showcase estática.
- `showcase/styles.css`: tipografia e paleta migradas para os tokens oficiais.

## Tipografia aplicada

- Home: CuturilaDEMO → Bebas Neue fallback.
- UI/body: Inter, com body 300 e subtítulos funcionais 500.
- Títulos internos: Arimo 700.
- Subtítulos/editorial: Cormorant Garamond 400/500.

## Paleta

A base neutra usa Neutral 050/100/500/700/750/900/950. Accents de nicho ficam disponíveis por tokens, sem transformar a tela inteira em composição multicolorida.

## Gates automáticos

`npm run design:check` valida arquivos, valores centrais, stacks tipográficos e ausência das fontes substituídas no CSS executável.

`npm run pw:design` abre a showcase no Chromium e confirma por `getComputedStyle` que os tokens e stacks estão realmente chegando ao navegador.

O workflow `01-quality` executa o gate estático; a suíte Playwright executa os testes E2E, incluindo `tests/e2e/design-system.spec.ts`.

## Como inspecionar visualmente

No Codespace, execute `npm run pw:ui`. Abra a porta 9323 e escolha `design-system.spec.ts` ou `visual-audit.spec.ts`. O painel mostra snapshots, DOM, console, requests e cada etapa do teste. A aplicação fica disponível na porta 3000.
