# GitHub Pages — estado atual

A prévia estática oficial permanece em `github-pages/`.

A configuração atual do GitHub Pages publica a partir da branch e usa o `index.html` da raiz como bootstrap. Esse arquivo define `<base href="./github-pages/">` e carrega a mesma superfície, CSS e JavaScript de `github-pages/index.html`, evitando duas versões visuais diferentes.

Regras de manutenção:

- `github-pages/` é a fonte da prévia estática;
- `index.html` da raiz deve espelhar `github-pages/index.html` e acrescentar apenas o `<base href="./github-pages/">`;
- `docs/` é documentação e nunca deve ser tratado como homepage;
- o produto Next.js da raiz continua sendo publicado separadamente na Vercel;
- mudanças na prévia devem passar por `npm run validate:static` e pelos testes Playwright visuais.
