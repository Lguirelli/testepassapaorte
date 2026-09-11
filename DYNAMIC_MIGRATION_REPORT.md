# Migração para aplicação dinâmica — relatório

## Escopo concluído

1. Next.js é o único runtime do repositório.
2. A SPA estática, redirects HTML e GitHub Pages foram removidos.
3. A base visual foi consolidada em `src/app/globals.css`, sem `!important`; movimentos e estilos específicos foram isolados em CSS Modules (`content.module.css` e `parceiros/page.module.css`).
4. As páginas são classificadas por função em `src/core/routing/page-kind.ts`.
5. A navegação oficial está centralizada em `src/core/routing/routes.ts`, com URLs independentes para Explorar, Pontos turísticos, Mapa, Roteiros e Para parceiros.
6. `/parceiros` é aquisição/institucional e `/parceiros/[slug]` é detalhe de parceiro.
7. Os 12 atrativos pesquisados que existiam em `tourism-data.js` foram incorporados ao seed dinâmico.
8. O smoke estático foi removido e substituído por testes unitários/e2e da arquitetura dinâmica.
9. O build usa `output: 'standalone'`, com Dockerfile e workflow para empacotar o servidor Next.

## Validações executadas neste ambiente

- ausência do runtime estático: PASS;
- ausência dos smokes estáticos antigos: PASS;
- ausência do workflow GitHub Pages: PASS;
- workflow dinâmico presente: PASS;
- `output: 'standalone'`: PASS;
- `!important` em `src/app/globals.css`: 0;
- links `#/...` dentro de `src`: 0;
- slugs dos 20 lugares do seed: únicos;
- atrativos pesquisados migrados: 12;
- assets fallback ausentes: 0;
- transpilação sintática de todos os `.ts/.tsx`: PASS;
- lógica de classificação de rotas e unicidade da navegação: PASS.

## Limite da validação local

A instalação de dependências via `npm ci` não concluiu neste ambiente de execução, portanto `npm run typecheck`, `npm run build` e Playwright não puderam ser executados aqui com a árvore real de dependências. O CI continua configurado para executar essas etapas em ambiente com dependências disponíveis.

## Aplicação do ZIP incremental

Extraia o ZIP sobre a raiz do repositório e execute:

```bash
sh APPLY_DYNAMIC_MIGRATION.sh
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```
