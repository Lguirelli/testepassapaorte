# Template compartilhado de páginas de lugar

As páginas em `#/lugares/{slug}` agora usam a mesma família visual das páginas individuais de parceiros em `#/parceiros/{slug}`.

## Estrutura compartilhada

1. Hero fotográfico imersivo.
2. Barra de informações rápidas.
3. Bloco editorial com texto + composição de imagens.
4. Faixa escura de destaques.
5. Informações práticas com resumo lateral da viagem.
6. Localização.
7. Continuidade de exploração.

## Diferenças semânticas

- parceiro: dados comerciais, experiências e canais demonstrativos;
- ponto turístico: pesquisa pública, horários, custo, endereço, destaques e link para fonte oficial;
- nenhuma informação comercial foi inventada para pontos públicos;
- roteiro e registro no Passaporte continuam disponíveis nos dois tipos de página.

O layout reaproveita diretamente os componentes e classes usados por `renderPartner()`, evitando um segundo sistema visual para páginas de detalhe.
