# Passaporte Serra Negra — Landing V3 reconstruída do PSD

A entrada principal deste repositório é a **landing funcional do Passaporte Serra Negra em `index.html`**, reconstruída diretamente a partir do comando `PROMPT_RECONSTRUCAO_LANDING_V3.md` e do PSD `landing page(2).psd`.

A regra da reconstrução é simples: o **index define o que cada parte faz** e o **PSD define posição, proporção, composição e ritmo visual**. As 12 camadas do PSD foram mapeadas 1:1 para as 12 seções originais da Home. A busca continua dentro do Hero e a última camada, embora também esteja nomeada `Visão territorial`, foi corretamente tratada como CTA final.

## Abrir como site

Não há build obrigatória para a landing estática. Na raiz do repositório:

```bash
python -m http.server 4173
```

Abra `http://localhost:4173/`.

No GitHub Pages, publique a raiz do repositório. `index.html`, CSS, JavaScript e assets necessários estão no nível raiz.

## O que está funcional

- Header sticky, navegação, menu mobile e tema Sistema/Claro/Escuro;
- Hero com busca e sugestões rápidas;
- seletor editorial de pontos turísticos;
- carrossel de parceiros, sem ranking;
- rota demonstrativa construída em SVG/CSS;
- tabs de tipos de roteiro com ARIA e teclado;
- cards de roteiro;
- descoberta contextual com clima/evento sintéticos;
- categorias;
- FAQ interativo;
- introdução visual ao Passaporte;
- mapa demonstrativo com lista e pins vinculados;
- CTA final;
- demais páginas funcionais da demo anterior continuam disponíveis pelas rotas hash.

## Identidade

A paleta principal usa os tokens neutros oficiais: creme, carvão, grafite e cinzas quentes. Cores complementares aparecem apenas como identidade contextual de nichos. O SVG oficial fornecido pelo proprietário é usado diretamente em `assets/brand/logo-passaporte-serra-negra.svg`.

## Validação

Foram exercitados `1920×1080`, `1440×900`, `1280×800`, `1024×768`, `768×1024`, `390×844` e `360×800`, todos sem overflow horizontal no harness de Chromium. Screenshots e comparação com o PSD estão em `screenshots/`.

Leia `IMPLEMENTATION_NOTES.md` para o mapeamento camada a camada, geometria, decisões, interações, limitações do ambiente e pendências reais.

## Fontes preservadas

- `references/landing-reconstruction-v3/PROMPT_RECONSTRUCAO_LANDING_V3.md`
- `references/landing-reconstruction-v3/PSD_LAYER_METADATA.json`

O PSD binário não é duplicado dentro do ZIP para evitar inflar o repositório; sua estrutura e evidências de comparação estão documentadas.

## Natureza desta versão

Todos os lugares, parceiros, clima, evento e visitas desta build continuam sendo **dados sintéticos de validação**. Fotografias finais, geografia real, QR, autenticação de produção e providers externos permanecem fora desta reconstrução.
