# Passaporte Serra Negra — Navegação suave v10

## Objetivo

Suavizar as transições entre páginas sem voltar ao fade e mantendo a sensação de que a interface inteira se desloca lateralmente.

## Alterações

- duração principal aumentada de 360 ms para 680 ms;
- easing alterado para `cubic-bezier(.16,1,.3,1)`, com desaceleração longa e natural;
- animações usam `translate3d(...)` para favorecer composição na GPU;
- a tela que entra percorre a largura da viewport;
- a tela anterior usa parallax de 22%, em vez de ser lançada 100% para fora;
- pequeno sombreado na borda da tela que entra reforça a separação entre os planos;
- nenhuma alteração de opacidade ou fade foi adicionada;
- a transição compartilhada de mídia foi ajustada para 600 ms para terminar antes da tela e evitar um snap no final;
- fallback para navegadores sem View Transitions também recebeu easing mais suave e entrada prolongada;
- `prefers-reduced-motion` continua sendo respeitado.

## Sensação esperada

A navegação deve se comportar como um push lateral contínuo: a nova tela desliza por cima da anterior, enquanto a tela anterior recua sutilmente. Isso reduz a sensação de transição dura e preserva a orientação espacial do usuário.
