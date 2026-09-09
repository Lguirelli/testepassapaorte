# GitHub Pages — entrada visual garantida

Este repositório mantém a mesma showcase visual em três caminhos para evitar que o GitHub Pages publique documentação por engano:

1. `showcase/` — fonte canônica da showcase e usada pelo GitHub Action.
2. raiz do repositório — compatível com **Deploy from a branch / (root)**.
3. `docs/` — compatível com **Deploy from a branch /docs**.

A página inicial correta deve mostrar **Passaporte Serra Negra** e o hero "Descubra Serra Negra do seu jeito". Se aparecer "Pacote de documentação e referências", a publicação está apontando para um pacote de fontes/referências antigo ou para outro branch.

Para sincronizar as três cópias após alterações na showcase:

```bash
python scripts/sync_pages_entrypoints.py
```

Configuração recomendada: **Settings → Pages → Source → GitHub Actions**, usando `.github/workflows/showcase-pages.yml`.
