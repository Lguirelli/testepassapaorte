# Proveniência dos assets

Icon System v2 e documentação mestre: fornecidos pelo usuário no kit de validação, preservados nos diretórios de referência e integrados sem trocar por bibliotecas externas. Esta entrega não presume uma licença pública que não tenha sido declarada no material de origem.

Placeholders locais: formas geométricas neutras criadas para validação, sem fotografias externas. Screenshots: capturas da aplicação de demonstração produzidas nesta execução. Dados: fixtures sintéticos fornecidos no kit. Não representam dados turísticos confirmados.

Dependências: versões e pacotes no package-lock.json; licenças seguem os respectivos pacotes. Não há concessão de licença de terceiros por este documento.

Visual v2: a nova camada pública usa somente CSS, ícones já presentes e dados sintéticos do projeto. As 20 imagens de referência anexadas ao briefing foram analisadas como referência de composição e não foram incorporadas à interface nem redistribuídas nesta entrega. O guia textual e o manifesto de origem foram preservados em `references/visual-v2/` para continuidade técnica.

## Marca oficial fornecida pelo usuário

- `assets/brand/logo-passaporte-serra-negra.svg`: cópia byte a byte do arquivo fornecido pelo usuário `Ativo 2logo passaporte.svg`.
- `references/brand/Ativo 2logo passaporte.svg`: preservação do arquivo original dentro das referências do repositório.
- SHA-256 do SVG: `a3de3eabe39a00463207c8ad0afc3bd76e382b710efc30aabc1bc98e6d68071e`.
- `assets/brand/logo-passaporte-serra-negra.png`: derivado raster gerado localmente apenas para ícone/social preview; o SVG original é o ativo usado na interface.
- Origem/licença: ativo fornecido diretamente pelo usuário para uso neste projeto; confirmar termos formais de titularidade/licenciamento antes de publicação comercial definitiva.

## Fotografias Pexels para validação dos cards

Esta revisão adiciona fotografias externas do Pexels apenas para melhorar a leitura visual dos cards e módulos de demonstração. As fotografias não representam os lugares fictícios nomeados no dataset e permanecem identificadas na interface como imagens ilustrativas.

A licença consultada informa uso gratuito em sites e aplicativos, possibilidade de modificação e atribuição não obrigatória. A lista completa de autores e páginas-fonte está em `ASSET_SOURCES_STOCK_IMAGES.md`. As fotografias do Pexels continuam carregadas remotamente de `images.pexels.com`; os binários originais do Pexels não são redistribuídos neste pacote. O repositório inclui oito JPGs locais independentes em `assets/stock/` usados somente como fallback visual quando a rede/CDN não estiver disponível.
