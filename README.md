# Passaporte Serra Negra · demonstração visual v2

A entrada principal deste repositório é a **experiência navegável do Passaporte Serra Negra**, publicada diretamente pela raiz no GitHub Pages.

A Home e a página pública de parceiro foram reconstruídas a partir do **Kit Visual e Guia de Construção v2**, preservando os fluxos funcionais da validação anterior. A demonstração continua usando apenas dados sintéticos.

## Abrir como site

Em **Settings → Pages**, selecione **GitHub Actions**. O workflow `Deploy functional demo` publica `index.html` e os assets da raiz.

Depois da publicação, a URL do Pages abre diretamente a Home funcional, não o README.

## O que navegar

- Home visual v2, com descoberta, pontos turísticos, parceiros, rota, tipos de roteiro, categorias, FAQ, Passaporte e mapa;
- Explorar com busca e filtros;
- página pública visual v2 de parceiros;
- landing “Para parceiros”;
- onboarding e roteiro editável;
- calendário integrado ao roteiro;
- Meu Passaporte;
- Admin demo com rascunho, preview e publicação local.

A camada técnica, testes e relatórios continuam no repositório apenas como suporte de desenvolvimento e validação.

## Paleta visual

A demonstração usa a paleta principal oficial fornecida para o Passaporte Serra Negra. Grandes superfícies, header, CTAs, fundos, textos e bordas usam grafite, carvão, creme e cinzas quentes. As cores complementares são reservadas a contextos de nicho, como categorias, chips, carimbos, pinos e pequenos destaques. A especificação está em `docs/visual/PALETA_OFICIAL.md`.
## Identidade e regras aplicadas

Esta revisão usa diretamente o SVG oficial fornecido para o projeto em `assets/brand/logo-passaporte-serra-negra.svg`. O arquivo é byte a byte igual ao original preservado em `references/brand/Ativo 2logo passaporte.svg`.

A demonstração também aplica as regras de construção compatíveis com GitHub Pages: transparência de privacidade/cookies, 404 útil, metadados por rota, breadcrumbs, acessibilidade e `robots.txt`. Recursos que exigem backend seguro, como RBAC/Clerk, não são simulados como proteção real. O arquivo recebido com as regras foi preservado em `references/CONSTRUCTION_RULES_2026-09-10.md`.
