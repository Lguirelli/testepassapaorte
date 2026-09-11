# Refinamento do index — 2026-09-11

Aplicado sobre a home dinâmica do Next.js, preservando banco, CMS/Admin, roteiro, calendário, Passaporte e providers existentes.

## Implementado

- header sem linha inferior e CTA de roteiro sempre claro;
- hero com primeira dobra, conteúdo centralizado, busca limpa e atalhos;
- exatamente 3 Primeiros caminhos, sorteados no request da página, sem duplicação;
- CTA para a listagem completa;
- Encontros pelo caminho com galeria curva, drag, wheel, setas, card central dominante, afastamento lateral e fade inferior;
- pontos da linha de experiência com escala e cor sem deslocamento;
- Tipos de roteiro com transição horizontal coordenada;
- cards de ponto de partida sem clipping e com hover perceptível;
- cabeçalhos de Descoberta contextual e Explore por interesse centralizados;
- FAQ com expansão orgânica e accordion exclusivo;
- pins do mapa apenas com escala/cor;
- CTA final em duas linhas no desktop;
- reduced motion e responsividade.

## Arquivos principais

- `src/app/page.tsx`
- `src/app/home.module.css`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/HomeExperience.tsx`

Nenhum módulo de Admin, persistência, roteiro, calendário, Passaporte ou tracking foi removido.
