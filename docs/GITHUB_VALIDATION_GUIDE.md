# Guia de validação no GitHub

Este repositório foi preparado para revisão técnica e visual do vertical slice já construído. Ele não representa o MVP final nem uma versão aprovada para produção.

## 1. Revisão rápida pelo próprio GitHub

Comece por:

1. `README.md`, para visão geral, rotas e capturas.
2. `VALIDATION_REPORT.md`, para resultados realmente executados e gates.
3. `WORK_STATE.md`, para continuidade e pendências.
4. `docs/VALIDATION_ARCHITECTURE.md`, para arquitetura.
5. `acceptance/PLAYWRIGHT_MATRIX.md`, para a matriz de regressão ainda pendente.

As capturas existentes ficam em `artifacts/playwright/cloud-1363x936/`.

## 2. Abrir a aplicação em Codespaces

No GitHub, abra **Code → Codespaces → Create codespace on main**. O devcontainer usa Node 24 e prepara automaticamente o fallback PGlite, sem PostGIS. Depois do `postCreateCommand`, execute:

```sh
npm run dev
```

A porta 4173 é encaminhada automaticamente. O Codespace é adequado para revisão de fluxo e UI, mas não substitui a validação PostgreSQL/PostGIS do CI.

## 3. Validar com GitHub Actions

O workflow `.github/workflows/ci.yml` roda em push, pull request e manualmente por **Actions → Validation → Run workflow**. Ele sobe PostGIS 16/3.4, aplica migration/seed, verifica persistência, executa lint, typecheck, unitários, build e instala Chromium para Playwright.

Ao final, a Action publica `validation-evidence` com evidências de Playwright, inclusive em falha.

## 4. Fluxos prioritários para revisão humana

- Home e Explorar: clareza do modo fictício, busca/filtros e transição para entidades.
- Lugar e Parceiro: distinção conceitual entre ponto de interesse e negócio parceiro.
- Admin: rascunho → preview → publicação → histórico, sem vazamento do draft para o público.
- Roteiro: geração determinística e edição local sem reconstrução silenciosa do dia inteiro.
- Calendário: consistência com o mesmo agregado do roteiro e leitura mobile.
- Passaporte: separação entre planejado e registrado, navegação do livro e registro demo explícito.

## 5. Como registrar problemas

Use **Issues → New issue** e escolha `Bug de validação` para defeitos reproduzíveis ou `Feedback de produto / experiência` para observações de uso. Inclua viewport, passos e evidência quando disponíveis.

## 6. Critério para avançar ao Bloco 08

Não promover os gates apenas porque o repositório abre ou porque a Action de build passa. O Bloco 08 deve executar os 51 casos E2E, validar os três viewports, revisar Axe, completar cobertura CRUD/arquivo/relações e confirmar PostGIS antes de atualizar G1–G8.
