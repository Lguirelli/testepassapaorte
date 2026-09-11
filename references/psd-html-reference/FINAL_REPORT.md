# FINAL REPORT

## Resultado

Foram construídas duas referências independentes em HTML, CSS e JavaScript:

- `home/index.html`
- `partner/index.html`

Ambas são navegáveis entre si, responsivas e não dependem de framework ou build.

## Interpretação dos PSDs

### Home

O PSD da Home possui canvas de **1920 × 10533 px** e 12 grandes recortes estruturais detectáveis. A composição foi interpretada como uma narrativa longa, alternando hero fotográfico, descoberta, roteiros, editorial, categorias, contexto, interesses, FAQ, planejamento, mapa e fechamento.

### Partner

O PSD de parceiro possui canvas de **696 × 2979 px** e 9 recortes estruturais detectáveis. A estrutura foi reinterpretada como template de experiência/estabelecimento com hero, disponibilidade, apresentação, mosaico de benefícios, conteúdo editorial, modalidades, citação, conexões, informações práticas e CTA.

## Ferramentas utilizadas

- ImageMagick 7 para leitura do composite, identificação de scenes/layers, extração e otimização de recortes;
- Python/Pillow para composição das comparações PSD × HTML;
- HTML5, CSS e JavaScript sem framework;
- Chromium 144 para validação programática;
- Playwright 1.57 foi detectado e testado, mas o runtime de navegador esperado pela instalação não estava presente;
- o Chromium de sistema possui política corporativa que bloqueia navegação para `127.0.0.1`, endereços privados, `file:` e `data:`. Como fallback, a validação visual foi feita injetando o HTML/CSS/assets diretamente em uma página `about:blank` via Chrome DevTools Protocol e capturando a página completa.

## Leitura de PSD

A biblioteca `psd-tools` não estava instalada e não pôde ser baixada por ausência de acesso à internet. ImageMagick conseguiu expor composite, dimensões e offsets dos grandes layers rasterizados. Essa leitura foi suficiente para reconstrução estrutural.

## Assets

Foram extraídos e otimizados recortes fotográficos temporários em WebP. Eles não carregam logos externos como identidade do produto, mas permanecem **assets de referência** derivados do material do PSD. Antes de produção, devem ser trocados por fotografia autorizada de Serra Negra e dos parceiros.

Hero principal possui fallback JPEG, além de WebP.

## Fidelidade alcançada

### Mantido

- sequência longa da Home;
- alternância entre áreas claras/escuras;
- hero com header sobreposto;
- títulos editoriais de grande escala;
- cards assimétricos e mosaicos;
- uso de imagens com forte presença;
- faixas marrom/oliva na página de parceiro;
- módulos de tabs, métricas, FAQ e CTAs;
- sensação editorial e turística da composição.

### Diferenças deliberadas

- marcas, logos, slogans e textos externos foram removidos;
- tipografia proprietária foi substituída por Georgia + system UI;
- mapas e rotas foram recriados como SVG próprio;
- layouts foram adaptados para semântica, acessibilidade e responsividade;
- alguns elementos originalmente rasterizados foram transformados em HTML/CSS real;
- o conteúdo é demonstrativo e preparado para futura transformação em template dinâmico.

## Responsividade validada

### Home

- 1920 px: screenshot completa `validation/home/home-1920.png`
- 1440 px: screenshot completa `validation/home/home-1440.png`
- 1024 px: screenshot completa `validation/home/home-1024.png`
- 768 px: screenshot completa `validation/home/home-768.png`
- 390 px: screenshot completa `validation/home/home-390.png`

### Partner

- 1440 px: screenshot completa `validation/partner/partner-1440.png`
- 1024 px: screenshot completa `validation/partner/partner-1024.png`
- 768 px: screenshot completa `validation/partner/partner-768.png`
- 390 px: screenshot completa `validation/partner/partner-390.png`

Não foi detectado overflow horizontal nas capturas instrumentadas de 390, 768, 1024 e 1440 px da página de parceiro e no teste instrumentado de 390 px da Home. As demais capturas desktop da Home também foram geradas com largura final exatamente igual ao viewport solicitado.

## Comparação visual

- `validation/comparison-home.png`
- `validation/comparison-partner.png`

As comparações colocam **PSD | HTML** lado a lado e foram usadas para conferir sequência, densidade, alternância de superfícies e proporção geral.

## Interações implementadas

### Home

- menu mobile;
- busca demonstrativa;
- trilho horizontal de cards;
- FAQ accordion;
- animação de rota;
- formulário de intenção;
- transição lateral entre páginas;
- hover de card completo;
- feedback por toast.

### Partner

- menu mobile;
- salvar ponto;
- tabs de modalidades;
- formulário de disponibilidade;
- CTA de criação de roteiro;
- transição lateral entre páginas;
- hover de card completo;
- feedback por toast.

## Acessibilidade

- landmarks semânticos;
- heading hierarchy;
- `alt` em imagens relevantes;
- foco visível;
- botões reais;
- labels de formulários;
- `aria-expanded` em menu/accordion;
- `aria-selected` em tabs;
- `aria-live` para feedback;
- `prefers-reduced-motion`.

## Servidor local

As páginas não dependem de build. A raiz `html-reference/` pode ser servida com:

```bash
python -m http.server 8000
```

Rotas esperadas:

- `http://localhost:8000/home/`
- `http://localhost:8000/partner/`

O servidor HTTP local foi iniciado e respondeu `200 OK` durante a verificação por `curl`. A política do Chromium de sistema impediu apenas a navegação visual para o endereço local dentro daquele browser gerenciado, não o funcionamento do servidor.

## Pendências antes da integração definitiva

1. substituir fotografias temporárias por acervo aprovado de Serra Negra;
2. conectar conteúdo real dos parceiros;
3. integrar dados de disponibilidade/reserva quando a API escolhida estiver definida;
4. transformar a Partner em template dinâmico;
5. migrar tokens e componentes aprovados para o repositório principal;
6. executar nova regressão visual dentro do ambiente final do projeto.

## Status

A referência HTML solicitada está concluída e pronta para ser usada como base da implementação definitiva.
