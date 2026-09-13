# Green interaction palette

A interface usa três cores com papéis diferentes e previsíveis. O objetivo é deixar clicabilidade e estado atual claros sem transformar o hover em um efeito chamativo demais.

Tokens aprovados:

- `--lime: #D8E600` — descoberta, foco e estados persistentes de seleção/atividade.
- `--green-black: #001F18` — profundidade, sombra e hover escuro.
- `--dark-green: #003328` — ação principal, bordas e fundos de hover.

Aplicação:

- Lime é reservado para itens selecionados, página atual no header, tabs/chips ativos e foco de teclado;
- Lime não é adicionado como efeito de hover em itens neutros;
- um item que já está selecionado pode continuar exibindo Lime quando recebe hover, porque a cor comunica o estado persistente, não o hover;
- botões e CTAs usam Dark Green como base e Green Black no hover quando o componente é preenchido;
- hovers de navegação, cards, chips e controles usam somente Dark Green e Green Black;
- no header, `aria-current="page"` recebe indicador Lime para deixar claro em qual página o usuário está;
- no mobile, a página atual recebe barra/realce Lime, enquanto o hover usa Dark Green;
- dark mode mantém a mesma hierarquia cromática;
- superfícies neutras existentes permanecem neutras;
- reduced motion não altera a lógica cromática.
