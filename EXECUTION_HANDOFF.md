# Handoff de execução

## Para continuar no Work/Codex ou CI

1. Executar `npm ci`.
2. Rodar `npm run validate:repo && npm run lint && npm run typecheck && npm test && npm run build`.
3. Para validação real do banco: `docker compose up -d`, `npm run db:migrate`, `npm run db:seed` e `PERSISTENCE_MODE=postgres`.
4. Rodar `npm run test:e2e` e revisar `artifacts/playwright/`.
5. Corrigir qualquer regressão, adicionar teste e reexecutar.

## Fluxo crítico

`/admin/lugares/place-cafe-neblina` → alterar descrição → salvar rascunho → confirmar que `/parceiros/cafe-neblina-alta` não mudou → abrir preview → publicar → confirmar público → confirmar `publish` no histórico.

## Não promover silenciosamente

Se PostGIS, npm registry, Chromium ou qualquer provider não estiver operacional, o gate correspondente deve ficar pendente e o motivo deve ser registrado no `VALIDATION_REPORT.md`.

## Publicação do modelo visual

O repositório agora inclui `showcase/` como modelo visual navegável. No GitHub, configure **Settings → Pages → Source → GitHub Actions**. O workflow `showcase-pages` valida e publica essa pasta. Isso substitui a situação em que a URL do Pages exibia somente o README.

Antes de usar o Work para refinamentos, abrir a URL publicada e tratar `showcase/` como referência visual de direção, mantendo a aplicação Next como implementação funcional.
