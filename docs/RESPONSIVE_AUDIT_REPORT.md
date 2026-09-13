# Auditoria responsiva final

## Escopo

Revisão aplicada ao runtime Next.js final após a adoção do sistema global de responsividade. O objetivo foi corrigir problemas reais sem redesenhar páginas válidas.

## Achados corrigidos

### HIGH — Passaporte dependia da viewport global
O livro decidia uma ou duas páginas com `window.matchMedia('(max-width: 650px)')`. Isso falhava em split screen, painel lateral ou container estreito dentro de viewport ampla.

**Correção:** `ResizeObserver` no próprio container, preservando capítulo e alternando apresentação sem remount.

### HIGH — Slider da Home dependia de altura mínima artificial
O slider utilizava slides absolutos e `min-height` crescente por breakpoint. Texto ampliado/localização poderia ultrapassar a geometria.

**Correção:** slides passam a compartilhar uma grid area e contribuir para a altura intrínseca do container.

### HIGH — overlays sem contrato completo de altura/safe area
Menu e consentimento precisavam tratar melhor barras do sistema, baixa altura e teclado virtual.

**Correção:** safe areas, `100dvh`, scroll interno, overscroll containment e limites reais de altura.

### MEDIUM — grids orientados por quantidades fixas
Vários grids usavam 3/2/1 ou 4/2/1 apenas por media query global.

**Correção:** `auto-fit` + `minmax()` para cards, métricas, calendário semanal, descoberta, início e interesses. A quantidade de colunas passa a responder à largura útil do item.

### MEDIUM — tema desaparecia no layout compacto
O seletor era ocultado em mobile sem apresentação alternativa.

**Correção:** preferência de aparência passa a existir dentro do menu compacto.

### MEDIUM — calendário mensal perdia a relação semanal
A versão estreita convertia sete colunas em duas, prejudicando comparação temporal.

**Correção:** sete colunas preservadas com scroll horizontal explícito e deliberado quando necessário.

### MEDIUM — galeria usava deslocamento espacial fixo em px
O carrossel editorial usava distância horizontal fixa, pouco adequada a containers intermediários.

**Correção:** deslocamentos principais usam unidade relativa ao container (`cqi`) e limites fluidos.

### LOW — hover transformativo em coarse pointer
Alguns efeitos poderiam permanecer após tap em dispositivos sem hover real.

**Correção:** transformações de hover são neutralizadas em `(hover:none)`/`(pointer:coarse)` sem remover a ação principal.

## Invariantes automatizados

`npm run audit:responsive` falha quando detecta regressões estruturais como:

- `100vh` no runtime em vez de unidades modernas quando a altura importa;
- detecção de dispositivo/user-agent para layout;
- `innerWidth` para decidir arquitetura responsiva;
- media query JavaScript de viewport para apresentação do componente;
- overflow horizontal global mascarado;
- remoção da infraestrutura de safe area/container queries;
- remoção do comportamento container-aware do Passaporte;
- remoção da suíte responsiva de larguras intermediárias.

## Matriz de browser preparada

A nova suíte E2E inclui:

- 347 × 720;
- 529 × 720;
- 713 × 720;
- 887 × 720;
- 1113 × 720;
- 1371 × 720;
- 844 × 390;
- 667 × 375;
- 1024 × 480;
- texto em 200%;
- preservação de formulário durante resize;
- detecção programática de overflow horizontal.

A execução em browser real permanece dependente da instalação das dependências/Chromium e não é declarada como aprovada nesta sessão.
