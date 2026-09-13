# Sistema global de UX/UI

Este documento registra as invariantes aplicadas ao runtime Next.js e à prévia do GitHub Pages.

## Ordem de decisão

`propósito → conteúdo → tarefa → hierarquia → interação → feedback → acabamento → decoração`

Em caso de conflito, prevalecem conclusão da tarefa, clareza, previsibilidade, acessibilidade, preservação de contexto e consistência do sistema antes de sofisticação visual.

## Invariantes implementadas

- targets acionáveis de aproximadamente 44×44 px quando aplicável;
- foco visível e navegação por teclado;
- menu móvel com `Escape`, focus trap, retorno de foco e bloqueio de scroll;
- nenhuma ação primária depende de hover;
- hover de movimento limitado a `(hover:hover) and (pointer:fine)`;
- SVGs do próprio projeto como sistema de ícones, sem Material Symbols no runtime publicado;
- tokens compartilhados para spacing, radius, motion, cores e estados;
- CTA primário com maior peso que ações secundárias;
- cards com affordance explícita também sem hover;
- formulários com controles que podem crescer e fazer reflow;
- feedback por toast/status sem transformar sucessos triviais em modal;
- `prefers-reduced-motion`, `prefers-contrast` e `forced-colors` tratados;
- dark mode preserva hierarquia em vez de inverter cores mecanicamente;
- conteúdo principal não usa `aria-live` global; anúncios ficam em regiões específicas de status;
- safe areas e viewports de altura reduzida considerados;
- grids intrínsecos com `auto-fit/minmax` onde o conteúdo é repetitivo;
- tabelas preservam comparação com overflow horizontal intencional quando necessário;
- textos e controles aceitam wrap e ampliação sem altura fixa estrutural;
- experiência pública reduz linguagem técnica e mantém avisos de prévia no nível de suporte, não como conteúdo P1.

## Governança

`npm run audit:uxui` valida invariantes estruturais da implementação. O workflow de GitHub Pages executa UX/UI, responsividade e sanitização antes de publicar a prévia.
