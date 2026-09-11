# PSD ANALYSIS HOME

## Fonte analisada

Arquivo recebido no ambiente: `landing page(4).psd`.

O nome difere do nome citado no prompt (`landing page(3).psd`), mas este era o PSD efetivamente anexado e foi tratado como a fonte da Home.

## Canvas

- Dimensão total: **1920 × 10533 px**
- Perfil: sRGB, 8 bits
- Composite disponível e renderizável via ImageMagick
- 12 recortes/layers raster detectáveis além do composite
- A estrutura interna não pôde ser lida com `psd-tools`, pois a biblioteca não estava instalada e o ambiente não permitiu baixá-la. ImageMagick, entretanto, expôs as páginas/layers com dimensões e offsets suficientes para mapear a composição.

## Layers detectadas

| Layer | Dimensão | Offset no canvas | Leitura visual |
|---|---:|---:|---|
| 01 | 1560 × 1080 | +180 +0 | Hero editorial, header sobre imagem, busca central |
| 02 | 1560 × 802 | +180 +1080 | Descoberta imersiva com imagem grande e cards horizontais |
| 03 | 1560 × 788 | +180 +1882 | Área escura com quatro cards de roteiros |
| 04 | 1560 × 750 | +180 +2834 | Rota hero com paisagem, chamada e linha de percurso |
| 05 | 1560 × 783 | +181 +3584 | Editorial claro, texto, card vertical e dados auxiliares |
| 06 | 1560 × 1014 | +181 +4363 | Cards de categorias e conteúdo editorial em fundo claro |
| 07 | 1560 × 816 | +180 +5213 | Colagem contextual, mapas e pequenos módulos informacionais |
| 08 | 1560 × 1278 | +180 +6029 | Mosaico de interesses/serviços em fundo quente |
| 09 | 1561 × 1029 | +179 +7307 | Bloco escuro de credibilidade/FAQ com card lateral |
| 10 | 1559 × 792 | +181 +8336 | CTA verde escuro, formulário/entrada e linha de jornada |
| 11 | 1560 × 808 | +180 +9128 | Visual territorial com mapa e narrativa |
| 12 | 1560 × 597 | +180 +9936 | Fechamento claro e CTA final |

## Estrutura inferida

1. Header transparente sobre hero.
2. Hero fotográfico em tela ampla, título de grande escala e barra de busca.
3. Módulo de descoberta imersivo, com texto à esquerda e cards em trilho horizontal.
4. Bloco escuro de roteiros populares.
5. Rota em destaque, com imagem full width e linha de percurso sobreposta.
6. Seção editorial clara com conteúdo assimétrico.
7. Categorias com cards fotográficos.
8. Descoberta contextual com colagem modular.
9. Mosaico de interesses em fundo bege.
10. Área escura de perguntas/credibilidade.
11. CTA de planejamento em verde escuro.
12. Bloco territorial com mapa gráfico.
13. CTA final e footer.

## Proporções e ritmo

- O PSD trabalha com uma área central aproximada de **1560 px** dentro do canvas de 1920 px, deixando margens laterais próximas de 180 px.
- A composição alterna seções muito escuras e muito claras para criar capítulos visuais.
- O ritmo vertical é longo e editorial, com variação de alturas entre aproximadamente 600 e 1278 px.
- Existem layouts intencionalmente assimétricos. A reconstrução não força grade de 12 colunas.
- Títulos usam escala editorial grande e serifada; microcopy, navegação e labels são pequenos e utilitários.

## Paleta dominante inferida

- preto quase absoluto;
- creme quente;
- branco quebrado;
- verde floresta;
- oliva;
- dourado fosco;
- terracota;
- cinza azulado em módulos territoriais.

A implementação transforma essa leitura em tokens CSS, mantendo contraste e alternância de superfícies.

## Imagens

O PSD é uma colagem de referências visuais e contém identidades/textos de terceiros. Por isso, **nenhuma seção foi usada como screenshot integral dentro do HTML**.

Foram criados recortes temporários apenas de áreas fotográficas sem logos, com conversão para WebP. Eles servem como placeholders visuais durante a validação. Antes de produção, devem ser substituídos por fotografia aprovada de Serra Negra e parceiros.

## Comportamento responsivo inferido

- Desktop: composição larga com duas ou três colunas quando apropriado.
- 1024 px: redução de navegação e rearranjo de blocos editoriais.
- 768 px: seções passam a uma coluna ou duas colunas simples.
- 390 px: narrativa vertical, botões e campos em largura total, cards e colagens simplificados.

## Decisões deliberadas

- Logos e textos externos foram substituídos por conteúdo do Passaporte Serra Negra.
- A tipografia original não foi incorporada. Foram usados Georgia e system UI para manter contraste editorial/utilitário sem depender de fontes proprietárias.
- O mapa do PSD foi reinterpretado como SVG/CSS próprio.
- Cards são elementos HTML reais e movem o card inteiro no hover.
