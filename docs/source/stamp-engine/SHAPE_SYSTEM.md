# Formas

O registro inclui circle, double-circle, irregular-circle, oval-horizontal, oval-vertical, rectangle, rounded-rectangle, square, rounded-square, octagon, hexagon, scalloped, badge, postal, ticket, soft-shield e double-border.

Círculo duplo e moldura dupla são variações de borda; as outras formas combinam proporções e contornos distintos. Todas usam viewBox 0 0 320 320. Nenhuma forma usa PNG.

```ts
registerShape({
  id: 'meu-formato', label: 'Meu formato',
  path: 'M25 35H295V285H25Z',
  safeArea: {x:55,y:65,width:210,height:190},
  supportedLayouts: ['center','ruled','banner']
});
```

O path aceita somente sintaxe de geometria. A área segura define o retângulo para ajuste do conteúdo de formas novas. Formas incorporadas têm um contentTransform numérico calibrado visualmente, que permite maior uso de áreas curvas sem sacrificar a legibilidade. Não use escala negativa, área vazia ou coordenadas não finitas.

Escolha supportedLayouts conforme a geometria: radial e seal exigem espaço para um arco superior. As bordas internas são versões escaladas do mesmo contorno. Para acrescentar uma forma, registre sua geometria e metadados; o gerador não precisa conhecer seu nome.

Rode a página de teste visual com textos curtos, longos e localização completa antes de liberar uma forma nova. O teste geométrico compara as caixas de texto retas com o contorno externo. Texto curvo e afastamento da borda interna ainda exigem inspeção visual.
