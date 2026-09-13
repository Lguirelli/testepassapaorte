# Relatório de correção — publicação no GitHub

## Causa

O repositório não possuía artefato de GitHub Pages nem workflow de publicação. Ao usar a raiz ou documentação como source, o GitHub Pages podia escolher `README.md`/Markdown como arquivo de entrada e exibir documentação técnica.

O runtime principal também utiliza recursos server-side do Next.js (cookies, Server Actions, Route Handlers, autenticação e banco), que não podem ser executados diretamente no GitHub Pages.

## Correção

- `github-pages/` contém uma prévia navegável estática, isolada do runtime principal.
- `.github/workflows/deploy-pages.yml` publica exclusivamente essa pasta.
- `index.html` na raiz funciona como fallback quando Pages ainda estiver configurado para publicar a raiz do branch.
- `.nojekyll` evita processamento indevido do conteúdo estático.
- `docs/` permanece documentação e não deve ser a source do Pages.
- `.github/workflows/ci.yml` valida o produto Next.js completo em separado.

## Configuração recomendada

`Settings → Pages → Build and deployment → Source → GitHub Actions`.
