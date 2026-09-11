# Pesquisa de pontos turísticos de Serra Negra

Consulta realizada em **10/09/2026** para a build de validação. O objetivo é criar páginas internas navegáveis antes da integração editorial definitiva. Informações sujeitas a mudança, como horários, preços e regras de acesso, devem ser reconferidas antes da publicação de produção.

## Critério

- prioridade para páginas oficiais da Prefeitura de Serra Negra;
- fotografias temporárias com fonte e licença documentadas;
- cada página possui também um JPG real local em `assets/tourism/` como fallback; nenhuma página nova depende de fallback vetorial;
- quando não foi encontrada fotografia claramente identificada como o atrativo específico, a página usa imagem de banco ou imagem geral de Serra Negra e marca isso explicitamente;
- duração de visita é uma **estimativa editorial da demo**, não uma informação oficial;
- os três pontos sintéticos antigos continuam no dataset apenas para não quebrar o roteiro demonstrativo, mas foram retirados da descoberta pública.

## Páginas criadas

| Atrativo | Horário/estado consultado | Localização | Fonte oficial | Imagem | Status da foto |
|---|---|---|---|---|---|
| Fontana di Trevi em Serra Negra | Aberta diariamente | Avenida Deputado Campos Vergal, Centro, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Wikimedia Commons · Rosanetur · CC BY 2.0 | foto do local |
| Mirante do Alto da Serra | Diariamente, em horário comercial | Complexo Turístico Lucillo Marchi, Rua Paulo Marchi, Barrocão, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Wikimedia Commons · Mark Hillary · CC BY 2.0 | foto do local |
| Mirante do Cristo Redentor | Diariamente, em horário comercial | Rua Cristo Redentor, 157, Vale do Sol, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Wikimedia Commons · Mark Hillary · CC BY 2.0 | foto do local |
| Parque Ecológico Adib João Dib | Diariamente, das 07h às 18h | Estrada Municipal Antônio Perli, Posses, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/o-que-fazer/-o-que-fazer-em-serra-negra | Pexels · André Ulysses De Salis · Pexels License | imagem temporária relacionada |
| Parque Ecológico Dr. Jovino Silveira | Diariamente, das 07h às 18h | Avenida Joaquim de Araújo Almeida, 80, Posses, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Pexels · André Ulysses De Salis · Pexels License | imagem temporária relacionada |
| Teleférico Serra Negra | 10h às 17h; fechado às quartas | Praça João Pessoa, 143, Centro, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Wikimedia Commons · Heitor Carvalho Jorge · CC BY 3.0 | foto do local |
| Igreja Matriz Nossa Senhora do Rosário | Visitação e celebrações: consultar a paróquia | Praça Lourenço Franco de Oliveira, Centro, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Wikimedia Commons · Edson Aoki · CC BY-SA 3.0 | foto do local |
| Parque Fonte Santo Agostinho | Horário não informado na fonte consultada | Rua Paul Harris, região central, Serra Negra - SP | https://serranegra.sp.gov.br/servicos/fontes/historico-das-fontes | Wikimedia Commons · enioprado · CC BY-SA 3.0 | imagem temporária relacionada |
| Parque das Fontes | Horário não informado na fonte consultada | Avenida Deputado Romeu de Campos Vergal, próximo ao Paço Municipal, Serra Negra - SP | https://serranegra.sp.gov.br/servicos/fontes/historico-das-fontes | Wikimedia Commons · enioprado · CC BY-SA 3.0 | imagem temporária relacionada |
| Praça das Rotas Turísticas | Espaço público; horário específico não informado | Avenida Governador Laudo Natel, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Wikimedia Commons · Renato M. E. Sabbatini · CC BY-SA 2.5 | imagem temporária relacionada |
| Feira de Artesanato de Serra Negra | Sábados, domingos e feriados, das 9h às 18h | Praça Sesquicentenário, Centro, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Pexels · Rhian Sousa · Pexels License | imagem temporária relacionada |
| Parque Aquático Municipal Sebastião Carlos D’Andrea Colchetti | Terça a domingo, das 9h às 17h | Rua Antônio Jorge José, 227, Estância Suíça, Serra Negra - SP | https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos | Pexels · Caleb Oquendo · Pexels License | imagem temporária relacionada |

## Fontes principais

- Prefeitura de Serra Negra, Principais Atrativos Turísticos Públicos: https://www.serranegra.sp.gov.br/turismo/turismo-em-serra-negra/principais-atrativos-turisticos-publicos
- Prefeitura de Serra Negra, O que fazer em Serra Negra: https://www.serranegra.sp.gov.br/turismo/o-que-fazer/-o-que-fazer-em-serra-negra
- Prefeitura de Serra Negra, Histórico das Fontes: https://serranegra.sp.gov.br/servicos/fontes/historico-das-fontes

As páginas de imagens individuais do Wikimedia Commons e do Pexels estão registradas em `tourism-data.js` no campo `imageAsset.sourcePage`.
