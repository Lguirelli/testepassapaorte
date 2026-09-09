# Pesquisa e decisões de projeto

## Referência fornecida

A imagem enviada usa carimbos com tinta monocromática, contornos duplos, pequenas rotações, nomes condensados, composições em arco e desgaste. Foram aproveitados esses princípios, sem copiar cada desenho. As vinhetas secundárias foram removidas para manter apenas um pictograma de nicho. Os dados de exemplo são demonstrativos; a imagem não é uma fonte de dados cadastrais dos estabelecimentos.

## Referências técnicas

- [Lucide](https://lucide.dev/): consistência e imports selecionados. Os nós necessários foram extraídos do pacote instalado v1.31.0; licença ISC preservada. A biblioteca do laboratório não representa o catálogo inteiro do Lucide.
- [MDN: seed em SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/seed): seed determina a origem da textura pseudoaleatória.
- [MDN: feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence): ruído procedural utilizado para desgaste; combinado com máscara e composição de alfa.
- [Oswald no Fontsource](https://fontsource.org/fonts/oswald): alternativa condensada considerada. A entrega usa DejaVu Sans Bold local para evitar dependência de download externo.
- [Segmentação do turismo, Paraná Turismo](https://www.paranaturismo.pr.gov.br/sites/turismo/arquivos_restritos/files/documento/2020-09/regionalizacaosegmentacaopr2020.pdf): referência pública para a amplitude de segmentos. A taxonomia técnica é uma organização própria para o produto, não uma classificação oficial ou certificação.

## Decisões

SVG é a fonte principal. Canvas é usado só para PNG. A textura é determinística e mais leve no texto. O PRNG Mulberry32 recebe hash FNV-1a; nenhuma escolha persistente usa Math.random. O ícone depende do nicho, enquanto o sorteio define forma, composição, tinta, rotação e ruído.

SSR não depende de medições do navegador. A largura do texto é ajustada por estimativa e textLength, com fonte local constante. O wrapper React usa useId para separar IDs de máscaras e arcos. A exportação standalone incorpora a fonte. A paleta foi escurecida onde necessário para melhorar leitura sobre o papel.

A biblioteca cobre o conjunto de nichos do briefing e aliases adicionais. Alguns nichos próximos compartilham símbolo. Novos ícones e aliases podem ser registrados sem mudar a lógica principal. O ícone próprio de cachoeira representa uma queda d'água, evitando que ela seja confundida com lago ou rio.

## Limites e evolução

Não há validação de visita, autenticação da aplicação, QR, NFC, banco de dados ou sistema de benefícios. O motor recebe visitas já validadas. A sessão local serve à demonstração; uma implantação real deve persistir snapshots e versões no backend.

A aparência é vetorial e procedural, inspirada na referência. Não se trata de reprodução fotográfica da tinta. Texto em miniaturas é resumido por níveis de detalhe. Versões futuras devem conservar a implementação v1 para não alterar carimbos históricos.
