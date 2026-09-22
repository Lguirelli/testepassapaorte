# Publicação no GitHub

Este repositório contém duas camadas diferentes:

1. **Produto completo em Next.js** — `src/`, banco, autenticação, Server Actions e APIs. Requer um runtime Node.js e PostgreSQL em produção.
2. **Prévia navegável do GitHub Pages** — `github-pages/`. É estática, mas usa a mesma linguagem de UX/UI, tokens, SVGs, hierarquia e regras responsivas do produto para apresentação pública.

## Ativar a prévia no GitHub Pages

1. Envie todo o repositório para o branch `main`.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. Abra **Actions** e confirme a execução de `Deploy GitHub Pages Preview`. O workflow só publica depois das auditorias de UX/UI, responsividade e sanitização passarem.
5. Em **Settings → Pages**, use **Visit site**.

Não selecione `Deploy from a branch` apontando para a raiz ou para `/docs`. Se fizer isso, o GitHub pode interpretar `README.md` ou documentação como entrada do site.

## Produto completo

GitHub Pages não executa o backend do Next.js. Para autenticação, banco, APIs, QR persistente, Admin, área do parceiro e roteiro persistente, implante o mesmo repositório em um host com runtime Node.js e configure as variáveis de `.env.example`.

O workflow `Validate Full Next.js Product` valida o produto completo em cada push/PR, mas não tenta hospedá-lo no GitHub Pages.
