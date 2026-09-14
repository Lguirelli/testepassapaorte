# GitHub Pages deployment

A pasta `docs/` é documentação técnica e **não** deve ser configurada como source do GitHub Pages.

A publicação usa `.github/workflows/deploy-pages.yml`, que envia exclusivamente `github-pages/` como artefato do Pages. Dessa forma, a documentação técnica nunca vira a homepage pública.

A prévia do Pages é estática. O produto Next.js completo continua sendo o runtime canônico do repositório e exige Node.js/PostgreSQL para recursos server-side.
