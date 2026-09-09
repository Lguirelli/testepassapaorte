# Patch GitHub + Chromium + Playwright + Design System V1 — V8

Extraia este ZIP **na raiz do repositório**, aceitando substituir os arquivos existentes.

Este patch contém tudo do V7 e acrescenta a integração do Design System V1 fornecido:

- paleta neutra oficial + accents de nicho;
- light/dark tokens;
- CuturilaDEMO com fallback Bebas Neue para a Home;
- Inter para UI/body;
- Arimo para títulos internos;
- Cormorant Garamond para subtítulos/editorial;
- tokens CSS/JSON no código e na showcase;
- `npm run design:check`;
- teste Playwright `design-system.spec.ts`;
- gate do Design System dentro de `01-quality`;
- Design System original preservado em `docs/design-system-v1/`.

A Cuturila não é redistribuída neste patch. Para produção, instale apenas uma versão devidamente licenciada; sem ela, Bebas Neue é usada automaticamente.

## Depois de aplicar

1. Faça commit e push.
2. Em `Actions`, rode `01-quality`, `02-playwright` e `03-visual-audit`.
3. Em Codespaces, rode `npm run pw:ui`.
4. Abra a porta 9323 para ver o Playwright UI e a porta 3000 para ver a aplicação.
5. Leia `docs/DESIGN_SYSTEM_INTEGRATION.md` e `docs/PLAYWRIGHT_GITHUB_GUIDE.md`.

## Validação local rápida

```bash
npm run design:check
npm run pw:design
```
