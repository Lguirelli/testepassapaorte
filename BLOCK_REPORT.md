# BLOCK_REPORT : Bloco 08 (checkpoint PARCIAL)

## Objetivo
Fechar Validation V1 por regressão executada. O fechamento permanece bloqueado por infraestrutura.

## Estado inicial recebido
Snapshot canônico do Bloco 07, 748 arquivos conferidos contra o manifest interno, sem divergências. ZIP original com CRC válido. Não há histórico Git no snapshot recebido. A identidade da base é seu SHA-256: f758bed53abb8d8ac0664f52efa156d0f4f2618d25281d8fb5a5032ade2f25e7.

## Arquivos criados
artifacts/block_08/ com evidências desta execução, docs/validation/BLOCK-08.md, DELIVERY_INDEX.md e scripts/package-checkpoint.py. A lista exata está em FILES_CHANGED.txt.

## Arquivos modificados
WORK_STATE.md e VALIDATION_REPORT.md. Nenhuma alteração de domínio, UI, seed ou dependências. next-env.d.ts regenerado pelo build foi restaurado ao original.

## Decisões
Preservar a arquitetura e o lockfile recebidos. Usar PGlite explicitamente para as verificações locais. Não iniciar Bloco 09 enquanto esta regressão permanece bloqueada. Não declarar o Bloco 08 funcionalmente concluído.

## Implementação
Instalação por npm ci. Execução de baseline, migração/seed demo e tentativa integral da suíte existente. Empacotamento reproduzível sem depender do histórico Git ausente.

## Testes executados
- npm ci: PASS, 388 pacotes.
- npm run lint: PASS.
- npm run typecheck: PASS.
- npm test: PASS, 13 testes.
- node --import tsx scripts/verify-persistence.ts: PASS, banco PGlite isolado, migrações/seed repetidos e edição preservada após reabertura.
- ALLOW_DEMO=true npm run build: PASS.
- DB_MODE=pglite npm run db:migrate e db:seed duas vezes: PASS.
- Smoke HTTP com build de produção, ALLOW_DEMO=true e DB_MODE=pglite: 9 rotas com HTTP 200. Não comprova interação de UI.
- Suíte Playwright inteira: 51 tentativas, 51 falhas no lançamento por executável ausente, nenhum corpo de teste executado.
- Instalação Chromium: tentativas normais com timeout no CDN, conforme log.
- apt-get update: FAIL, setgroups/setegid/seteuid e permissões do ambiente.

## Resultados
Baseline executável estável nas verificações locais realizadas. Não há evidência suficiente para promover G1–G8 a PASS. PostGIS não executado. Axe, inspeção por teclado, screenshots e regressão responsiva não executados nesta sessão.

## Screenshots/evidências
Logs em artifacts/block_08/. Capturas históricas existentes são preservadas e não representam validação desta execução. Nenhuma screenshot nova foi produzida.

## Bugs encontrados
Nenhuma regressão de produto comprovada nas verificações executáveis. A cobertura existente de Admin testa listagem nos seis tipos e o ciclo de edição de um lugar. Ela não substitui o CRUD completo solicitado. Outros fluxos adicionais do comando também continuam exigindo expansão e execução de cobertura.

## Bugs corrigidos
Nenhum bug de produto corrigido sem reprodução. Empacotador de checkpoint inclui listas e hashes que o script histórico não gerava e funciona sem Git.

## Pendências reais
Disponibilizar Chromium compatível e PostgreSQL/PostGIS real por meios autorizados. Executar migrations/seed/idempotência e persistência após reinício no banco oficial. Executar E2E completo e ampliar CRUD/status dos seis tipos, edição de roteiro, deduplicação, temas, tracking, acessibilidade e inspeção dos três viewports. Preservar as dívidas de relações, categorias e i18n para tratamento conforme comando.

## Gates afetados
G0 PASS preservado. G1–G8 PARCIAL. Os sucessos de baseline não equivalem ao fechamento dos gates.

## Integridade da entrega
block_08.zip e LATEST.zip têm CRC e SHA-256 de seus payloads verificados. MANIFEST.json não inclui seu próprio hash. SHA256SUMS.txt inclui o manifest e não inclui a si mesmo. Hashes dos ZIPs ficam no recibo externo DELIVERY_RECEIPT.json e no WORK_STATE.md externo, evitando referência circular. O WORK_STATE dentro dos ZIPs aponta para esse recibo.

## Próximo bloco recomendado
Continuar Bloco 08, sem reiniciar o projeto. Não iniciar Bloco 09 nesta entrega parcial.
