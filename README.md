# Passaporte Serra Negra: repositório de validação

Aplicação Next.js App Router + React + TypeScript strict, com PostgreSQL/PostGIS e Drizzle. Todos os dados são fictícios; não representam atrações ou parceiros reais. Identidade visual neutra e temporária.

## Executar

Requisitos: Node 24, npm e Docker Compose.

```sh
npm ci
cp .env.example .env.local
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Abra http://localhost:4173. `/health` verifica a conexão. Os scripts de banco usam DATABASE_URL do ambiente ou a URL local demo padrão descrita em .env.example. Seeds preservam conteúdo existente por ID e não duplicam registros.

No Admin, use **Entrar no Admin demo**. Este login assume um administrador fictício, sem credenciais reais. Não é autenticação de produção. Salvar cria rascunho; Preview mostra o último rascunho salvo; Publicar atualiza o conteúdo público; Histórico mantém antes/depois. Publicação não inclui alterações ainda não salvas.

## Fallback explícito sem Docker

Para validar fluxos sem serviço externo, há PGlite (PostgreSQL embarcado, sem PostGIS). Defina DB_MODE=pglite e ALLOW_DEMO=true em `.env.local`.

Com a aplicação parada:

```sh
DB_MODE=pglite npm run db:migrate
DB_MODE=pglite npm run db:seed
npm run dev
```

Em PowerShell, defina `$env:DB_MODE="pglite"` antes dos comandos de migração e seed. PGlite é single-process: não abra o mesmo `.data/pglite` em processos simultâneos. O caminho padrão é descartável e ignorado pelo Git. Nunca execute seed/migration sobre ele com o servidor ativo.

## Verificar

```sh
npm run lint
npm run typecheck
npm test
ALLOW_DEMO=true npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright inclui desktop 1440×1000, tablet 1024×768 e mobile 390×844 com reduced motion. CI instala dependências pelo lockfile, usa PostGIS e executa verificações e suíte E2E. Workflow entregue não significa execução remota confirmada.

## Arquitetura e limites

Monólito modular em `src/modules`. Drizzle concentra a persistência. Conteúdo versionado separa `draft` e `published`; o público não recebe o rascunho. Cookie mock assinado protege o Admin no servidor; mutações e auditoria são transacionais, com comparação de versão.

Providers de autenticação, mapa, rotas, clima, armazenamento e analytics são substituíveis. Adapters demo são determinísticos. Produção exige ALLOW_DEMO=true explicitamente; adapters reais ainda não estão implementados. A página pública impede abrir contatos example.invalid como reais.

Icon System v2 é fornecido pelo kit e mantido em `src/design-system` e `public/icons`. Não há ícones de outras bibliotecas. Fontes e cores são temporárias, marcadas VALIDATION_ONLY. Claro/Escuro/Sistema usam tokens. O helper de i18n oferece pt-BR e chaves para en/es; extração completa e traduções ainda são pendências.

O schema é v0 de validação, com JSONB tipado e relações validadas pela aplicação. Não é o Data Model definitivo. Consulte `docs/decisions/` e `docs/validation/`.

## Fora do escopo e pendências

Não inclui identidade visual final, fotografias reais, mapa territorial oficial, motor oficial de carimbos, QR antifraude, reservas, pagamentos, Travel Engine definitivo, analytics avançado, integrações com credenciais ou conclusões jurídicas. Screenshots disponíveis ficam em `artifacts/playwright/`.

A execução original não dispunha de Docker/PostGIS ou Chromium local. A checagem visual disponível usou o navegador cloud. Consulte ADR-004 para distinguir verificações executadas de testes apenas preparados.

## Entrega e continuidade

Os blocos 00–06 estão implementados; a regressão final está registrada em `VALIDATION_REPORT.md`. `WORK_STATE.md` descreve decisões, limites e próximos passos. O PASS de integridade dos ZIPs não significa aprovação integral dos gates.

Para verificar persistência sem afetar o banco de trabalho:

```sh
node --import tsx scripts/verify-persistence.ts
```

O script cria banco PGlite temporário, repete migração e seed, confere contagens e preservação de edição e remove somente o banco criado por ele. Não valida PostGIS.

Para build separado da prévia ativa, use `NEXT_BUILD_DIR=.next-build ALLOW_DEMO=true npm run build`; se quiser executar esse build, mantenha `NEXT_BUILD_DIR=.next-build` também em `npm start`. O comando padrão continua usando `.next`.

`LATEST.zip` é o projeto completo sem caches, dependências ou banco binário. Após extrair, siga os comandos de instalação/seed acima. ZIP individual contém apenas arquivos do bloco e deve ser aplicado sobre o snapshot anterior. Não restaura as mutações transitórias feitas durante QA. Os relatórios e screenshots preservam a evidência desses fluxos.

Git local foi mantido com commits por bloco. Não houve acesso autenticado ao GitHub nem push. Para publicar o snapshot extraído em um repositório próprio: `git init -b main`, `git add .`, `git commit -m "Import validation snapshot"`, adicionar o remote autorizado e executar push. Nunca incluir `.env.local` ou diretórios de banco.

## Bloco 08: carimbos automáticos, page flip e GitHub Actions

O motor procedural de carimbos fornecido foi integrado em `src/features/stamps/` sem incorporar arquivos binários de fonte. Cada visita registrada em modo demo agora recebe `visitNumber`, `stampSeed` e um `stampSnapshot` serializável. O snapshot é a fonte histórica do desenho: mudanças futuras no algoritmo não devem redesenhar silenciosamente carimbos já emitidos.

Para atualizar viagens persistidas antes deste bloco:

```sh
npm run db:backfill-stamps
```

O Passaporte usa virada de página 3D no desktop/tablet e página inteira no mobile. `prefers-reduced-motion: reduce` remove a animação e preserva a navegação. Setas esquerda/direita também mudam de página quando o livro está focado.

O workflow `.github/workflows/ci.yml` foi reorganizado em gates: **quality + build + persistência** primeiro e, somente depois, **Chromium + PostGIS** em desktop, tablet e mobile. Em falhas do navegador, baixe os artifacts `playwright-*` da execução.

Para acompanhar o Chromium de forma interativa no GitHub, abra um Codespace e execute:

```sh
npm run pw:ui
```

Abra a porta `9323` para a Playwright UI e `4173` para a aplicação. Para uma janela Chromium visível em ambiente gráfico local, use `npm run pw:headed`; para depuração passo a passo, `npm run pw:debug`.
