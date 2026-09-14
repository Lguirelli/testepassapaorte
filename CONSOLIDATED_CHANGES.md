# Passaporte Serra Negra — pacote consolidado

Este pacote reúne as alterações solicitadas até esta rodada sobre a base principal disponível no trabalho:

- narrativa e biblioteca de roteiros prontos;
- CTA `Planejar minha viagem`;
- CTA Green `#008542`, hover Dark Green `#003328`, formato pill;
- estado atual do header com apenas texto e ícone em Green, sem caixa de seleção;
- contraste reforçado do hero;
- correções de dark mode com tokens semânticos compartilhados;
- correção do dark mode da Home estática, removendo fallback de texto claro/escuro incorreto;
- ThemePicker com `data-theme` e `data-resolved-theme` sincronizados;
- Skeleton Loading responsivo e compatível com `prefers-reduced-motion`;
- arquivos necessários para build/deploy na Vercel, sem segredos reais.

O pacote não contém `.git`, `node_modules`, `.next`, `.vercel` ou arquivos `.env` reais.

## Tipografia Arimo + Cormorant Garamond

- Sistema tipográfico reduzido a duas famílias: Arimo e Cormorant Garamond.
- Arimo assume corpo, navegação, controles, labels, eyebrows e títulos de maior impacto.
- Cormorant Garamond assume títulos menores, leads editoriais e superfícies de Passaporte/carimbo.
- Hierarquia agora usa principalmente variação de peso, tamanho, tracking e itálico, sem terceira família decorativa.
- Removidas as referências ativas a Origin Black Display, Scratchy, Anodina e Inter.
- A mesma regra foi aplicada ao runtime Next.js e ao preview estático do GitHub Pages.

- 2026-09-14: tipografia refinada: Arimo em todos os títulos e body copy; Cormorant Garamond restrita a subtítulos e textos editoriais curtos. Títulos usam 700; corpo usa 400/500.


- Logo atualizado: header e footer passam a usar somente o SVG wordmark fornecido, inline, com cor adaptativa por modo claro/escuro e sem texto adicional ao lado.

- Header/logo refinado: wordmark SVG deslocado para baixo para se integrar à hero, cor fixa clara no header em todos os temas e remoção das bordas visuais que dividiam seções.

- Header refinado como dock flutuante fixo: fundo escuro translúcido com blur, navegação desktop apenas por ícones maiores e rótulos revelados em hover/foco, preservando logo claro e CTA verde.
