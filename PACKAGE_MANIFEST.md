# Package manifest · Logo oficial + regras de construção

Esta entrega parte do Visual v2 com a paleta oficial e incorpora o SVG fornecido pelo usuário como ativo real de marca.

## Marca usada na interface

- `assets/brand/logo-passaporte-serra-negra.svg`: ativo carregado pelo Header e Footer e usado como favicon;
- `references/brand/Ativo 2logo passaporte.svg`: cópia preservada com o nome original;
- os dois SVGs são byte a byte idênticos ao arquivo recebido;
- SHA-256: `a3de3eabe39a00463207c8ad0afc3bd76e382b710efc30aabc1bc98e6d68071e`;
- `assets/brand/logo-passaporte-serra-negra.png`: derivado raster para preview/social icon.

## Regras de construção aplicadas à demo

- páginas funcionais de Privacidade, Termos, Cookies/armazenamento e Acessibilidade;
- 404 útil com busca e caminhos de retorno;
- títulos e meta descriptions por rota;
- breadcrumbs em páginas hierárquicas;
- `robots.txt` definido conscientemente para impedir indexação desta build de validação;
- nenhum analytics, pixel, CRM, mapa ou embed externo carregado nesta versão;
- nenhum banner de consentimento artificial, pois não existem cookies opcionais ativos;
- Admin explicitamente tratado como simulador local, sem fingir RBAC de produção;
- dados sintéticos, contatos demo bloqueados e ausência de avaliações/claims inventados preservadas.

## Regras que continuam sendo requisito de produção

Clerk/RBAC real em frontend e backend, textos jurídicos definitivos, identificação do operador, integrações, consentimento quando aplicável, fotografias reais/licenciadas, LocalBusiness schema com dados reais e auditoria completa de segurança/acessibilidade continuam dependentes da versão de produção.

## Verificação desta entrega

- `node --check app.js`: PASS;
- SVG válido como XML: PASS;
- identidade do SVG recebido x SVG usado: PASS byte a byte;
- referências de Header/Footer/favicon para o novo ativo: PASS;
- rotas legais e links no Footer: PASS por inspeção estática;
- `robots.txt`: PASS;
- não foi alegada nova validação visual de navegador nesta etapa.
