# Relatório de auditoria UX/UI

## Resultado

**PASS na auditoria estrutural automatizada após correções.**

A auditoria foi aplicada tanto ao runtime canônico Next.js quanto à camada estática publicada no GitHub Pages.

## Achados e correções

### HIGH — prévia pública usava sistema visual legado

A publicação do GitHub Pages reutilizava a SPA estática de validação, incluindo folhas de estilo acumuladas e o runtime de Material Symbols. Isso criava divergência entre o produto e a versão apresentada publicamente.

**Correção:** `github-pages/uxui-system.css` passou a ser a última camada normativa da prévia; o registro de ícones usa os SVGs de `assets/icons-v3` por máscara vetorial e o carregamento de Material Symbols foi removido.

### HIGH — affordance e acessibilidade do menu móvel incompletas

O menu fechava por Escape, mas não implementava focus trap próprio na prévia estática e não tratava clique externo/retorno de foco de modo completo.

**Correção:** focus trap, Escape, retorno ao trigger, fechamento por clique externo, bloqueio de scroll e sincronização ao sair do modo compacto.

### HIGH — inconsistência entre pointer/touch e hover

Movimentos de hover podiam ser calculados sem verificar a capacidade real de hover/pointer fino.

**Correção:** motion de hover e Dock passam a depender da capacidade de entrada, e touch/coarse pointer recebe comportamento estável sem lift/scale obrigatório.

### MEDIUM — targets menores que a referência de 44 px no runtime Next

Alguns links do Dock, seletor de tema e botões circulares tinham 39–40 px.

**Correção:** contrato global `--target-min: 2.75rem` aplicado aos controles relevantes.

### MEDIUM — linguagem técnica dominava áreas da experiência pública

A Home e outros pontos da prévia expunham repetidamente termos como “validação visual”, “demo” e “build”.

**Correção:** mensagens primárias foram reescritas para a tarefa do turista; transparência sobre a natureza da prévia permanece em áreas contextuais e legais.

### MEDIUM — CTA de cards dependia parcialmente de hover para reforçar intenção

O rótulo de ação podia ficar recolhido até hover/focus.

**Correção:** ação textual permanece visível; hover é apenas reforço.

### MEDIUM — responsividade baseada demais em breakpoints globais na prévia

**Correção:** grids repetitivos agora usam `auto-fit/minmax`, cards usam container context, formulários fazem reflow e tabelas usam overflow intencional quando comparação horizontal é necessária.

### LOW — `aria-live` em todo o conteúdo principal

Um rerender de rota poderia anunciar conteúdo excessivo para leitores de tela.

**Correção:** `main` mantém foco programático, enquanto anúncios ficam no toast/status dedicado.

## Estados e interação

Foram preservados ou reforçados:

- default;
- hover somente quando suportado;
- focus visível;
- keyboard;
- touch;
- selected/active;
- disabled;
- loading/error/success onde o fluxo já os possui;
- reduced motion;
- contraste aumentado/forced colors;
- feedback contextual.

## Limite da auditoria

A auditoria estrutural não substitui Axe/Playwright em browser real. O ambiente de geração continua sem dependências npm completas, portanto a validação E2E completa permanece separadamente documentada.
