# Patch v13 — Encontros pelo caminho

## Objetivo
Ajustar a seção **Encontros pelo caminho** para:
- melhorar bordas e leitura visual dos cards;
- reduzir a opacidade excessiva dos cards laterais;
- ampliar a presença do fundo/seção e reduzir o “respiro” lateral;
- permitir corte controlado dos cards nas extremidades;
- adicionar hover suave com leve escala e deslocamento para cima no card inteiro.

## Arquivos alterados
- `theme.css`
- `app.js`

## Resumo técnico
- carrossel passa a ocupar mais largura visual, com clipping lateral controlado;
- cards laterais ficam menos transparentes e menos borrados;
- bordas e sombras foram recalibradas;
- hover foi aplicado ao card inteiro, não apenas à imagem;
- seção recebeu ajuste de altura e paddings para reduzir espaço vazio.
