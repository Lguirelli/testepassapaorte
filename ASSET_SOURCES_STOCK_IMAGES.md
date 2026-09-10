# Imagens de banco para validação visual

As fotografias abaixo agora estão **salvas localmente dentro do repositório**, em `assets/stock/`, e são usadas diretamente nos cards e nas páginas internas. Elas continuam sendo **fotos ilustrativas**, ou seja, não representam os lugares fictícios nomeados no protótipo e não devem ser interpretadas como fotografias feitas em Serra Negra.

## Objetivo desta correção

- substituir os fallbacks vetoriais por **fotografias reais**;
- eliminar a dependência de URLs remotas para visualização dos cards;
- deixar o ZIP pronto para subir no repositório já com os arquivos de imagem incluídos.

## Fontes e créditos

| Uso no protótipo | Provedor | Autor | Página da foto | Arquivo local |
|---|---|---|---|---|
| Mirante Vale das Araucárias | Pexels | Malcoln Oliveira | https://www.pexels.com/photo/scenic-mountain-view-in-minas-gerais-brazil-34077879/ | `assets/stock/01-mirante-vale-araucarias.jpg` |
| Jardim das Nascentes | Pexels | Silas Guadagnini | https://www.pexels.com/photo/tropical-garden-pathway-in-parana-brazil-36949609/ | `assets/stock/02-jardim-nascentes.jpg` |
| Centro Cultural Estação da Serra | Pixabay | akagi99 | https://pixabay.com/photos/museum-building-interior-windows-5731683/ | `assets/stock/03-centro-cultural.jpg` |
| Café Neblina Alta | Pexels | Sveta K | https://www.pexels.com/photo/cozy-cafe-interior-design-8847017/ | `assets/stock/04-cafe-neblina-alta.jpg` |
| Bistrô Estação Verde | Pexels | Orhan Pergel | https://www.pexels.com/photo/restaurant-interior-19039292/ | `assets/stock/05-bistro-estacao-verde.jpg` |
| Ateliê Pedra & Folha | Pexels | Oleg Prachuk | https://www.pexels.com/photo/pottery-standing-on-a-shelf-in-ceramics-studio-15440780/ | `assets/stock/06-atelie-pedra-folha.jpg` |
| Casa do Mel da Serra | Pexels | Mykhailo Kaparchuk | https://www.pexels.com/photo/artisanal-honey-jars-with-honeycomb-outdoors-35042437/ | `assets/stock/07-casa-mel-serra.jpg` |
| Espaço Bem-Estar Águas Claras | Pexels | Max Vakhtbovych | https://www.pexels.com/photo/interior-of-a-massage-room-7598366/ | `assets/stock/08-bem-estar-aguas-claras.jpg` |

## Implementação

- `data.js` foi ajustado para usar `src` local em vez de URL remota.
- `fallbackSrc` também aponta para o mesmo arquivo local, garantindo robustez.
- Os cards continuam marcados como `foto ilustrativa` para preservar o contexto de protótipo.
- Para produção, o ideal continua sendo substituir tudo por fotografias próprias ou licenciadas dos locais reais.
