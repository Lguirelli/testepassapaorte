# WORK_STATE

Atualizado: 2026-09-11. Bloco atual: 12, etapa demonstrativa ENCERRADA conforme escopo ajustado pelo usuário. Blocos 00–12 concluídos como entregas; resultados BLOCKED históricos preservados. Não reiniciar o projeto.

## Objetivo e decisões permanentes
Repositório de validação do Passaporte Serra Negra, não MVP final. Next.js App Router, React, TypeScript strict, monólito modular, Drizzle, PostgreSQL/PostGIS e Docker Compose. Dados sintéticos do kit; ícones do Icon System v2; fontes, cores e capa neutras temporárias. Providers mock explícitos. Motor oficial de carimbos, mapa territorial, fotografias e RV-XX permanecem placeholders conforme comando. Não importar branding ou mudanças de outras conversas.

## Estado técnico
Home, Explorar, lugares/parceiros, Admin de seis tipos, onboarding, roteiro editável, calendário e Passaporte implementados. Admin separa rascunho/publicação, mantém auditoria e comparação de versão. Arquivo só volta ao público por publicação explícita. Categorias desativadas e relações indisponíveis são filtradas no público. Livro separa presença de planejamento. Compatibilidade pontual do ícone legado passaporte-descobertas para perfil-relaxar.

## Validações concluídas
Lint e TypeScript PASS; 13 testes unitários PASS; 11 cenários de integração Admin PASS; migração/seed idempotente com 30 conteúdos e 1 viagem PASS em PGlite isolado; build completo PASS. Navegador cloud em 1363×936 usado para fluxos dirigidos, com 10 screenshots acumuladas. Bloco 09 confirmou oito verificações de categoria/arquivo/republicação. Pacotes conferidos por CRC, lista exata e SHA-256.

## Gates originais e dispensa para esta etapa
G0 PASS. G1–G8 PARCIAIS. Chromium standalone e Docker/PostGIS indisponíveis nesta execução; 57 casos E2E preparados, não aprovados. Sem execução Axe ou prova em três viewports; sem execução remota do CI. Preflight final retornou BLOCKED corretamente. Não declarar aceitação integral ou produção pronta. Extração i18n e modelo relacional definitivo permanecem pendências registradas.

## Arquivos principais
README.md; VALIDATION_REPORT.md; DELIVERY_INDEX.md; docs/FINAL_ACCEPTANCE.md; docs/VALIDATION_ARCHITECTURE.md; docs/decisions/; docs/validation/BLOCK-*.md; src/; drizzle/; seed/; public/; tests/; scripts/validate-all.mjs; scripts/verify-admin.ts; scripts/verify-persistence.ts; scripts/deliver-block.py; artifacts/playwright/; artifacts/validation/.

## Dependências e execução
Node 24 recomendado; dependências fixadas no package-lock.json. `npm ci`; copiar `.env.example` para `.env.local`; `docker compose up -d`; `npm run db:migrate`; `npm run db:seed`; `npm run dev`. Sem Docker, fallback DB_MODE=pglite e ALLOW_DEMO=true conforme README, sem PostGIS. Nunca abrir o mesmo PGlite por dois processos.

Com banco de teste e Chromium disponíveis, definir VALIDATION_DATABASE_URL conforme docs/FINAL_ACCEPTANCE.md e executar `npm run validate:preflight`, depois `npm run validate:full`. Resultados em artifacts/validation/acceptance-current. Fechar servidor existente na porta 4173 antes da suíte. CI permite acionamento manual, mas requer repositório GitHub autorizado.

## Dados e entregas
LATEST.zip contém todo o projeto reproduzível a partir do seed, sem banco binário, caches, node_modules, builds ou segredos. block_XX.zip contém delta e evidências do bloco, respeitando caminhos relativos. Arquivos antigos preservados. Categoria Bem-estar e parceiro Café terminaram públicos após QA; fixtures originais não foram modificados. Não confundir memória de QA com estado inicial de uma extração limpa.

## Próximo passo
Apresentar a demonstração conforme docs/DEMO_PRESENTATION.md e registrar feedback priorizado. O usuário dispensou explicitamente Chromium e PostGIS para encerrar esta etapa: ADR-005. Não há novo módulo de produto autorizado pendente. Não repetir tentativas de infraestrutura como condição de encerramento. A aceitação integral original permanece futura e não executada; nenhuma classificação foi promovida artificialmente.

## Execução recomendada agora
Node 24, `npm ci`, `npm run demo`. Sem Docker, Chromium ou credenciais. O script prepara e inicia PGlite separado em .data/demo-presentation, preservando o banco anterior. `npm run demo:prepare` prepara apenas. DEMO_DATA_PATH permite outro diretório demo. Pare o servidor antes de preparar e nunca compartilhe um diretório PGlite entre processos.

## Bloco 11
Guia reenviado executado com VALIDATION_DATABASE_URL local demo. Preflight e full retornaram BLOCKED; full não chegou às etapas de aplicação. Docker ausente, PostGIS não conectado, Chromium não disponível no preflight. Tentativa limitada de instalação documentada em artifacts/validation/block-11/. Nenhum código de produto alterado. Pacotes atuais: block_11.zip e LATEST.zip.

## Bloco 12
Comandos demo e demo:prepare adicionados; guia de apresentação e ADR-005 entregues. Preparo em banco temporário executado duas vezes PASS; recusa de porta ocupada sem criar banco PASS; lint, TypeScript e 13 unitários PASS. Código de UI e arquitetura preservados; build e integração seguem evidências aprovadas anteriores, sem reexecução neste bloco. Inicialização completa pelo novo wrapper não foi reinspecionada no navegador. Chromium/PostGIS dispensados para encerramento desta etapa, sem PASS de homologação. Pacotes: block_12.zip e LATEST.zip.
