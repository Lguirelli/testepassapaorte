# Playwright QA

O Playwright faz parte do gate de qualidade do Passaporte Serra Negra. Ele valida o runtime Next.js real, não a prévia estática do GitHub Pages.

## Instalação local

```bash
npm ci
npm run playwright:install
```

Em Linux CI, use:

```bash
npm run playwright:install:ci
```

Isso instala o Chromium esperado pela versão fixada de `@playwright/test`.

## Execução local completa

```bash
npm run test:e2e
```

O `playwright.config.ts` inicia automaticamente `scripts/e2e-server.mjs`, que prepara um banco PGlite isolado em `.data/e2e`, aplica migrations/seed e sobe o runtime em `http://localhost:4173`.

A suíte cobre:

- 390×844;
- 768×1024;
- 1366×936;
- 1440×900;
- reduced motion dedicado;
- larguras aleatórias 347, 529, 713, 887, 1113 e 1371 px;
- baixa altura e landscape;
- texto ampliado a 200%;
- preservação de estado durante resize;
- ausência de overflow horizontal acidental;
- Axe em fluxo público;
- Dock por proximidade;
- Warp Text;
- Circular Gallery por teclado/wheel/ação lateral;
- slider de roteiro por tabs e teclado;
- FAQ;
- Card Nav mobile, Escape e retorno de foco;
- pins do mapa por teclado;
- turista, parceiro, Admin, QR e Passaporte.

Falhas preservam trace, screenshot e vídeo. O relatório HTML fica em `playwright-report/`.

## Validar um deploy Vercel

Depois do deploy:

```bash
npm run test:e2e:remote -- https://seu-projeto.vercel.app
```

Por padrão, a execução remota cobre somente superfícies públicas/visuais (`00-public`, `05-responsive` e `06-interactions`) e usa `EXTERNAL_SERVER=1`, portanto não inicia o servidor local. Para incluir fluxos autenticados:

```bash
npm run test:e2e:remote -- https://seu-preview.vercel.app --full
```

As credenciais remotas podem ser fornecidas por `E2E_TOURIST_EMAIL`, `E2E_TOURIST_PASSWORD`, `E2E_PARTNER_EMAIL`, `E2E_PARTNER_PASSWORD`, `E2E_ADMIN_EMAIL` e `E2E_ADMIN_PASSWORD`. Use um ambiente Preview dedicado; nunca automatize contas reais de produção.

## CI

`.github/workflows/ci.yml` possui um job `e2e` separado que:

1. executa `npm ci`;
2. instala Chromium com dependências do sistema;
3. executa `npm run test:e2e`;
4. envia `playwright-report/`, `test-results/` e `docs/validation/` como artifact mesmo em caso de falha.

## Regra de aceitação

Uma mudança visual/interativa não deve ser considerada validada apenas por auditoria estática. Para release, preferir a combinação:

```text
validate:static
+ typecheck
+ lint
+ unit tests
+ build
+ Playwright E2E
+ Axe
```

Quando o ambiente impedir uma dessas etapas, registrar explicitamente como não executada.
