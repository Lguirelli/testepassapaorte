# Auditoria de contraste

Validação numérica dos pares semânticos principais usados pela nova camada `theme.css`.

| Par | Foreground | Background | Contraste | Alvo | Resultado |
|---|---:|---:|---:|---:|---|
| light/text/canvas | `#161618` | `#E8E8E0` | 14.67:1 | 4.5:1 | PASS |
| light/secondary/canvas | `#403D3F` | `#E8E8E0` | 8.71:1 | 4.5:1 | PASS |
| light/muted/canvas | `#5E5A50` | `#E8E8E0` | 5.58:1 | 4.5:1 | PASS |
| light/control-border/surface | `#8A8378` | `#F3F1EC` | 3.32:1 | 3:1 | PASS |
| light/action | `#F3F1EC` | `#403D3F` | 9.51:1 | 4.5:1 | PASS |
| dark/text/canvas | `#F3F1EC` | `#161618` | 16.01:1 | 4.5:1 | PASS |
| dark/secondary/canvas | `#D4D1C7` | `#161618` | 11.83:1 | 4.5:1 | PASS |
| dark/muted/surface | `#B8B1AA` | `#2C292A` | 6.8:1 | 4.5:1 | PASS |
| dark/control-border/surface | `#817B7B` | `#2C292A` | 3.47:1 | 3:1 | PASS |
| dark/action | `#161618` | `#E8E8E0` | 14.67:1 | 4.5:1 | PASS |
| niche/red | `#F3F1EC` | `#4E0000` | 14.05:1 | 4.5:1 | PASS |
| niche/yellow | `#161618` | `#F2E8D1` | 14.83:1 | 4.5:1 | PASS |
| niche/sage | `#161618` | `#A1AD92` | 7.67:1 | 4.5:1 | PASS |
| niche/olive | `#F3F1EC` | `#5A5D43` | 6.04:1 | 4.5:1 | PASS |
| niche/blue | `#161618` | `#94B2C4` | 8.11:1 | 4.5:1 | PASS |
| niche/navy | `#F3F1EC` | `#00324D` | 11.9:1 | 4.5:1 | PASS |
| niche/cocoa | `#F3F1EC` | `#5B4536` | 7.92:1 | 4.5:1 | PASS |
| niche/coconut | `#161618` | `#F0EDE5` | 15.45:1 | 4.5:1 | PASS |

Todos os pares testados passam os alvos definidos. A borda de controle foi separada da borda decorativa especificamente para evitar o desaparecimento de inputs, tabs e botões no dark mode.

> Observação de validação: o ambiente bloqueou navegação do Chromium/Playwright com `ERR_BLOCKED_BY_ADMINISTRATOR`, inclusive para localhost e `file://`. Por isso a validação visual automatizada por navegador não pôde ser executada aqui; sintaxe, dependências, build do artefato e contraste dos tokens foram validados estaticamente.