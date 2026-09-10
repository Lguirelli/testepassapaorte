# Auditoria do repositório para revisão no GitHub

Data de empacotamento: 2026-09-10.

## Fonte usada

O repositório foi inicialmente montado a partir do `LATEST.zip` consolidado do Bloco 07. O checkpoint `block_08.zip` recebido depois foi validado e aplicado como delta sobre essa base, preservando a camada de revisão GitHub já criada. O Bloco 08 não altera domínio, UI, seed ou lockfile; adiciona documentação, scripts de empacotamento e evidências de regressão.

O histórico `.git` da execução anterior não veio no snapshot. Por isso, este pacote não tenta reconstruir commits antigos por inferência. O histórico deste repositório começa com um commit de importação do estado consolidado e um segundo commit para a camada de revisão no GitHub.

## Integridade observada

- Snapshot consolidado do Bloco 07: 748 arquivos listados no manifesto original, 0 ausentes e 0 divergências de SHA-256 na auditoria anterior.
- Bloco 06: 14 arquivos de implementação/evidência comparáveis ao snapshot, 0 divergências.
- Bloco 07: 18 arquivos de implementação/evidência comparáveis ao snapshot, 0 divergências.
- `block_08.zip`: SHA-256 `c59432ceca31aa8c34b38931a8805f211b79d3516a8384dbe1185c1964b12e01`, CRC válido e 22/22 payloads conferidos contra o manifesto interno.
- Varredura básica de segredos: nenhuma credencial real detectada. Ocorrências de `secret/token/password` pertencem a código de assinatura mock, testes e credenciais locais de demonstração.
- O pacote não inclui `.env.local`, banco binário, `node_modules`, builds ou caches.

## Estado funcional herdado

O Bloco 08 registra PASS para instalação por lockfile, lint, TypeScript strict, 13 testes unitários, persistência PGlite, build, migrations/seed e smoke HTTP de nove rotas. A suíte E2E tentou 51 casos, porém 51/51 foram bloqueados no lançamento do navegador e nenhum corpo de teste executou. PostgreSQL/PostGIS, Axe e novas screenshots também não foram executados nessa sessão.

Durante a preparação deste repositório atualizado foi detectado Chromium de sistema em `/usr/bin/chromium`, mas uma tentativa independente de reinstalar as dependências não concluiu dentro da janela disponível. Essa tentativa não foi usada como evidência de produto, nenhuma mudança experimental do Playwright foi mantida e nenhum gate foi promovido.

## Camada adicionada para GitHub

Sem alterar a arquitetura do produto, foram adicionados:

- configuração de GitHub Codespaces usando PGlite, para abrir o vertical slice sem depender de Docker;
- disparo manual `workflow_dispatch` no workflow de validação;
- templates de issue para bug e feedback de validação;
- template de pull request com checklist técnico e de gates;
- guia de revisão no GitHub;
- visão visual das capturas existentes no README.

## Regra de leitura dos gates

`PASS` de build, lint ou pacote não equivale a aprovação de produção. Os gates G1–G8 continuam parciais até que a matriz E2E seja executada, a responsividade seja validada nos três viewports e PostGIS seja efetivamente testado onde exigido.
