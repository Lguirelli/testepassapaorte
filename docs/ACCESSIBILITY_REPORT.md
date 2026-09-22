# Relatório de acessibilidade

## Implementado

- skip link;
- headings semânticos;
- foco visível;
- labels de formulários;
- navegação por teclado no carrossel e menus;
- Escape/focus handling no menu mobile quando aplicável;
- estados com texto, não apenas cor;
- touch targets mínimos no shell;
- reflow com texto ampliado e controles que preservam área de interação;
- menu compacto com focus trap, Escape, retorno de foco e preferência de tema disponível;
- safe areas e overlays limitados pela altura real da viewport;
- `prefers-reduced-motion` global;
- alt text para conteúdo visual;
- Passaporte navegável por botões no mobile;
- mensagens de erro e status em formulários;
- linguagem factual para evidência de visita.

## Validação automatizada

A suíte E2E inclui Axe para violações `critical`/`serious` e matriz 390×844, 768×1024, 1366×936 e 1440×900. Playwright Python 1.57 + Chromium 144 executaram smoke real neste ambiente. A suíte TypeScript do runtime ainda depende do `npm ci` completo, que não conclui localmente por indisponibilidade do registry; o job E2E do GitHub Actions instala Chromium e executa `npm run test:e2e` automaticamente.

## Responsividade e acessibilidade

A suíte responsiva adicionada verifica ausência de overflow horizontal em larguras intermediárias, cenário de landscape/baixa altura, ampliação de texto em 200% e preservação de estado após resize. A arquitetura também evita dependência de hover em dispositivos coarse/no-hover.
