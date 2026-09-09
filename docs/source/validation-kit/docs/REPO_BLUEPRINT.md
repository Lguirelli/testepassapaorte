# Blueprint do repositório

Estrutura recomendada:

```text
passaporte-serra-negra-validation/
├── .github/workflows/
│   └── ci.yml
├── docs/
│   ├── architecture/
│   ├── decisions/
│   └── validation/
├── public/
│   ├── icons/
│   └── placeholders/
├── src/
│   ├── app/
│   ├── modules/
│   │   ├── places/
│   │   ├── experiences/
│   │   ├── partners/
│   │   ├── events/
│   │   ├── trips/
│   │   ├── passport/
│   │   ├── admin/
│   │   └── tracking/
│   ├── core/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── permissions/
│   │   ├── i18n/
│   │   └── validation/
│   ├── providers/
│   │   ├── auth/
│   │   ├── maps/
│   │   ├── routes/
│   │   ├── weather/
│   │   ├── storage/
│   │   └── analytics/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── content/
│   │   ├── passport/
│   │   └── admin/
│   └── design-system/
│       ├── tokens/
│       ├── icons/
│       ├── motion/
│       └── themes/
├── drizzle/
├── tests/
│   ├── e2e/
│   ├── fixtures/
│   └── helpers/
├── artifacts/playwright/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Fundação técnica de validação

- Next.js App Router + TypeScript strict
- Node LTS compatível com o projeto
- PostgreSQL + PostGIS em Docker Compose
- Drizzle + migrations
- CSS semântico com tokens e CSS Modules/arquitetura equivalente
- Playwright obrigatório
- `@axe-core/playwright` recomendado para verificações de acessibilidade automatizáveis

Fixar versões compatíveis no lockfile no momento da execução. Não usar dependências `latest` flutuantes em CI.
