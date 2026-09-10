# Icon Audit v2

## Resultado

- Pacote base v1: **24** SVGs.
- Novos ícones de produto: **115** SVGs.
- Novos ícones Admin/CMS: **15** SVGs.
- Total de glyphs recebidos: **154**.
- Geometrias canônicas de produção após reuso: **145**.
- API semântica total, incluindo aliases declarados: **165** nomes.
- SVGs com masks: **4**.
- Conteúdo executável/foreignObject detectado: **0**.

Todos os 130 SVGs novos usam `viewBox="-10 -10 120 120"`, 120 × 120, fundo transparente e pontas/junções arredondadas. A normalização converte cores visíveis pretas em `currentColor` e preserva preto/branco interno de masks, pois nesses casos a cor faz parte da operação da máscara.

## IDs internos

IDs de `mask`, `defs` e grupos são prefixados pelo nome canônico para evitar colisões quando vários SVGs são renderizados inline na mesma página.

## Reuso

Geometrias exatamente iguais são mantidas como nomes semânticos distintos no registry, mas apontam para um único componente/asset canônico. Os SVGs originais não são alterados na pasta `sources/`.
