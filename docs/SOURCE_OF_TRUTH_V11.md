# Fonte de verdade atual do repositório

> Atualização de arquitetura: a antiga divisão entre uma SPA estática visual e uma base Next foi encerrada. Este arquivo substitui a orientação anterior da v11.

## 1. Runtime único

A única aplicação executável é **Next.js em `src/`**.

Não existe mais uma segunda aplicação em `index.html`, `app.js`, arquivos CSS da raiz ou diretórios HTML de redirects. Qualquer implementação nova de página, interação, navegação ou regra visual deve entrar no runtime Next.

## 2. Dados, CMS e regras

A fonte de dados dinâmica permanece em:

- `src/modules/content/`;
- `src/core/db/`;
- `seed/`;
- módulos de Admin em `src/modules/admin/`.

Atrativos públicos pesquisados que antes eram injetados em `tourism-data.js` agora fazem parte do seed dinâmico.

## 3. Rotas e tipos de página

- URLs e navegação: `src/core/routing/routes.ts`;
- classificação funcional das páginas: `src/core/routing/page-kind.ts`;
- `/parceiros`: aquisição/institucional;
- `/parceiros/[slug]`: detalhe de parceiro;
- `/lugares/[slug]`: detalhe de ponto turístico;
- `/explorar?relation=public_point`: pontos turísticos;
- `/explorar?view=map`: mapa.

## 4. Estilos

- base compartilhada: `src/app/globals.css`;
- efeitos/componentes específicos: CSS Modules junto aos componentes/páginas;
- não adicionar novamente folhas globais concorrentes na raiz;
- movimento deve ser opt-in por componente, não aplicado por seletores genéricos compartilhados.

## 5. Referências visuais

`references/` continua sendo material de consulta para composição e comparação. Esses arquivos não são runtime e não devem voltar a ser publicados como uma aplicação paralela.

## 6. Deploy

A aplicação usa build Next `standalone`. GitHub Pages foi removido porque não executa SSR. Consulte `docs/DYNAMIC_ARCHITECTURE.md`.
