# Refinamento visual e de interações — Index

Rodada aplicada sobre a home dinâmica existente, sem reconstrução de arquitetura e sem alteração do conteúdo editorial do projeto.

## Alterações

- CTA `Montar meu roteiro` do header com fundo claro, texto e ícone escuros e hover preservando contraste.
- Headers sem divisor inferior, sombra linear ou pseudo-elemento de separação.
- Hero com `min-height: 100svh`, conteúdo centralizado e busca sem ornamentos externos.
- `Primeiros caminhos` limitado a três itens aleatórios por renderização no servidor, sem duplicação, com CTA para a listagem completa.
- `Encontros pelo caminho` com fade inferior progressivo, menor padding inferior, hover exclusivo do card central e afastamento dos vizinhos sem sobreposição visual.
- Separação entre `galleryPosition` e `galleryMotion` para impedir conflito de `transform` entre posicionamento e hover.
- Galeria acessível por arraste, wheel, botões e setas do teclado.
- Pontos da rota com escala/cor discretas sem deslocar a posição.
- Tipos de roteiro com transição horizontal coordenada.
- Cards de ponto de partida e interesses com elevação + escala sem clipping.
- Cabeçalhos de Descoberta contextual e Explore por interesse centralizados.
- FAQ com expansão por `grid-template-rows`, opacity e rotação do chevron.
- Pins do mapa limitados a escala e mudança de cor.
- CTA final em exatamente duas linhas no desktop, com quebra livre em telas menores.
- `prefers-reduced-motion` preservado.

## Validação automatizada preparada

`tests/e2e/07-home-refinement.spec.ts` cobre:

- contraste do CTA do header;
- remoção do divisor dos headers internos;
- hero em primeira dobra;
- exatamente três cards em Primeiros caminhos;
- CTA de listagem completa;
- afastamento lateral da galeria;
- navegação da galeria por teclado;
- accordion exclusivo;
- slider de tipos de roteiro;
- hover da linha de experiência;
- título final em duas linhas;
- overflow horizontal em nove viewports;
- reduced motion.
