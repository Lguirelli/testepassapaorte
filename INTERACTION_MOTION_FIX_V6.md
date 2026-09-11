# Interação e navegação — v6

## Alterações

- Removido o fade da troca de rotas.
- Adicionada transição horizontal de tela inteira usando View Transitions API quando disponível.
- Navegação para frente: tela atual sai para a esquerda e a nova entra pela direita.
- Navegação para níveis anteriores: sentido invertido.
- Fallback sem fade para navegadores sem View Transitions.
- Timing baseado em `cubic-bezier(.4,0,.2,1)` (ease-in-out).
- Removido zoom/scale da imagem interna no hover.
- Hover passa a deslocar o card completo, mantendo mídia, texto, borda e ações unidos.
- Cards do carrossel preservam a escala de profundidade e recebem somente translação do container.
- `prefers-reduced-motion` continua desativando as animações.
