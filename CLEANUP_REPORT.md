# CLEANUP_REPORT

## Objetivo

Rodada conservadora de limpeza, organização e estabilização do repositório do Passaporte Serra Negra. A implementação estática completa em `index.html` e a aplicação Next.js em `src/` foram preservadas como entradas distintas. Não houve redesign, migração de arquitetura, alteração de conteúdo editorial, troca de imagens ou atualização major de dependências.

## Inventário e decisão estrutural

A auditoria identificou os seguintes grupos principais:

- **Implementação estática — manter:** `index.html`, HTMLs de compatibilidade por rota, `app.js`, `data.js`, `ui-*.js`, `static-interactions.*`, `styles.css`, `visual*.css`, `theme.css`, folhas específicas e `assets/`.
- **Next.js — manter:** `src/app/`, `src/components/`, `src/lib/` e demais módulos em `src/`.
- **Testes — manter/corrigir:** `tests/unit/` e `tests/e2e/`. O teste de bridge do `index.html` refletia uma arquitetura anterior e foi atualizado.
- **Scripts/configuração — manter:** `scripts/`, `drizzle/`, `seed/`, `playwright.config.ts`, `eslint.config.mjs`, `next.config.ts`, `tsconfig.json`, Docker e arquivos de ambiente de exemplo.
- **Assets e referências — manter:** `assets/`, `public/`, `references/` e documentação de origem/licenças. Não foram tratados como duplicação removível sem prova de desuso.
- **Saídas de validação — remover:** `artifacts/`, pois continha logs, screenshots e evidências geradas por execuções anteriores, não código-fonte ou assets de produto.
- **Dependências — manter:** todas as dependências diretas de `package.json` apresentaram referências reais em código, testes, banco ou tooling. Não houve remoção especulativa.

As subpastas HTML como `explorar/index.html`, `mapa/index.html`, `parceiros/index.html` e equivalentes permanecem como bridges de compatibilidade para a aplicação estática via hash. Elas não foram confundidas com a aplicação Next.js.

## Arquivos alterados ou adicionados

- `.gitignore`
- `app.js`
- `src/components/HomeExperience.tsx`
- `static-interactions.css`
- `tests/e2e/07-home-refinement.spec.ts`
- `tests/unit/root-bridge.test.ts`
- `theme.css`
- `visual.css`
- `CLEANUP_REPORT.md` — adicionado nesta rodada.

## Arquivos removidos

Os arquivos abaixo eram artefatos gerados por validações anteriores. Nenhum é necessário para build, runtime, interface, testes-fonte ou documentação funcional do produto.

### `artifacts/block_08/`

- `artifacts/block_08/build.log`
- `artifacts/block_08/chromium-install.log`
- `artifacts/block_08/demo-setup.log`
- `artifacts/block_08/e2e.log`
- `artifacts/block_08/http-server.log`
- `artifacts/block_08/http-smoke.json`
- `artifacts/block_08/lint.log`
- `artifacts/block_08/npm-ci.log`
- `artifacts/block_08/persistence.log`
- `artifacts/block_08/postgis-environment.log`
- `artifacts/block_08/server.log`
- `artifacts/block_08/source-integrity.json`
- `artifacts/block_08/typecheck.log`
- `artifacts/block_08/unit.log`

### `artifacts/playwright/`

- `artifacts/playwright/README.md`
- `artifacts/playwright/cloud-1363x936/00-home.jpg`
- `artifacts/playwright/cloud-1363x936/01-explorar.jpg`
- `artifacts/playwright/cloud-1363x936/02-parceiro.jpg`
- `artifacts/playwright/cloud-1363x936/03-admin.jpg`
- `artifacts/playwright/cloud-1363x936/03-preview.jpg`
- `artifacts/playwright/cloud-1363x936/04-roteiro.jpg`
- `artifacts/playwright/cloud-1363x936/05-calendario.jpg`
- `artifacts/playwright/cloud-1363x936/06-passaporte-dark.jpg`

### `artifacts/validation/`

- `artifacts/validation/build.log`
- `artifacts/validation/e2e-attempt.log`
- `artifacts/validation/e2e-list.log`
- `artifacts/validation/lint.log`
- `artifacts/validation/persistence.log`
- `artifacts/validation/typecheck.log`
- `artifacts/validation/unit.log`

O ZIP incremental não contém entradas de exclusão. Ao aplicar o pacote sobre o repositório original, os arquivos acima devem ser removidos conforme esta lista.

## Conflitos corrigidos

### Rota e pontos interativos

A posição e a animação visual foram separadas definitivamente:

- `.route-visual-stop-position` é o wrapper responsável por coordenadas, posicionamento e `translate` de ancoragem.
- `.route-visual-stop` é o elemento interno responsável por escala, cor e sombra.
- `.territory-pin-position` mantém as coordenadas e o `translate(-50%, -50%)` do pin.
- `.territory-pin` mantém apenas rotação, escala e tratamento visual.

Assim, hover/foco não substituem o `transform` necessário para posicionamento.

### Carrossel “Encontros pelo caminho”

- Removido o autoplay real baseado em `setInterval(..., 5600)`.
- Removidas as rotinas de pause/restart que existiam apenas para sustentar o autoplay.
- A posição/profundidade/escala do card ficou concentrada no wrapper `.encounter-card` por custom properties.
- `.encounter-card-link` deixou de aplicar uma segunda escala/translate concorrente; agora atua apenas em borda, sombra e aparência interna.
- A regra duplicada de expansão lateral foi consolidada em `static-interactions.css`.
- Cards não centrais recebem `inert`, `aria-hidden="true"` e link com `tabIndex=-1`.
- O card central permanece o único card navegável por teclado.
- Listeners específicos do carrossel passaram a usar referências nomeadas e são removidos por `encounterCarouselCleanup()` junto com RAF e timeout de snap.

### Painéis de tipos de roteiro

Na implementação estática:

- slides inativos recebem `inert` e `aria-hidden="true"`;
- o slide ativo restaura a interatividade;
- tabs mantêm roving `tabIndex` (`0` apenas no tab ativo e `-1` nos demais).

Na implementação Next.js:

- o painel anterior em transição recebe `inert` enquanto está visualmente saindo;
- tabs receberam o mesmo modelo de roving `tabIndex`;
- os cards laterais da galeria permanecem visíveis, mas somente o card central é exposto como interativo/acessível.

### Timers e cleanup no Next.js

O lock temporário do wheel da galeria agora guarda seu timeout em `wheelTimer`, cancela timeout anterior quando necessário e faz cleanup no unmount. O timer de transição de tipos de roteiro já possuía cleanup e foi preservado.

### Transições entre páginas

A animação de rota deixou de usar o snapshot `root` como tela inteira:

- `#app` possui `view-transition-name: page-content`;
- snapshots `root` têm animação desativada;
- somente `page-content` recebe animação lateral de entrada/saída;
- header e footer permanecem fora do container animado;
- o bloco posterior que redefinia novamente uma transição full-screen foi removido para evitar duas fontes de verdade.

A transição compartilhada `place-media` foi preservada em 600 ms.

### CSS do carrossel

Foram removidas regras redundantes que aplicavam `transform` no link interno e outra intensidade de hover no mesmo card. A escala central aprovada (`1.06`) e o afastamento lateral permanecem definidos em uma única camada de interação.

### Teste obsoleto do `index.html`

`tests/unit/root-bridge.test.ts` deixou de exigir `index.html` como bridge para `dynamic-entry.js`. Agora o teste valida a arquitetura atual:

- `index.html` é uma aplicação estática completa;
- carrega `app.js`, `data.js`, `theme.css` e `static-interactions.css`;
- não é um `location.replace`;
- subpáginas estáticas continuam sendo bridges por hash para `index.html`;
- `404.html` continua resolvendo caminhos conhecidos para a entrada estática.

## `.gitignore`

A cobertura foi ampliada para dependências, builds, caches, resultados de teste, relatórios gerados, variáveis locais, logs e arquivos do sistema. Entre os itens cobertos estão:

- `node_modules/`
- `.next/`, `.next-build/`, `.next-acceptance/`
- `dist/`, `coverage/`
- `.data/`
- `artifacts/`
- `playwright-report/`, `test-results/`
- `.env`, `.env.local`
- `*.tsbuildinfo`, `*.log`
- logs de npm/yarn/pnpm
- `.DS_Store`, `Thumbs.db`

## Dependências

Nenhuma dependência foi removida de `package.json` ou `package-lock.json`. A busca confirmou referências para todas as dependências diretas e de desenvolvimento relevantes, incluindo Next.js, React, Drizzle, PostgreSQL/PGlite, Zod, Playwright, Axe, ESLint, TSX e TypeScript. Não houve atualização major.

## Validação executada

### Validações que passaram

- `git diff --check`: **passou**, sem whitespace errors.
- Sintaxe JavaScript com `node --check` em `app.js`, `static-interactions.js`, `ui-shell.js`, `partners-page.js`, `dynamic-entry.js`, `data.js`, `icon-registry.js`, `ui-config.js` e `tourism-data.js`: **passou**.
- Transpilação sintática TypeScript/TSX dos arquivos alterados (`HomeExperience.tsx`, teste E2E e teste unitário): **passou** via TypeScript disponível globalmente.
- `tests/unit/root-bridge.test.ts`: **3/3 testes passaram** usando o loader TypeScript disponível globalmente. Isso valida especificamente a correção do teste arquitetural obsoleto.
- Busca estrutural: **nenhum `setInterval` permanece** em `app.js`, `src/` ou testes executáveis analisados.
- Auditoria de transformação do carrossel: a escala de hover do card central permanece em um único nível; o link interno não possui segunda transformação de escala.

### Validação em Chromium da implementação estática

O ambiente possui Chromium 144 e Playwright Python 1.57.0. A política do navegador bloqueou navegação para `localhost` e URLs externas com `ERR_BLOCKED_BY_ADMINISTRATOR`. Para não alterar o projeto nem interromper a validação, `index.html`, CSS e JavaScript locais foram injetados diretamente em um documento isolado do Chromium. O harness não foi salvo no repositório.

Foram avaliadas quatro viewports:

| Viewport | Overflow horizontal | Hero | Primeiros caminhos | Carrossel | Painéis inativos |
| --- | --- | --- | --- | --- | --- |
| 1920×1080 | não | 1080 px | 3 cards | 1 centro ativo | `inert` |
| 1366×768 | não | 768 px | 3 cards | 1 centro ativo | `inert` |
| 820×1180 | não | 1180 px | 3 cards | 1 centro ativo | `inert` |
| 390×844 | não | 844 px | 3 cards | 1 centro ativo | `inert` |

Resultados adicionais:

- nenhum `pageerror` ocorreu no harness nas quatro viewports;
- o índice central do carrossel permaneceu **0 antes e depois de 5,9 s**, confirmando ausência de autoplay;
- somente o link do card central permaneceu com `tabIndex=0`; os demais ficaram em `-1`;
- foco no card central ativa o estado `is-center-expanded`;
- tabs de tipo de roteiro usam `tabIndex=0/-1` corretamente;
- todos os slides inativos de tipo de roteiro ficaram `inert`;
- o wrapper do ponto da rota preservou exatamente suas coordenadas documentais antes/depois da interação de foco;
- o wrapper do pin do mapa preservou exatamente suas coordenadas; o elemento interno apresentou escala equivalente a `1.08` sem mover a âncora;
- `#app` reporta `view-transition-name: page-content` e os snapshots `root` permanecem sem animação;
- a instância do header permaneceu a mesma e sua caixa geométrica não se moveu durante a tentativa de troca de hash no harness.

O Chromium headless deste ambiente reporta `hover:none`, portanto os seletores condicionados a `@media (hover:hover) and (pointer:fine)` não podem ser ativados nativamente neste processo. A arquitetura de hover foi validada por inspeção estrutural/CSS e pelos estados equivalentes de foco; a rodada visual anterior já havia validado o hover desktop com harness específico. Nenhuma regra visual aprovada foi reduzida nesta limpeza.

## Comandos npm / build

As dependências não estavam instaladas no repositório entregue. A tentativa de restaurá-las não pôde ser concluída neste ambiente:

- `npm ci --offline --ignore-scripts`: **bloqueado pelo cache incompleto**, faltando `zod-validation-error-4.0.2.tgz` (`ENOTCACHED`).
- a tentativa normal de instalação já havia ficado bloqueada por indisponibilidade de rede/DNS deste ambiente.
- `npx` para a versão Node do Playwright não conseguiu resolver o pacote localmente e tentou depender da rede. Por isso não foi usado como base para alterar o projeto.

Consequentemente, os comandos oficiais dependentes de `node_modules` foram executados, mas não puderam validar o código por ausência das ferramentas/pacotes:

- `npm run lint`: **não executável**, `eslint: not found`.
- `npm run typecheck`: **bloqueado por types ausentes** (`node`, `react`, `react-dom`, `pg`, etc.), consequência de `node_modules` incompleto/ausente.
- `npm test`: **bloqueado**, pacote local `tsx` ausente. O teste alterado `root-bridge.test.ts` foi executado separadamente e passou 3/3 com loader global.
- `npm run build`: **não executável**, `next: not found`.
- suíte Playwright Node do projeto: **não executável sem as devDependencies locais**.

Essas falhas são de preparação do ambiente, não erros de lint/build demonstrados pelo código alterado. Nenhum teste foi desabilitado ou mascarado para produzir resultado verde.

## Checklist final

- [x] `index.html` permanece uma aplicação estática completa.
- [x] estrutura Next.js foi preservada.
- [!] lint oficial bloqueado por ausência de `node_modules`/ESLint.
- [!] typecheck oficial bloqueado por dependências/types ausentes.
- [!] build oficial bloqueado por ausência do Next.js local.
- [!] suíte automatizada completa bloqueada por `tsx`/dependências ausentes.
- [x] teste obsoleto de redirect foi corrigido e passou 3/3 isoladamente.
- [x] rota separa posicionamento de escala visual.
- [x] escala não sobrescreve o `translate` de ancoragem.
- [x] carrossel não possui autoplay nem `setInterval`.
- [x] apenas o nível correto do card controla escala/posição do carrossel.
- [x] stacking/overflow do card central aprovado foi preservado.
- [x] painéis/slides inativos recebem `inert` e são retirados do fluxo de foco.
- [x] header está fora do snapshot animado de conteúdo.
- [x] `#app` é o container responsável pela transição de página.
- [x] listeners dinâmicos do carrossel possuem cleanup explícito.
- [x] timers React relevantes possuem cleanup.
- [x] não foram mantidos timers de autoplay desnecessários.
- [x] CSS concorrente do carrossel e da transição de rota foi reduzido/consolidado.
- [x] arquivos temporários versionados em `artifacts/` foram removidos da árvore de trabalho.
- [x] `.gitignore` cobre builds, caches, resultados e arquivos temporários.
- [x] nenhuma dependência foi removida sem confirmação de uso.
- [x] estrutura final continua distinguindo implementação estática, Next.js, assets, testes, scripts e configurações.

## Limitações do ambiente

1. A rede necessária para restaurar completamente `node_modules` não estava disponível e o cache npm era incompleto.
2. O Chromium instalado é funcional, porém a política do ambiente bloqueia navegação HTTP/externa (`ERR_BLOCKED_BY_ADMINISTRATOR`).
3. O navegador headless reporta `hover:none`, limitando a execução nativa das media queries de mouse fino.
4. Por essas razões, lint, typecheck, build e suíte Playwright Node precisam ser repetidos em um ambiente com `npm ci` funcional. A limpeza não introduziu workarounds invasivos para contornar essas restrições.

## Aplicação do ZIP incremental

O pacote incremental deve ser sobreposto ao repositório atual preservando os caminhos relativos. Depois, remova os 30 arquivos de `artifacts/` listados neste relatório. Não copie `node_modules`, `.next`, caches, relatórios de navegador ou saídas de build para a versão final do repositório.
