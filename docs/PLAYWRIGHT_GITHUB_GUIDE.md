# Chromium + Playwright no GitHub

Este patch separa cinco responsabilidades:

1. `01-quality.yml`: lockfile, lint, typecheck, testes e build.
2. `02-playwright.yml`: aplicação Next real controlada pelo Chromium.
3. `03-visual-audit.yml`: screenshots de todas as superfícies em desktop, tablet e mobile.
4. `04-pages.yml`: valida e publica somente `showcase/` no GitHub Pages.
5. `05-post-deploy.yml`: abre o site já publicado com Chromium e confirma que a showcase correta foi entregue.

## Ver a tela no GitHub Actions

O GitHub-hosted runner é headless. A página **Actions** mostra os logs enquanto o teste acontece, mas não transmite uma janela gráfica ao vivo do Chromium.

O workflow salva três tipos de evidência:

- `playwright-html-report`: relatório navegável do teste;
- `playwright-debug-results`: screenshots, vídeo e `trace.zip` em falhas;
- `passaporte-visual-audit`: galeria de screenshots de todas as telas.

Abra **Actions → execução → Summary/Artifacts**, baixe o artifact e abra `index.html` ou o relatório localmente.

Para um trace, depois de baixar:

```bash
npx playwright show-trace caminho/trace.zip
```

## Ver enquanto testa: GitHub Codespaces

O repositório contém `.devcontainer/devcontainer.json`. No GitHub:

1. `Code` → `Codespaces` → `Create codespace on main`.
2. Aguarde `npm ci` e a instalação do Chromium.
3. No terminal execute:

```bash
npm run pw:ui
```

O Codespace encaminha automaticamente:

- porta `9323`: Playwright UI;
- porta `3000`: preview da aplicação.

Na Playwright UI, clique no teste desejado e em **Run**. A timeline mostra cada ação, DOM/snapshot antes e depois, locators, console, network e trace. Use o ícone de watch para reexecutar enquanto altera o código.

A aplicação também pode ser aberta pela aba **Ports**, porta 3000. Essa aba mostra o produto corrente. Ela não é a mesma instância privada de navegador controlada pelo Playwright, mas é útil para acompanhar a alteração lado a lado.

## Chromium visível como janela real

`npm run pw:headed` abre o Chromium com janela quando o ambiente possui desktop gráfico, como seu PC. Em um Codespace padrão, use `npm run pw:ui`, pois a UI é acessível pelo navegador e foi feita para esse tipo de inspeção.

## Debug passo a passo

No desktop local:

```bash
npm run pw:debug
```

Ou no Codespace use Playwright UI e selecione uma ação na timeline.

## O que corrige automaticamente

GitHub Actions e Playwright **detectam e documentam** o erro; eles não devem editar silenciosamente o código. O ciclo de correção é:

```text
editar código
→ push/PR
→ Actions executa Chromium
→ falha gera screenshot/trace/vídeo
→ corrigir código
→ novo push
→ Actions reexecuta
```

Quando um agente de código ou o Work estiver trabalhando no PR, ele pode usar os resultados dos Actions para fazer a alteração e reenviar. O gate continua sendo Playwright.

## Proteção da main

Em `Settings → Rules → Rulesets`, proteja `main` e exija os status checks:

- `Quality`
- `Playwright Chromium`
- `Visual Audit`

Assim uma alteração que quebre build, comportamento ou renderização não entra silenciosamente na branch principal.

## GitHub Pages

Configure `Settings → Pages → Build and deployment → Source → GitHub Actions`.

Para domínio customizado, crie a variável de repositório `PAGES_URL` em `Settings → Secrets and variables → Actions → Variables` contendo a URL completa. Sem essa variável, o pós-deploy calcula a URL padrão `github.io`.


## 12. Conferir o Design System V1 no Chromium

O patch V8 adiciona `tests/e2e/design-system.spec.ts`. No Playwright UI, execute esse arquivo para conferir os valores CSS computados e os stacks de fonte.

```bash
npm run design:check
npm run pw:design
```

Na UI da porta 9323, abra cada passo e inspecione `Before`, `After`, DOM e console. Para comparar a aparência completa, rode também `visual-audit.spec.ts`.
