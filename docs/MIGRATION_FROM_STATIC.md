# Migração da implementação estática

A aplicação estática antiga foi tratada como referência visual/comportamental, não como segundo runtime.

## Consolidado no Next.js

- shell/header/footer e tema;
- Home e motion aprovado;
- descoberta, mapa e páginas de lugar;
- landing e páginas de parceiros;
- roteiro/calendário;
- Passaporte;
- Admin e área do parceiro;
- ícones SVG e tokens.

## Removido do runtime

- `index.html`, `app.js`, `data.js`, `theme.css` e variantes visuais concorrentes;
- bridge que exigia manter a SPA;
- viagem `demo-trip-001` como fonte de runtime;
- providers mock de autenticação, clima e rotas;
- Material Symbols como sistema principal.

## Compatibilidade de dados

A migration `0002_final_product.sql` preserva o antigo `trips.data` como `legacy_data` nullable para não destruir histórico, mas o schema Drizzle e o runtime não o leem nem escrevem. Após migração e verificação de ambiente real, essa coluna pode ser removida em uma migration futura de housekeeping.
