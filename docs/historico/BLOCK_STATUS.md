# BLOCK STATUS

## Vercel Effects Restoration

**STATUS:** IMPLEMENTADO E VALIDADO ESTATICAMENTE

### Entregue

- correção build-safe do sitemap;
- Warp Text do hero;
- Dock desktop com proximidade contínua;
- Card Nav mobile preservado com focus trap, Escape e retorno de foco;
- Circular Gallery com drag, inércia/snap, blur progressivo e centralização lateral;
- slider horizontal de tipos de roteiro com teclado;
- microinterações de cards, linha de roteiro, FAQ e mapa;
- transição horizontal entre páginas preservando o header;
- reduced motion e guards por hover/pointer;
- pins SVG acessíveis;
- gate automatizado `audit:interactions`.

### Validação disponível neste ambiente

- `validate:static`: PASS
- sanitização: PASS
- responsividade: PASS
- UX/UI: PASS
- Vercel compatibility audit: PASS, 9 checks
- interactions audit: PASS, 10 checks
- transpile sintático: PASS, 280 TS/TSX, 0 erros

### Validação externa

O log Vercel anterior confirmou que compilação e TypeScript do pacote-base já passam. O erro subsequente ocorreu exclusivamente no prerender de `/sitemap.xml`; a causa foi removida nesta revisão. O build completo desta nova revisão deve ser confirmado no redeploy da Vercel, porque o registry npm não conclui instalação neste ambiente local.

### Runtime

`DATABASE_URL` continua obrigatório para as páginas dinâmicas do produto em produção. A correção do sitemap evita bloquear o build, mas não substitui o banco por dados falsos.

## Playwright QA integrado

- `@playwright/test` 1.63.0 e `@axe-core/playwright` 4.13.0 fixados;
- scripts para instalar Chromium local/CI;
- execução remota contra deployment Vercel;
- projeto dedicado `reduced-motion`;
- traces, screenshots e vídeos preservados em falha;
- testes dos efeitos premium e navegação acessível;
- job E2E no GitHub Actions com artifact do relatório;
- gate `audit:playwright` integrado ao `validate:static`;
- Playwright Python 1.57 + Chromium 144: smoke do browser PASS neste ambiente;
- suíte Next.js completa local continua dependente de `npm ci`, que sofre falha de registry neste ambiente específico.

## Checkpoint Vercel + efeitos + Playwright

**ARTEFATO:** `PASSAPORTE_SERRA_NEGRA_VERCEL_READY_PLAYWRIGHT.zip`

**STATUS:** PRONTO PARA REDEPLOY E QA REMOTO

O pacote consolida as correções de TypeScript/Drizzle, Open Graph, sitemap build-safe, efeitos premium restaurados, regras globais de UX/UI e responsividade, sanitização e o novo gate Playwright. O último build real da Vercel fornecido pelo usuário já confirmou compilação e TypeScript; o bloqueio posterior de sitemap foi corrigido nesta base. O próximo redeploy é a validação autoritativa do build completo desta revisão.
