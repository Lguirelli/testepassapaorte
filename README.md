# Passaporte Serra Negra

> **GitHub Pages:** a página pública é publicada automaticamente a partir de `github-pages/` pelo workflow `.github/workflows/deploy-pages.yml`. O repositório em si continua exibindo este README, como todo projeto no GitHub. Para ativar o site: **Settings → Pages → Source: GitHub Actions**. Veja `GITHUB_DEPLOY.md`.

Plataforma turística de Serra Negra, SP, reconstruída como **um único runtime Next.js**. O produto conecta descoberta, planejamento, roteiro persistente, calendário, registro de presença por QR, Passaporte digital, compartilhamento, área do parceiro e Admin operacional/inteligência.

## Requisitos

- Node.js 22+
- npm
- Desenvolvimento simples: PGlite local, sem serviço externo
- Produção recomendada: PostgreSQL 16+; PostGIS pode ser ativado quando consultas territoriais exigirem
- Chromium somente para a suíte Playwright

## Início rápido

```bash
npm ci
cp .env.example .env.local
npm run local
```

`npm run local` aplica migrations, executa o seed idempotente e inicia o Next.js em `http://localhost:4173` usando PGlite por padrão.

Para PostgreSQL local:

```bash
docker compose up -d
# ajuste DB_MODE=postgres e DATABASE_URL em .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

## Comandos

```bash
npm run dev
npm run build
npm start
npm run lint
npm run typecheck
npm test
npm run playwright:install
npm run test:e2e
npm run test:e2e:remote -- https://seu-deploy.vercel.app
npm run validate:static
npm run security:scan
npm run audit:sanitize
npm run audit:responsive
npm run audit:uxui
npm run privacy:cleanup
npm run db:sanitize
npm run validate
npm run db:migrate
npm run db:seed
npm run local:prepare
```

## Autenticação

A autorização é validada no servidor por sessões assinadas e persistidas em `auth_sessions`. O adaptador de credenciais local existe para desenvolvimento e deve ser configurado por variáveis de ambiente. Papéis atuais: `tourist`, `partner` e `admin`.

O frontend controla visibilidade. O backend controla acesso, ownership e permissões.

## Dados

A descoberta pública usa 12 atrativos pesquisados de Serra Negra com proveniência registrada. Negócios/parceiros sintéticos permanecem apenas como dados funcionais de demonstração e são marcados `synthetic=true`; não são apresentados como parceiros reais confirmados.

O antigo JSONB editorial não é fonte pública. `editorial_drafts` é staging de edição/preview. Lugares, parceiros, experiências, viagens, dias, itens, visitas, QR e tracking usam tabelas relacionais.

## Privacidade

Analytics opcional depende de consentimento. IDs anônimos e sessões técnicas são separados da identidade civil. Identidades operacionais derivadas de login usam HMAC com `IDENTITY_PEPPER` independente do segredo de sessão. QR representa evidência de presença e **não** comprova compra, reserva, consumo ou gasto. O produto não grava trilha GPS contínua por padrão.

## Sanitização e segurança de informação

Toda entrada externa é tratada na fronteira: schemas estritos/allowlists, normalização antes da persistência quando segura, validação de URLs/redirects/assets, escaping na saída e minimização/redaction em analytics, logs e auditoria. Use `npm run security:scan` para procurar material sensível. O desenho completo está em `docs/SANITIZATION_AND_PRIVACY.md`. Para uma base já existente, execute `npm run db:sanitize`; para retenção configurável, execute `npm run privacy:cleanup`.

Em produção, `DATABASE_URL` é obrigatória para as superfícies dinâmicas. `NEXT_PUBLIC_SITE_URL` pode ser definida explicitamente; na Vercel, o runtime também reconhece `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL`. PGlite, credenciais `.local` e segredos de demonstração são recusados.

## UX/UI

O runtime canônico e a prévia do GitHub Pages compartilham as mesmas invariantes de UX/UI: hierarquia de ação, targets de aproximadamente 44 px, foco visível, teclado/touch, SVGs próprios, motion funcional, reduced motion, feedback contextual e responsividade intrínseca. A prévia pública não utiliza Material Symbols.

`npm run audit:uxui` impede regressões estruturais e o workflow de Pages executa a auditoria antes de publicar. Consulte `docs/UX_UI_SYSTEM.md` e `docs/UX_UI_AUDIT_REPORT.md`.

## Responsividade

A responsividade é contínua e orientada pelo espaço disponível, conteúdo e método de entrada, não por uma taxonomia fixa de dispositivos. Grids usam largura útil dos itens, componentes reutilizáveis podem responder ao próprio container, safe areas são respeitadas e `svh`/`dvh` substituem suposições de altura fixa. O Passaporte usa `ResizeObserver` do próprio livro para alternar entre uma ou duas páginas sem apagar o estado atual.

`npm run audit:responsive` verifica invariantes responsivos sem depender de browser. A suíte `tests/e2e/05-responsive.spec.ts` complementa a validação com resize contínuo, larguras intermediárias aleatórias, landscape/baixa altura, texto a 200%, overflow e preservação de estado. Consulte `docs/RESPONSIVE_SYSTEM.md`.

## Estrutura

- `src/app` — rotas Next.js
- `src/core` — auth, banco, i18n e routing
- `src/modules` — domínio por capacidade
- `src/design-system` — tokens e ícones SVG
- `drizzle` — migrations
- `seed` — dados reais/proveniência e dados sintéticos explicitamente marcados
- `tests` — unitários e E2E
- `docs` — arquitetura, rotas, permissões, dados, migração e QA

## Estado de validação desta entrega

A auditoria estática do repositório passa. Playwright Python 1.57 + Chromium 144 executaram smoke real neste ambiente. O `npm ci` completo do runtime continua bloqueado localmente por indisponibilidade do registry, portanto `lint`, `typecheck`, `build` e a suíte TypeScript Playwright/Axe completa desta revisão não são declarados como aprovados localmente. O GitHub Actions agora instala Chromium e executa E2E/Axe automaticamente. Consulte `docs/TEST_REPORT.md` e `docs/KNOWN_LIMITATIONS.md`.

## Deploy no Vercel

Para o produto completo, use a raiz do repositório no Vercel. Veja `VERCEL_DEPLOY.md` para banco, segredos, migração, seed e validação. A pasta `github-pages/` é somente a prévia estática do GitHub Pages.

## Interações premium no runtime Next.js

A versão Vercel inclui a camada de movimento aprovada: Warp Text responsivo ao pointer, Dock por proximidade, Circular Gallery com drag/inércia/snap, profundidade/blur progressivos, slider horizontal de roteiros, FAQ orgânico, microinterações de cards/mapa e transição horizontal de entrada entre rotas. Todos os efeitos possuem fallback para touch e `prefers-reduced-motion`.

O sitemap é build-safe na Vercel e não consulta o banco durante prerender sem `DATABASE_URL`. O banco continua obrigatório para as superfícies dinâmicas do produto em produção.


## Playwright e QA em browser real

O repositório inclui `@playwright/test` e `@axe-core/playwright` como dependências de desenvolvimento fixadas. Para preparar o Chromium localmente, execute `npm run playwright:install`; em CI, `npm run playwright:install:ci`. A suíte completa roda com `npm run test:e2e`. Para validar um deployment Vercel existente, use `npm run test:e2e:remote -- https://seu-deploy.vercel.app`. Consulte `docs/PLAYWRIGHT_QA.md`.
