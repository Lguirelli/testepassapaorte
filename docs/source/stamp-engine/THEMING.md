# Tema e textura

A paleta inicial contém terracota, oliva, petróleo, mostarda, bordô, azul-marinho e marrom. As cores são validadas contra o papel #F6F1E7 com razão mínima 4,5:1. O amarelo mostarda foi escurecido em relação à referência para melhorar contraste.

```ts
const theme = createStampTheme({
  id: 'cidade-ou-evento', version: 1,
  palette: ['#782C3C','#274C6D','#A24B2A'],
  background: '#F6F1E7'
});
const stamp = generateStamp(visit, {theme, textureLevel: 0.6});
```

São aceitas cores hexadecimais com seis dígitos. Cores insuficientes em contraste são removidas; uma paleta vazia é rejeitada. customColor seleciona apenas uma cor da paleta ativa. O contraste validado considera a tinta íntegra; textura, dimensão final e o fundo onde você colocar o SVG devem ser avaliados no contexto de uso.

A fonte é DejaVu Sans Bold, condensada pelo ajuste vetorial, hospedada localmente, com licença e exceções de incorporação incluídas em FONT_LICENSE.txt. Ela substitui Oswald, considerada na pesquisa, para eliminar solicitações externas. Exportações SVG incorporam a fonte e o PNG é renderizado a partir do mesmo SVG.

A textura combina máscara de pequenos desgastes determinísticos, granulação com feTurbulence/feComposite no ícone e deslocamento leve na borda. A máscara de texto é mais discreta. textureLevel aceita 0 a 1. Rotação padrão varia de -5° a +5°, derivada da seed; rotation:false a remove.

Ajuste tokens em theme.ts e preserve o renderer antigo caso altere a identidade de uma versão publicada. Cor, borda e texto podem representar edições especiais sem criar um segundo ícone.
