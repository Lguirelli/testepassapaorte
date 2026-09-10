# Package manifest · Visual v2

Pacote GitHub Pages funcional com a camada visual v2 aplicada sobre o checkpoint Bloco 08 PARCIAL.

## Superfície publicada

A raiz contém `index.html`, `404.html`, `app.js`, `data.js`, `styles.css`, `visual-v2.css`, `.nojekyll` e `assets/`. O workflow `.github/workflows/pages.yml` monta o artefato Pages somente com essa superfície.

## Alterações principais

- Home reconstruída em 12 seções via `sectionRegistry` local;
- página pública de parceiro reconstruída;
- nova landing `#/para-parceiros`;
- Public Shell alinhado ao guia v2;
- responsividade visual v2;
- nenhum screenshot de referência usado como conteúdo público;
- fluxos anteriores preservados.

## Validação desta camada

`node --check app.js` PASS, smoke de renderização JavaScript em oito rotas PASS e browser smoke autocontido PASS para Home/Parceiro em 1440×1100 e 390×844. Interações principais e ausência de overflow horizontal foram verificadas. Os gates do Bloco 08 não foram promovidos, pois essa checagem visual não substitui PostGIS nem a matriz E2E original.
