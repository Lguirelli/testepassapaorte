# Paleta oficial — Passaporte Serra Negra

A partir desta revisão, a paleta principal deixa de ser uma decisão temporária de validação. Esta decisão substitui apenas a restrição de "paleta não definida" do documento `docs/NO_BRAND_DECISIONS.md`; tipografia, fotografia e demais decisões que ainda não foram aprovadas continuam abertas.

## Light

```css
:root {
  --bg-primary: #E8E8E0;
  --bg-secondary: #D4D1C7;
  --surface-primary: #F3F1EC;
  --surface-secondary: #D4D1C7;
  --text-primary: #161618;
  --text-secondary: #403D3F;
  --text-muted: #7A7372;
  --border-primary: #C8C3B8;
  --icon-primary: #45454A;
  --accent-primary: #403D3F;
  --accent-secondary: #7A7372;
}
```

## Dark

```css
[data-theme="dark"] {
  --bg-primary: #161618;
  --bg-secondary: #262425;
  --surface-primary: #262425;
  --surface-secondary: #403D3F;
  --text-primary: #E8E8E0;
  --text-secondary: #D4D1C7;
  --text-muted: #A6A09A;
  --border-primary: #45454A;
  --icon-primary: #D4D1C7;
  --accent-primary: #E8E8E0;
  --accent-secondary: #7A7372;
}
```

## Complementar por nicho

- vermelho profundo `#4E0000`
- amarelo pastel `#F2E8D1`
- verde sálvia `#A1AD92`
- verde oliva `#5A5D43`
- azul powder `#94B2C4`
- azul petróleo `#00324D`
- marrom cocoa `#5B4536`
- Coconut Milk `#F0EDE5`

Estas cores são contextuais: ícones de categoria, pinos, chips, carimbos, selos, pequenas barras, estados ativos, capas de seção e tags. Elas não devem substituir a paleta principal em header, fundo global, CTA principal ou grandes superfícies sem relação com um nicho.
