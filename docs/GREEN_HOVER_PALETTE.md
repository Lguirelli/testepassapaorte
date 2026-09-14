# Green interaction palette

A interface usa o Green da referência aprovada como cor principal de ação, seleção e destaque. Green Black e Dark Green funcionam como cores de suporte para profundidade, contorno e hover.

Tokens aprovados:

- `--green: #008542` — ação principal, foco e estados persistentes de seleção/atividade.
- `--green-black: #001F18` — profundidade, sombra e contraste escuro.
- `--dark-green: #003328` — hover, bordas e detalhes de interação.

Tokens semânticos:

- `--accent-selected` aponta para Green e deve ser usado em foco, seleção, página atual e outros estados persistentes.
- `--accent-selected-text` usa branco para manter contraste AA sobre `#008542`.
- `--accent-hover` aponta para Dark Green.
- `--accent-hover-strong` aponta para Green Black.

Aplicação:

- Green é usado em itens selecionados, página atual no header, tabs/chips ativos, foco de teclado e ações principais;
- tabs e chips selecionados podem usar fundo Green com texto branco para tornar o estado inequívoco;
- no header, `aria-current="page"` recebe indicador Green para deixar claro em qual página o usuário está sem preencher todo o Dock;
- Green não é adicionado como efeito extra de hover em itens neutros;
- um item já selecionado pode manter Green durante hover porque a cor comunica estado persistente;
- hovers de navegação, cards, chips, tabs e controles não selecionados usam Dark Green e Green Black como detalhes;
- botões e CTAs principais usam Green como base e Dark Green no hover;
- no mobile, a página atual recebe barra/realce Green, enquanto itens neutros usam Dark Green no hover;
- dark mode mantém a mesma hierarquia cromática;
- superfícies neutras e Pure White continuam sendo usadas apenas para contraste, legibilidade e composição;
- reduced motion não altera a lógica cromática.

Regra de regressão: nenhum componente deve introduzir outra cor verde como acento. Estados principais usam `#008542`; detalhes de interação usam `#003328` e `#001F18`.
