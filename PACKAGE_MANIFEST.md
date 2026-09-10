# Conteúdo do pacote

- `WORK_COMMAND.md`: comando mestre para execução no Work.
- `references/Passaporte_Serra_Negra_Documentacao_Mestra_v4_2026-09-09.md`: fonte de verdade de produto.
- `references/icon-system-v2/`: Icon System v2 completo.
- `docs/VALIDATION_SCOPE.md`: escopo do vertical slice.
- `docs/ADMIN_VALIDATION_RULES.md`: regra Admin sem banco/código.
- `docs/NO_BRAND_DECISIONS.md`: bloqueio de decisões prematuras de fonte/cor/identidade.
- `docs/REPO_BLUEPRINT.md`: organização técnica recomendada.
- `docs/MISSING_REFERENCE_ASSETS.md`: lista do que deve permanecer placeholder.
- `seed/validation-content.json`: lugares, parceiros, experiências e eventos fictícios.
- `seed/validation-trip.json`: viagem, visitas e clima fictícios.
- `acceptance/PLAYWRIGHT_MATRIX.md`: testes e screenshots obrigatórios.
- `acceptance/DEFINITION_OF_DONE.md`: critérios de conclusão.

## Atualização V11 sobre LATEST

- `PATCH_V11_README.md`: instruções de aplicação e validação do patch incremental.
- `docs/validation/BLOCK-08.md`: relatório do bloco de integração de carimbos/page flip/CI.
- `docs/validation/PATCH-V11-MERGE.md`: comparação entre o LATEST e o Patch V10 e decisões de merge.
- `src/features/stamps/`: motor procedural TypeScript integrado sem arquivos binários de fonte.
- `src/modules/passport/stamp-lifecycle.ts`: criação, preservação e backfill de snapshots de carimbo.
- `scripts/backfill-stamps.ts`: atualização idempotente de visitas legadas.
- `.devcontainer/devcontainer.json`: Codespaces com app e Playwright UI.
- `.github/workflows/ci.yml`: pipeline `quality -> Chromium/PostGIS` em desktop, tablet e mobile.
