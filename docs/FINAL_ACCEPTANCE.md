> Atualização do bloco 12: o usuário dispensou Chromium e PostGIS para encerrar a etapa demonstrativa. Este documento descreve a aceitação integral futura, que permanece não executada. Para apresentar agora, siga DEMO_PRESENTATION.md.

# Executar a aceitação final

Esta base implementa o vertical slice de validação solicitado, com mocks e dados sintéticos. A aceitação integral ainda depende de Chromium standalone e PostgreSQL/PostGIS. O navegador cloud foi usado em fluxos dirigidos, em 1363×936, e não substitui a matriz de três viewports.

## Preparação

Use Node 24, npm e Docker Compose. Extraia LATEST.zip e entre na pasta LATEST. Execute `npm ci`, copie `.env.example` para `.env.local`, suba `docker compose up -d` e instale o navegador com `npx playwright install chromium`. Não há necessidade de credenciais de serviços externos.

Feche outra instância deste aplicativo na porta 4173 antes da suíte. Use exclusivamente um banco isolado de validação: a execução completa aplica migração/seed e os testes alteram conteúdo demo. Não aponte para dados de produção.

Linux/macOS:

```sh
export VALIDATION_DATABASE_URL=postgres://validation:validation@localhost:5432/passaporte
npm run validate:preflight
npm run validate:full
```

PowerShell:

```powershell
$env:VALIDATION_DATABASE_URL="postgres://validation:validation@localhost:5432/passaporte"
npm run validate:preflight
npm run validate:full
```

As credenciais acima são apenas as do Compose demo incluído no projeto. Para outro banco de teste, use sua URL de conexão por variável de ambiente. O verificador lê a variável do processo, não lê automaticamente `.env.local`.

## O que os comandos fazem

`validate:preflight`: verifica Node, presença do executável Chromium e conexão com banco que disponibiliza a extensão PostGIS. Não instala dependências, não cria infraestrutura e não executa testes. PASS aqui significa somente pré-requisitos presentes; o launch do navegador e a migração são verificados posteriormente.

`validate:full`: exige o preflight, executa migração, seed, lint, TypeScript, unitários, integração Admin, teste de idempotência isolado, build e os 57 casos E2E. Interrompe no primeiro comando com falha. A suíte utiliza três projetos: desktop 1440×1000, tablet 1024×768 e mobile 390×844. O mobile pede reduced motion. A saída temporária do Next usa `.next-acceptance`, excluída das entregas.

Códigos de saída: 0, etapas solicitadas passaram; 1, falha de execução; 2, pré-requisito bloqueado. Resultados ficam em `artifacts/validation/acceptance-current/SUMMARY.json`, com logs por etapa. Capturas E2E ficam em `artifacts/playwright/<projeto>/`; relatório HTML em `playwright-report/` e traces de falhas em `test-results/`.

Um PASS automático não substitui a inspeção das screenshots nem a revisão das violações de acessibilidade. Compare os resultados com acceptance/PLAYWRIGHT_MATRIX.md e acceptance/DEFINITION_OF_DONE.md antes de atualizar os gates.

## CI

O workflow Validation pode ser acionado por push, pull request ou manualmente por workflow_dispatch em um repositório GitHub próprio. Ele utiliza o lockfile, PostGIS de serviço e instalação oficial do Chromium. O arquivo foi entregue; nenhuma execução remota ou push foi realizado nesta conversa.

## Estado de execução desta entrega

O preflight foi executado e retornou BLOCKED corretamente: Chromium ausente e banco PostGIS de validação não configurado. `validate:full` não foi executado e não recebeu PASS. Não alterar essa classificação para avançar um gate artificialmente.
