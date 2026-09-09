# Correção do CI — package-lock / fsevents

## Sintoma

O GitHub Actions falhava em `npm ci` com:

`npm ci can only install packages when package.json and package-lock.json are in sync`

seguido de:

`Missing: fsevents@2.3.2 from lock file`

## Causa

O lockfile possuía `fsevents@2.3.3` no nível raiz, suficiente para dependências com faixa `~2.3.3`, mas `playwright@1.62.1` declara uma dependência opcional exata em `fsevents@2.3.2`. O lockfile não continha a entrada aninhada correspondente para o Playwright.

## Correção

Foi adicionada ao `package-lock.json` a entrada:

`node_modules/playwright/node_modules/fsevents` → `2.3.2`

com o tarball e integridade corretos.

O workflow `validation-ci` também passou a executar uma checagem explícita do lockfile antes da instalação completa:

`npm ci --ignore-scripts --dry-run --no-audit --no-fund`

A instalação real continua usando:

`npm ci --no-audit --no-fund`

## Validação realizada

No ambiente local, a consistência do lockfile foi validada com:

`npm ci --ignore-scripts --dry-run --offline --no-audit --no-fund`

Resultado: exit code `0`.

Os workflows YAML também foram parseados com sucesso e os validadores do repositório e da showcase continuam passando.

## GitHub Pages

O workflow `showcase-pages.yml` não depende de `npm ci`. A publicação do protótipo estático permanece desacoplada da instalação da aplicação Next.js.
