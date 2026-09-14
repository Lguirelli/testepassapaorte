# Sistema responsivo

A interface responde continuamente a espaço disponível, conteúdo, contexto, método de entrada e preferências do usuário. Não existem três produtos separados para desktop, tablet e mobile.

## Invariantes

- breakpoints existem quando o conteúdo exige mudança de composição;
- reflow e reorganização precedem redução de escala;
- funcionalidade essencial nunca é removida apenas para caber;
- componentes reutilizáveis devem preferir largura do próprio container;
- texto pode crescer, quebrar linha e aumentar a altura do componente;
- `svh`/`dvh` são usados onde altura de viewport é relevante;
- safe areas são respeitadas em header, menus, overlays e banners;
- overflow horizontal só existe quando é intencional, como calendário/tabela comparativa;
- resize não apaga estado de filtros, seleção ou formulários;
- hover é enhancement, não requisito funcional;
- layouts preservam semântica e ordem de teclado.

## Estratégias implementadas

### Shell e navegação
Header escalável em `rem`, menu móvel limitado por `100dvh`, scroll interno e safe areas. A arquitetura de navegação é a mesma em apresentação ampla e compacta.

### Grids
Grids de cards, métricas, calendário semanal e descoberta usam `auto-fit` + `minmax()` para reagir à largura útil do item. Media queries ficam reservadas a mudanças reais de padrão.

### Home
Seções são container-query contexts. Cards, roteiro, slider, galeria e Passaporte usam comportamento intrínseco. O slider não depende de uma altura fixa; conteúdo longo pode ampliar a seção. A galeria usa unidades relativas ao container (`cqi`) para sua composição espacial.

### Passaporte
O livro usa `ResizeObserver` no próprio container para alternar entre uma e duas páginas, preservando capítulo/estado durante resize. Não existe detecção de “dispositivo”.

### Tabelas e calendário mensal
Relações comparativas são preservadas com scroll horizontal deliberado quando não há largura suficiente, em vez de achatar a informação até ficar ilegível.

### Overlays
Menus, consentimento e diálogos respeitam altura real, safe areas, scroll interno e teclado virtual.

## QA
A suíte `tests/e2e/05-responsive.spec.ts` cobre larguras intermediárias aleatórias (347, 529, 713, 887, 1113 e 1371 px), alturas reduzidas/landscape, ampliação de texto em 200%, overflow horizontal e preservação de estado após resize.

O script `scripts/audit-responsive.mjs` impede regressões como `100vh`, device sniffing para layout, media query JS de viewport, overflow global mascarado e remoção da infraestrutura container-aware.
