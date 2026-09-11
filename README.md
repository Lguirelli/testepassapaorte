# Passaporte Serra Negra — aplicação dinâmica

A fonte de verdade deste repositório é a aplicação **Next.js** em `src/`. A antiga SPA estática da raiz foi removida para evitar dois sites, duas tabelas de rotas e múltiplas cascatas de CSS concorrentes.

## Executar localmente

```bash
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

A aplicação abre em `http://localhost:4173`.

Para uma execução equivalente à produção:

```bash
ALLOW_DEMO=true npm run build
ALLOW_DEMO=true npm start
```

## Rotas

A navegação é centralizada em `src/core/routing/routes.ts`. Explorar, Pontos turísticos e Mapa têm URLs independentes; `/parceiros` é a página institucional para parceiros e `/parceiros/[slug]` é reservado aos detalhes de cada parceiro.

## Dados

O conteúdo é persistido pelo repositório dinâmico de conteúdo. Parceiros, jornada, clima e interações permanecem demonstrativos. Os 12 atrativos públicos pesquisados da versão anterior foram migrados para `seed/validation-content.json`, preservando as fontes registradas e os assets locais em `public/assets/tourism/`.

## Qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Os testes Playwright validam a mesma aplicação dinâmica executada por `npm run dev`; não existe mais um smoke test separado da antiga SPA.

## Deploy

GitHub Pages não é utilizado porque não executa SSR. `next.config.ts` produz uma build `standalone`, o `Dockerfile` executa essa build em Node e `.github/workflows/dynamic-build.yml` gera o artefato dinâmico pronto para um host compatível com Node/containers.

Consulte `docs/DYNAMIC_ARCHITECTURE.md` para a divisão de rotas, páginas e responsabilidades.
