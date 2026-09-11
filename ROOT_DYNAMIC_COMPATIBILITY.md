# Compatibilidade da raiz sem retornar à SPA estática

Os arquivos HTML na raiz e nas pastas de entrada são **pontes de compatibilidade**, não páginas da aplicação.

A fonte de verdade permanece em `src/app` e é renderizada pelo Next.js.

## Como usar

1. Instale as dependências: `npm ci`
2. Migre/alimente a base quando necessário: `npm run db:migrate` e `npm run db:seed`
3. Execute: `npm run dev`
4. A aplicação dinâmica ficará, por padrão, em `http://localhost:4173`.

Se `index.html` ou uma das entradas de compatibilidade for aberta por um preview estático, `dynamic-entry.js` procura a aplicação dinâmica nas portas 4173 e 3000 e encaminha a rota correta.

É possível informar outra origem com `?__app=https://host-da-aplicacao`.

## Rotas canônicas

- `/` — Home
- `/explorar` — Exploração geral
- `/pontos-turisticos` — Pontos turísticos
- `/mapa` — Mapa
- `/parceiros` — Programa/landing de parceiros
- `/parceiros/[slug]` — Parceiro individual
- `/lugares/[slug]` — Lugar individual
- `/roteiro` — Montagem de roteiro
- `/viagens/[tripId]/roteiro` — Roteiro de viagem
- `/viagens/[tripId]/calendario` — Calendário
- `/meu-passaporte` — Passaporte

Aliases legados `/para-parceiros` e `/lugares` são redirecionados pelo Next.js.
