# Validação das páginas de pontos turísticos

Data: 10/09/2026

## Concluído

- 12 páginas internas pesquisadas adicionadas ao dataset e às rotas da SPA.
- Os 3 pontos sintéticos antigos foram mantidos para não quebrar o roteiro demo, mas ocultados da descoberta pública.
- `#/explorar?relation=public_point` passa a usar os atrativos pesquisados.
- Home e mapa inicial priorizam atrativos pesquisados.
- Cada página mostra fonte oficial, data da consulta, crédito da imagem temporária, horário/localização quando disponíveis e alertas quando a informação não foi encontrada.
- 13 entradas físicas `lugares/**/index.html` foram geradas para GitHub Pages (índice + 12 páginas).
- `node --check app.js` e `node --check tourism-data.js`: PASS.
- `tourism-data.js` registra 12 atrativos pesquisados e mantém 3 pontos sintéticos ocultos da descoberta: PASS.
- ZIPs: CRC PASS.

## Navegador

A tentativa de screenshot com o Chromium de sistema não concluiu nem para `about:blank` neste ambiente, portanto não foi usada como evidência. Isso é um bloqueio do runtime desta sessão, não um resultado do código. Não foi marcado PASS visual sem evidência de browser.

## Conteúdo temporário

Fotografias de Wikimedia Commons e Pexels são temporárias e possuem crédito/origem no dataset. Onde não foi localizada foto claramente identificada do atrativo, a interface informa que a foto é ilustrativa. As 12 páginas possuem JPGs reais em `assets/tourism/` como fallback local, derivados da biblioteca de fotos de banco do repositório; nenhuma página nova usa fallback vetorial.
