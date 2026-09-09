# Arquitetura

O fluxo é: dados da visita → normalização → seed → resolução semântica do ícone → forma e composição compatíveis → tema e textura → objeto GeneratedStamp → SVG. A interface recebe o resultado; o núcleo não conhece parceiros específicos, autenticação ou banco de dados.

| Arquivo | Responsabilidade |
|---|---|
| types.ts | Contratos de dados, opções e snapshots |
| random.ts | Hash FNV-1a e PRNG Mulberry32, seleção simples e ponderada |
| generateStamp.ts | Orquestração e antirrepetição de novas coleções |
| icons.ts / icon-data.ts | Registro, normalização, aliases e sanitização |
| shapes.ts | Geometrias, áreas internas e composições compatíveis |
| theme.ts | Paleta, tokens e contraste |
| formatters.ts | Datas civis, número da visita, XML e ajuste do texto |
| renderer.ts | SVG determinístico, máscaras, filtros e acessibilidade |
| export.ts | Blob SVG, PNG em Canvas e data URL |
| react.tsx | TourismStamp, StampPreview e StampCollection |

`index.ts` é a entrada sem dependência de framework. O React importa `react.tsx` separadamente. Isso evita inserir React em integrações Node, Vue, Svelte ou HTML.

O objeto GeneratedStamp copia a definição da forma e do ícone. Registros posteriores não mudam o snapshot já criado. A seed, as versões e o snapshot devem ser persistidos junto à visita. Uma atualização futura precisa manter o renderer v1 e criar outro renderer para novas versões. Não altere as regras de v1 silenciosamente.

Nenhum processo de geração depende de IA, rede, Canvas persistente ou WebGL. Canvas existe apenas na exportação PNG. Os SVGs possuem IDs exclusivos por instância no adaptador React, usando useId para evitar colisões e diferenças de hidratação.
