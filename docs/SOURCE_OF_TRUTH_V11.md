# Fontes de verdade — repositório consolidado v11

Este repositório consolida três linhas de trabalho sem misturar responsabilidades.

## 1. Experiência visual executável

A raiz estática é a referência atual de UX/UI premium:

- `index.html`
- `app.js`
- `styles.css`
- `visual.css`
- `visual-v2.css`
- `theme.css`
- `partners-page.js`
- `partners-page.css`
- `tourism-data.js`
- `tourism-pages.css`
- `assets/`

Ela contém as melhorias até a v10: hero fotográfico, header transparente, movimento lateral suave, shared transitions, hover do card inteiro, sistema de ícones, dark mode, mapa/lista, roteiro manipulável e Passaporte com a folha SVG fornecida.

## 2. Base de produção Next / dados / CMS

`src/` é a base técnica de produção.

Nesta consolidação foram incorporadas do `LATEST(4)`:

- `src/modules/admin/service.ts`;
- separação `editorialDataset()` / `publicDataset()`;
- `visibleDataset()`;
- regras de categorias ativas e ordenação editorial;
- regras de integridade de parceiros/lugares;
- controle de concorrência por versão;
- fluxo transacional do Admin;
- `scripts/verify-admin.ts`.

A raiz estática não deve importar diretamente código de `src/`.

## 3. Referência visual dos PSDs

`references/psd-html-reference/` contém as reconstruções HTML e screenshots do material PSD.

Uso correto:

- composição;
- proporções;
- ritmo vertical;
- hierarquia editorial;
- estrutura da Home;
- estrutura da página individual de parceiro;
- validação responsiva.

Esses arquivos não fazem parte do deploy público e não são o runtime final.

## Regra para futuras páginas

- **Visual/composição:** `references/psd-html-reference/`
- **Interações premium:** raiz estática v10+
- **Dados/CMS/regras:** `src/`
- **Ícones:** `assets/icons-v3/`
- **Marca:** `assets/brand/`
- **Fotografias finais:** acervo real aprovado

## Páginas prioritárias

1. Reconstruir a página individual `#/parceiros/:slug` com a composição do PSD Partner, mantendo dados e ações dinâmicas.
2. Reconciliar a Home com os 12 blocos da referência, preservando a inteligência e as interações da versão premium.
3. Migrar progressivamente essas superfícies para os componentes Next em `src/` sem regressão visual.
