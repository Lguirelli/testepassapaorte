# Pacote Vercel-ready

Este pacote contém o código-fonte necessário para importar/deployar o projeto pela raiz no Vercel.

## Incluído

- `package.json`
- `package-lock.json`
- `.nvmrc`
- `next.config.ts`
- `tsconfig.json`
- `next-env.d.ts`
- `eslint.config.mjs`
- `src/`
- `public/`
- `scripts/`
- `drizzle/`
- `drizzle.config.ts`
- `seed/`
- `.env.example`
- `VERCEL_DEPLOY.md`

## Não incluído de propósito

- `.git/`
- `node_modules/`
- `.next/`
- `.vercel/`
- arquivos de cache e relatórios temporários
- `.env`, `.env.local` ou qualquer segredo real

Esses itens não devem ser empacotados para um deploy limpo.

## Variáveis de ambiente

Os valores reais devem ser configurados no painel do Vercel. Para o runtime completo, consulte `VERCEL_DEPLOY.md` e `.env.example`.

Principais variáveis:
- `DATABASE_URL`
- `SESSION_SECRET`
- `IDENTITY_PEPPER`

Credenciais de turista, parceiro e admin são opcionais e só devem ser adicionadas quando esses fluxos forem habilitados.

## Runtime

O projeto fixa Node.js `24.x` em `package.json` e `.nvmrc`.
