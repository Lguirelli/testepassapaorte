# Passaporte Serra Negra — Ajustes de Logo, Transições e Hover v5

## Alterações aplicadas

### Logo
- Removido o fundo do container do SVG da logo no header e no footer.
- Removidos `background`, `border`, `border-radius`, `padding` e `box-shadow` usados como chip atrás da marca.
- O SVG original continua intacto e transparente.

### Transições entre páginas
- Adicionada transição de saída e entrada no `#app` sempre que a rota hash muda.
- Saída: 150 ms, `ease-in-out`, fade + deslocamento vertical de 8 px + escala mínima.
- Entrada: 230 ms, `ease-in-out`, fade + deslocamento vertical de 8 px + escala mínima.
- Header/footer permanecem estáveis durante a troca de rota.
- Back/forward do navegador também utiliza a transição.
- `prefers-reduced-motion: reduce` desativa as animações.

### Hover e clique
- Todos os links, botões, tabs e controles com ações recebem transições suaves de cor, fundo, borda, sombra, opacidade e transform.
- Botões ganham leve elevação e contorno/sombra em hover.
- Cards que são diretamente clicáveis ganham elevação de 2 px e sombra.
- Cards compostos só recebem destaque quando uma ação real dentro deles está em hover/foco.
- Imagens de cards recebem zoom muito leve (`1.018`) em hover.
- Ícones acompanham o hover com deslocamento mínimo.
- Estado `:active` dá feedback de pressão sem alterar o layout.
- `focus-visible` permanece mais forte que hover para acessibilidade por teclado.

## Arquivos alterados
- `app.js`
- `theme.css`
- `visual-v2.css`
- `visual.css`

## Validações
- JavaScript validado com `node --check`.
- Todos os CSS carregados foram parseados com `tinycss2`: 0 erros de parsing.
- Não restaram regras que adicionem fundo colorido ao container `.brand-logo`.
- O `hashchange` usa `renderWithRouteTransition()`.
- As transições usam explicitamente `ease-in-out`.
