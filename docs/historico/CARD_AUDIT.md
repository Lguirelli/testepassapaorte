# Auditoria de cards

## Princípio
Cards que representam o mesmo tipo de conteúdo ou ocupam o mesmo slot visual devem compartilhar um container estável. A imagem é recortada dentro de um frame fixo com `object-fit: cover`; ela não define a altura do card.

## Famílias padronizadas
- Lugares/pontos: Home, Explorar, Mapa e listas próximas usam shell fixo e mídia fixa.
- Parceiros: carrosséis usam altura fixa por breakpoint e mídia fixa dentro do card.
- Roteiros prontos: cards de coleção usam altura única por breakpoint e imagem cobrindo o frame inteiro.
- Slider de tipo de roteiro: viewport fixa por breakpoint para impedir mudança de altura ao trocar de item.
- Primeiros caminhos/pontos em destaque: shell e frame de mídia fixos.
- Categorias/interesses: altura fixa por grid.
- Cards textuais equivalentes: grids usam `grid-auto-rows: 1fr` ou alturas compartilhadas quando a semântica é a mesma.

## Regras de mídia
- `width: 100%`
- altura definida pelo componente/família
- `object-fit: cover`
- conteúdo textual com line clamp quando necessário para preservar o shell
- ações ancoradas ao final do card quando aplicável

## Responsividade
As dimensões mudam por breakpoint, mas todos os cards da mesma família permanecem iguais dentro daquele viewport.
