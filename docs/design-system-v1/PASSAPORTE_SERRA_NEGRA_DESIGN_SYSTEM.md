# PASSAPORTE SERRA NEGRA — DESIGN SYSTEM V1

Documento de referência para implementação visual do Passaporte Serra Negra. Estas definições consolidam as decisões feitas até 09/09/2026.

## 1. Direção visual

A identidade deve combinar uma base neutra, editorial e sofisticada com cores complementares usadas de forma controlada para acentuação, diferenciação de nichos, carimbos, ícones, badges, filtros, pinos de mapa e pequenos destaques.

A paleta neutra é a identidade principal do produto. A paleta complementar não deve substituir essa base nem transformar cada tela em uma composição multicolorida.

Regra geral recomendada:

- 80% a 90%: paleta principal neutra.
- 10% a 20%: cores complementares e de nicho.
- Em componentes pequenos, uma única cor de nicho deve ser dominante por vez.

## 2. Paleta principal

Valores digitais aproximados a partir da referência visual fornecida.

| Token | HEX | Uso principal |
|---|---:|---|
| Neutral 050 | `#E7E7DE` | fundo claro principal |
| Neutral 100 | `#D2CEC4` | superfícies, cards e blocos secundários |
| Neutral 500 | `#645B5B` | taupe, detalhes e informação secundária |
| Neutral 700 | `#424348` | grafite, ícones e elementos fortes |
| Neutral 750 | `#424041` | grafite quente, navegação e superfícies escuras |
| Neutral 900 | `#262425` | carvão, áreas premium e dark mode |
| Neutral 950 | `#141416` | preto profundo, contraste máximo |

## 3. Paleta complementar e nichos

As cores abaixo funcionam como acentos da paleta principal. Os HEX são aproximações digitais da referência Pantone enviada.

| Accent | HEX | Aplicação sugerida |
|---|---:|---|
| Red Inferno | `#4E0000` | gastronomia, vinho, experiências noturnas e destaques especiais |
| Pastel Yellow | `#F2E6D1` | cultura, patrimônio, família e áreas editoriais suaves |
| Reseda | `#A1AD92` | natureza, turismo rural, bem-estar e sustentabilidade |
| Chive | `#50543B` | trilhas, aventura, ecoturismo e experiências ao ar livre |
| Powder Blue | `#94B2C4` | descanso, águas, bem-estar e experiências tranquilas |
| Deep Blue / 2965 C | `#01273E` | hospedagem premium, curadoria, confiança e institucional |
| Cocoa | `#594536` | cafés, produtos locais, artesanato, fazendas e gastronomia artesanal |
| Coconut Milk | `#F0EDE5` | superfícies claras, respiro visual e apoio editorial |

### Mapeamento inicial por nicho

| Nicho | Accent preferencial |
|---|---|
| Cafés e docerias | Cocoa |
| Gastronomia e restaurantes | Red Inferno |
| Vinhos e experiências noturnas | Red Inferno |
| Natureza e turismo rural | Reseda |
| Trilhas e aventura | Chive |
| Bem-estar e descanso | Powder Blue |
| Cultura e patrimônio | Pastel Yellow |
| Hospedagem premium | Deep Blue |
| Produtos locais e artesanato | Cocoa |

O mapeamento é extensível. Quando surgirem novos nichos, priorizar reutilizar uma das cores existentes antes de criar uma nova cor.

## 4. Light mode

O modo claro deve transmitir guia editorial, papel, curadoria, turismo e acolhimento.

- Background principal: `#E7E7DE`
- Background secundário: `#D2CEC4`
- Surface elevada: `#F0EDE5`
- Texto principal: `#141416`
- Texto secundário: `#424041`
- Texto muted: `#645B5B`
- Bordas: `#C3BFB6`
- Ícones: `#424348`
- CTA neutro: `#262425`
- Texto sobre CTA: `#E7E7DE`

As cores de nicho devem aparecer principalmente em ícones, tags, carimbos, pinos, detalhes de cards, filtros ativos e estados selecionados.

## 5. Dark mode

O dark mode deve ser uma extensão da identidade, não uma inversão genérica. O objetivo é manter o caráter editorial e premium.

- Background principal: `#141416`
- Background secundário: `#262425`
- Surface principal: `#2F2D2E`
- Surface elevada: `#424041`
- Texto principal: `#E7E7DE`
- Texto secundário: `#D2CEC4`
- Texto muted: `#AAA39F`
- Bordas: `#424348`
- Ícones: `#D2CEC4`
- CTA neutro: `#E7E7DE`
- Texto sobre CTA: `#141416`

No dark mode, as cores complementares devem continuar funcionando como acentos. Evitar usar cores saturadas como backgrounds de tela inteira.

## 6. Tipografia

### Página principal

- Heading principal: **Cuturila DEMO Regular**.
- Fallback operacional do heading: **Bebas Neue**, disponível no Google Fonts.
- Subheading: **Inter Medium**, substituindo Helvetica Neue Medium.
- Body copy: **Inter Light**, substituindo Helvetica Neue Light.

A Cuturila foi fornecida pelo usuário, mas o arquivo é identificado como DEMO. Confirmar a licença apropriada antes de uso comercial. Este pacote não redistribui arquivos de fonte.

### Páginas internas

- Título da página: **Arimo**.
- Subtítulo da página: **Cormorant Garamond**.
- Body copy: **Inter Light**.
- Subtítulos funcionais e destaques secundários: **Inter Medium**.

### Substituições definidas

| Fonte originalmente considerada | Situação | Substituição/uso |
|---|---|---|
| Druk Text Wide Bold | substituída por decisão visual | Cuturila DEMO Regular |
| Helvetica Neue Medium | não disponível no Google Fonts | Inter Medium |
| Helvetica Neue Light | não disponível no Google Fonts | Inter Light |
| Cuturila DEMO Regular | arquivo fornecido, não redistribuído | Bebas Neue como fallback |
| Arimo | disponível no Google Fonts | manter |
| Cormorant Garamond | disponível no Google Fonts | manter |

## 7. Hierarquia tipográfica inicial

Os valores abaixo são ponto de partida e podem ser ajustados após teste responsivo.

### Home

- Hero heading desktop: `clamp(4.5rem, 9vw, 9rem)`, line-height `0.88`, uppercase quando fizer sentido.
- Hero heading mobile: `clamp(3rem, 16vw, 5rem)`, line-height `0.9`.
- Hero subheading: `clamp(1.125rem, 2vw, 1.75rem)`, Inter Medium.
- Body: `1rem` a `1.125rem`, line-height entre `1.5` e `1.65`, Inter Light.

### Internas

- Título de página: Arimo, `clamp(2.5rem, 6vw, 5.5rem)`, peso 600 ou 700.
- Subtítulo editorial: Cormorant Garamond, `clamp(1.5rem, 3vw, 2.5rem)`, peso 400 ou 500; itálico quando contribuir para a composição.
- Body: Inter Light, `1rem` a `1.125rem`, line-height entre `1.55` e `1.7`.
- Subheading funcional: Inter Medium, `1rem` a `1.5rem`.

## 8. Carimbos dinâmicos

Os carimbos devem respeitar a identidade do nicho sem perder a linguagem principal do sistema.

Regras:

- Um único ícone por carimbo, referente ao nicho do estabelecimento.
- Formatos podem variar de forma controlada.
- A cor deve ser selecionada dentro da paleta aprovada.
- Em light mode, priorizar grafite, taupe, preto e accent do nicho.
- Em dark mode, priorizar creme, beige, accents claros e versões com contraste suficiente.
- Nome, data e número de visita permanecem legíveis em qualquer variação.
- Evitar mais de uma cor de nicho dentro do mesmo carimbo.

## 9. Uso das cores de nicho

As cores complementares podem ser usadas em:

- ícones de categoria;
- tags e chips;
- pinos do mapa;
- borda ou faixa de cards;
- filtros ativos;
- carimbos e selos;
- estados selecionados;
- microinterações;
- indicadores do roteiro;
- detalhes das páginas de pontos turísticos.

Evitar usar as cores de nicho como cor principal de todos os textos ou como fundo dominante de páginas inteiras.

## 10. Regras de contraste

- Texto de leitura deve usar prioritariamente a paleta neutra.
- Em backgrounds escuros, usar `#E7E7DE` ou `#F0EDE5` para textos principais.
- Em backgrounds claros, usar `#141416` para textos principais.
- Cores Pastel Yellow, Reseda e Powder Blue não devem ser usadas como texto pequeno sobre fundos claros.
- Red Inferno, Chive, Deep Blue e Cocoa funcionam melhor como accents escuros, fundos de componentes pequenos ou elementos gráficos.
- Validar contraste WCAG antes de colocar qualquer combinação em produção.

## 11. Tokens recomendados

Usar tokens semânticos no código, evitando componentes com HEX hardcoded. O pacote inclui:

- `design-tokens.css`
- `design-tokens.json`
- `google-fonts.css`

## 12. Google Fonts

Fontes disponíveis via Google Fonts e utilizadas neste sistema:

- Arimo
- Cormorant Garamond
- Inter
- Bebas Neue, somente fallback da Cuturila

## 13. Regra de implementação da Cuturila

A Cuturila deve permanecer como primeira opção do hero da home quando houver uma versão corretamente licenciada no projeto.

A stack recomendada é:

```css
font-family: "CuturilaDEMO", "Bebas Neue", sans-serif;
```

Se a Cuturila não estiver carregada ou não puder ser usada em produção, o sistema deve cair automaticamente para Bebas Neue.

---

**Status:** Design System V1 consolidado.
