# Green interaction palette

A interface usa somente os dois verdes aprovados da referência visual para destaques e feedback de interação, sem transformar grandes superfícies em blocos saturados.

Tokens aprovados:

- `--green-black: #001F18` — profundidade, sombra, contraste e hover escuro.
- `--dark-green: #003328` — ação principal, borda ativa, foco e estados de hover/seleção.

Aplicação:

- nenhum lime, teal, olive ou outro verde é usado como cor de destaque;
- botões e CTAs usam Dark Green como base e Green Black no hover quando o componente é preenchido;
- navegação ativa e elementos selecionados usam Dark Green;
- cards, chips e controles recebem bordas ou fundos derivados apenas de Dark Green e Green Black;
- no dark mode, os verdes continuam sendo os únicos acentos cromáticos, com texto neutro branco para preservar contraste;
- superfícies neutras existentes permanecem neutras;
- reduced motion não altera a lógica cromática.
