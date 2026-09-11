# Passaporte Serra Negra: repositório de validação

Aplicação Next.js App Router + React + TypeScript strict, com PostgreSQL/PostGIS e Drizzle. Todos os dados são fictícios; não representam atrações ou parceiros reais. Identidade visual neutra e temporária.

## Demonstração — etapa encerrada no escopo ajustado

Conforme orientação do usuário, Chromium standalone e PostGIS não são requisitos para encerrar esta etapa de demonstração. A aceitação integral original permanece não executada; os comandos `validate:full` continuam disponíveis para uma futura homologação.

Com Node 24 e npm, extraia `LATEST.zip`, entre em `LATEST` e execute:

```sh
npm ci
npm run demo
```

Abra http://localhost:4173. O comando prepara PGlite com dados sintéticos e inicia a aplicação; funciona sem Docker, Chromium ou credenciais externas. Não precisa copiar `.env.example`. O banco separado `.data/demo-presentation` preserva sessões anteriores e é reutilizado sem sobrescrever edições. `npm run demo:prepare` apenas prepara o banco. Pare a aplicação antes de executar novamente; nunca compartilhe esse banco entre processos. `DEMO_DATA_PATH` permite escolher outro diretório vazio de demonstração por variável do processo. Não use dados reais.

Roteiro e critérios de apresentação: [docs/DEMO_PRESENTATION.md](docs/DEMO_PRESENTATION.md).

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

O contrato de nomes do Icon System v2 é preservado em `src/design-system`, enquanto os ícones de interface são renderizados com Material Symbols Outlined via Google Fonts. Os SVGs legados em `public/icons` e `assets/icons-v3` permanecem como referência e compatibilidade, mas não são a fonte ativa dos ícones de interface. Fontes e cores de validação continuam marcadas VALIDATION_ONLY. Claro/Escuro/Sistema usam tokens. O helper de i18n oferece pt-BR e chaves para en/es; extração completa e traduções ainda são pendências.

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

## Regressão do Admin, Bloco 08

`node --import tsx scripts/verify-admin.ts` executa 11 cenários de integração em PGlite em memória, usando o mesmo serviço transacional chamado pelo Admin após autorização. Confere os seis tipos de conteúdo, rascunho/publicação, arquivo/restauração, auditoria, conflitos de versão e relações indisponíveis. Não simula sessão HTTP e não substitui Playwright ou PostGIS.

Conteúdo arquivado continua fora do público quando editado ou restaurado; só Publicar o torna visível novamente. Parceiros sem lugar público e lugares comerciais sem parceiro publicado são omitidos da descoberta, sem apagar o registro editorial ou a memória da viagem. Categorias desativadas são retiradas das opções e referências públicas somente após publicação; a ordem editorial publicada é respeitada. O editor mantém opções próprias para permitir completar relações antes da exposição pública.

## Encerramento da entrega de implementação

`DELIVERY_INDEX.md` lista os blocos e `WORK_STATE.md` identifica o estado atual. Para concluir a aceitação que ficou bloqueada, siga `docs/FINAL_ACCEPTANCE.md`. Os comandos `npm run validate:preflight` e `npm run validate:full` geram um resumo estruturado e distinguem PASS, FAIL e BLOCKED. A execução completa exige Chromium e um PostgreSQL/PostGIS de teste e não foi aprovada nesta conversa. Não substitua essa pendência por testes mock ou por imagens de outros viewports.
