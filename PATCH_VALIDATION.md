# Patch V8 — validação executada

Validações realizadas antes do empacotamento:

- aplicação do patch sobre uma cópia do repositório V7;
- `node scripts/validate-design-system.mjs` — passou;
- `node scripts/validate-repository.mjs` — passou;
- `python3 scripts/validate_showcase.py` — 10 páginas, referências locais resolvidas;
- parsing de todos os workflows YAML — passou;
- `npm ci --ignore-scripts --dry-run --offline --no-audit --no-fund` — passou, 877 pacotes resolvidos;
- Chromium isolado: tokens computados `#E7E7DE`, `#141416` e stacks Cuturila/Bebas, Arimo, Cormorant Garamond e Inter confirmados.

Observação: arquivos de fonte não são redistribuídos. Cuturila depende de uma cópia licenciada instalada no projeto e cai para Bebas Neue quando ausente.
