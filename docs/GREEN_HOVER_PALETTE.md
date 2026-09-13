# Green interaction palette

A interface usa três cores com papéis diferentes e previsíveis. O objetivo é deixar clicabilidade e estado atual claros sem transformar o hover em um efeito chamativo demais.

Tokens aprovados:

- `--lime: #D8E600` — descoberta, foco e estados persistentes de seleção/atividade.
- `--green-black: #001F18` — profundidade, sombra e hover escuro.
- `--dark-green: #003328` — ação principal, bordas e fundos de hover.

Tokens semânticos:

- `--accent-selected` aponta para Lime e deve ser usado somente em foco, seleção, página atual e outros estados persistentes.
- `--accent-selected-text` aponta para Green Black e garante contraste quando o Lime vira fundo de um controle selecionado.
- `--accent-hover` aponta para Dark Green.
- `--accent-hover-strong` aponta para Green Black.

Aplicação:

- Lime é reservado para itens selecionados, página atual no header, tabs/chips ativos e foco de teclado;
- tabs e chips selecionados podem usar fundo Lime com texto Green Black para deixar o estado inequívoco;
- no header, `aria-current="page"` recebe indicador Lime para deixar claro em qual página o usuário está sem transformar todo o Dock em Lime;
- Lime não é adicionado como efeito de hover em itens neutros;
- um item que já está selecionado pode continuar exibindo Lime quando recebe hover, porque a cor comunica o estado persistente, não o hover;
- botões e CTAs usam Dark Green como base e Green Black no hover quando o componente é preenchido;
- hovers de navegação, cards, chips, tabs e controles não selecionados usam somente Dark Green e Green Black;
- no mobile, a página atual recebe barra/realce Lime, enquanto o hover de itens neutros usa Dark Green;
- dark mode mantém a mesma hierarquia cromática, inclusive Lime com Green Black nos controles selecionados;
- superfícies neutras existentes permanecem neutras;
- reduced motion não altera a lógica cromática.

Regra de regressão: novos componentes não devem usar Lime apenas por `:hover`. Se Lime aparecer em hover, o mesmo componente precisa já estar em um estado persistente como `aria-current`, `aria-selected`, `aria-pressed` ou `:focus-visible`.
