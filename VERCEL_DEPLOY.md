# Deploy no Vercel

Este repositório deve ser importado pela raiz. Não use `github-pages/` como Root Directory.

## Configuração do projeto

- Framework Preset: Next.js
- Root Directory: `/`
- Install Command: padrão da Vercel (`npm install`/lockfile detectado)
- Build Command: `npm run build`
- Node.js: 22.x, fixado em `package.json`

## Variáveis obrigatórias para o runtime completo

O build pode concluir usando as variáveis de sistema da Vercel para a origem pública, mas a aplicação completa precisa de PostgreSQL em runtime.

Configure no Vercel, em **Settings → Environment Variables**:

- `DATABASE_URL`: PostgreSQL persistente acessível pelas Functions.
- `SESSION_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `IDENTITY_PEPPER`: segredo aleatório diferente de `SESSION_SECRET`, com pelo menos 32 caracteres.

Para autenticação por credenciais deste MVP, configure também os pares que realmente quiser habilitar:

- `TOURIST_EMAIL` / `TOURIST_PASSWORD`
- `PARTNER_EMAIL` / `PARTNER_PASSWORD` / `PARTNER_ID`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`

Nunca use os valores de demonstração de `.env.example` em produção.

`NEXT_PUBLIC_SITE_URL` é opcional no Vercel. Quando ausente, a aplicação usa `VERCEL_PROJECT_PRODUCTION_URL` ou `VERCEL_URL`. Para domínio customizado, prefira definir `NEXT_PUBLIC_SITE_URL=https://seu-dominio`.

## Banco

Depois de provisionar PostgreSQL e antes de validar os fluxos completos:

```bash
npm run db:migrate
npm run db:seed
```

Não use `DB_MODE=pglite` em produção. PGlite permanece restrito a desenvolvimento/teste local.

## Correções de compatibilidade Vercel incluídas nesta revisão

O log do deploy de 12/09/2026 expôs incompatibilidades que foram corrigidas:

- Drizzle 0.45.2: `.returning()` sem argumento nos updates de concorrência otimista;
- TypeScript 6.0.3: tipos explícitos de `intentions` e `needs` no onboarding;
- Node fixado em `22.x`;
- Open Graph executado em `nodejs`, removendo uso do Edge Runtime deprecated;
- origem pública compatível com as variáveis de sistema do Vercel;
- `npm run audit:vercel` adicionado ao gate `validate:static`.

## Validação após deploy

1. confirme que o build termina após `Running TypeScript`;
2. abra `/health` e valide conexão com PostgreSQL;
3. abra `/`, `/explorar`, `/mapa`, `/roteiro`;
4. execute login somente depois de configurar credenciais e banco;
5. valide `Admin` e `Painel do parceiro` apenas com contas explicitamente configuradas.

## Effects Restoration revision

O sitemap não depende mais de conexão com o banco durante o build. Isso permite concluir a fase de prerender mesmo quando variáveis de banco não são expostas à etapa de build.

Isso **não** torna o banco opcional para o produto completo. Para abrir Home, Explorar, mapa, roteiro e superfícies dinâmicas em produção, configure `DATABASE_URL` e aplique migrations/seed.

A revisão também adiciona `npm run audit:interactions`, executado por `validate:static`, para proteger Warp Text, Dock, Circular Gallery, transições, pins e reduced motion contra regressões.


## Playwright contra o deploy

Após o deployment concluir, valide a URL real com:

```bash
npm ci
npm run playwright:install
npm run test:e2e:remote -- https://seu-projeto.vercel.app
```

Use uma Preview dedicada quando a suíte precisar de credenciais de validação. Não utilize contas reais de produção nos testes automatizados.

A execução remota padrão cobre as superfícies públicas, responsividade e interações. Para uma Preview de QA com contas de teste próprias, acrescente `--full` e configure as variáveis `E2E_*` descritas em `docs/PLAYWRIGHT_QA.md`.
