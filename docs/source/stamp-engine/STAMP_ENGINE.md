# Uso do motor

```ts
import { generateStamp, renderStampSVG } from './stamps';
const stamp = generateStamp(visit, {
  textureLevel: 0.65, showLocation: true, showVisitNumber: true,
  variationMode: 'visit', size: 320, rotation: true
});
const svg = renderStampSVG(stamp, {idPrefix: 'visita-123', embedFont: true});
```

`partnerId` e `partnerName` são obrigatórios. Categoria vazia ou desconhecida usa o ícone de destino. Data ausente ou inválida exibe “DATA NÃO INFORMADA”. Datas devem ser civis no formato YYYY-MM-DD. O adaptador de backend deve converter timestamps para a data local do destino antes de chamar o motor.

A seed explícita tem precedência. Sem seed, modo visit usa partnerId, visitId (ou data) e número da visita. Modo partner usa apenas partnerId. O hash é para variação visual, não para criptografia ou autenticação. O ícone é escolhido pelo nicho, nunca pela seed.

Overrides: customIcon, customShape, customLayout e customColor. Ícone ou forma desconhecidos recorrem ao fallback; composição incompatível usa uma composição permitida. Cores devem constar da paleta. preferredShapes e preferredColors restringem escolhas válidas; listas sem correspondência voltam ao padrão.

Níveis de detalhe: compact mostra nome e ícone; normal acrescenta data; full inclui número, status e localização. Sem detalhe explícito, tamanho até 96 usa compact, até 160 usa normal e os demais usam full. O texto completo continua no título acessível.

`generateStampCollection` evita triplas repetições para registros ainda sem seed e stampId. Visitas já persistidas não são reajustadas. Grave a seed retornada antes de reordenar novas visitas. A organização cronológica pertence ao componente de coleção.

Versões retornadas: rendererVersion, themeVersion e iconLibraryVersion. v1 é a única versão implementada; versões de renderer desconhecidas são rejeitadas explicitamente. O snapshot JSON deve ser tratado como dado confiável da aplicação, não como SVG externo arbitrário.
