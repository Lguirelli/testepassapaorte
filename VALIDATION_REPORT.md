# VALIDATION REPORT — Passaporte Serra Negra Validation V1

> Este arquivo é atualizado pela etapa de montagem. Um gate só recebe PASS quando foi efetivamente executado no ambiente indicado.

## Implementado

- arquitetura Next.js modular;
- providers mock e modo demo;
- repository local + PostgreSQL/PostGIS;
- migration e seed;
- Icon System v2;
- Dynamic Tourism Stamp Engine integrado;
- Home, Explorar, Lugar, Parceiro, Admin, onboarding, roteiro, calendário e Passaporte;
- tracking local;
- Playwright + axe;
- GitHub Actions.

## Execução local desta montagem

Pendente de preenchimento após os comandos de validação.

## Playwright

A suíte Next está em `tests/e2e/`. A validação visual offline está em `scripts/run_static_visuals.py` e é somente fallback quando dependências npm não podem ser instaladas.

## Bugs encontrados durante a construção

1. **Proteção de item fixo existia só na UI.** Correção: regra movida para o `DemoTravelEngine`, protegendo API e domínio.
2. **Navegação do Passaporte aplicava `active` no wrapper errado e não permitia avançar no desktop.** Correção: página ativa passou para o próprio elemento e navegação considera desktop em pares e mobile individual.
3. **Migration/seed PostGIS montava expressão geométrica por interpolação aninhada.** Correção: branches explícitos usam `ST_SetSRID(ST_MakePoint(...),4326)`.
4. **Placeholder SVG continha path com percentuais inválidos.** Correção: removido o path inválido.

## Pendências reais

- identidade visual final: propositalmente fora do escopo;
- mapa territorial final: depende de asset/decisão futura;
- providers externos reais: dependem de credenciais e contratos futuros;
- validação PostgreSQL/PostGIS local: depende de Docker/PostGIS disponível;
- instalação npm/Next no ambiente de montagem: depende de acesso funcional ao registry/cache.

## Gates

| Gate | Estado na montagem | Evidência |
|---|---|---|
| G0 fontes lidas | PASS | kit, documentação mestre, seeds, Icon System e stamp engine auditados |
| G1 bootstrap | PENDENTE PARCIAL | estrutura criada; lint/typecheck/build Next dependem de npm; PostGIS depende de Docker |
| G2 descoberta | PENDENTE EXECUÇÃO NEXT | implementação + suíte criadas |
| G3 entidades | PENDENTE EXECUÇÃO NEXT | implementação + suíte criadas |
| G4 Admin | PENDENTE EXECUÇÃO NEXT | fluxo completo implementado + teste crítico criado |
| G5 roteiro | PENDENTE EXECUÇÃO NEXT | engine e edição local implementados |
| G6 calendário | PENDENTE EXECUÇÃO NEXT | implementado sobre o mesmo TripBundle |
| G7 Passaporte | PENDENTE EXECUÇÃO NEXT | carimbo real integrado; responsividade implementada |
| G8 regressão final | PENDENTE | requer suíte Next completa |

## Não assumir

A existência do código e dos testes não equivale a execução. O fallback visual offline não valida Server Components, APIs, React hydration, banco ou build Next.

## Modelo visual de destino adicionado após revisão

A primeira entrega validava arquitetura e fluxos, mas não oferecia uma superfície pública que demonstrasse de forma convincente como o produto final poderia parecer. Isso foi corrigido com a pasta `showcase/`.

Implementado no showcase:

- Home visual de destino;
- Explorar com busca, filtros, cards e mapa ilustrativo;
- página de Lugar;
- Roteiro personalizado;
- Meu Passaporte com capa, ticket, caminho e carimbos;
- visão do Admin operacional;
- paleta principal neutra e acentos por nicho;
- Arimo + Cormorant Garamond;
- light/dark;
- Icon System v2 reutilizado;
- GitHub Pages via Actions.

Validação executada localmente:

- `python scripts/validate_showcase.py`: PASS;
- 6 páginas com referências locais resolvidas;
- 22 screenshots geradas: 6 páginas × desktop/tablet/mobile, mais Home e Passaporte em dark desktop/mobile;
- nenhuma ocorrência de overflow horizontal na rodada final;
- nenhum erro de console capturado na rodada final.

O showcase é uma hipótese visual de destino, não fonte de verdade turística. As ilustrações e métricas são demonstrativas.
