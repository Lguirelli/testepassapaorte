# Integração com visitas reais

O módulo pode ser copiado para React/Next.js ou usado pelo núcleo ESM em outro framework. A página do laboratório é apenas uma demonstração; não deve ser usada como backend de validação de visitas.

```tsx
import { TourismStamp, StampCollection } from './stamps/react';
<TourismStamp data={visit} options={{textureLevel:0.6}} />
<StampCollection visits={visits} sort="newest" />
```

Os outros valores de sort são oldest, category e route. O campo route identifica o roteiro. A ordenação não modifica dados de visitas.

No servidor, obtenha partnerId, partnerName, category/subcategory e localização do cadastro autorizado. Registre visitId, visitDate e visitNumber após validar o evento. O motor não confirma presença, não verifica QR/NFC, não aplica antifraude e não concede benefícios. Essa divisão evita acoplamento ao fornecedor do banco.

```ts
const stamp = generateStamp(validatedVisit);
await database.visits.update(validatedVisit.visitId, {
  stampSeed: stamp.seed,
  rendererVersion: stamp.rendererVersion,
  themeVersion: stamp.themeVersion,
  iconLibraryVersion: stamp.iconLibraryVersion,
  stampSnapshot: stamp
});
```

Esse trecho é pseudocódigo de integração: substitua database pela API real. Armazene o snapshot imutável e as versões junto aos dados da visita. Para manter fidelidade histórica, renderize o snapshot com seu renderer correspondente. A seed sozinha não protege um desenho contra mudanças de código, fonte ou biblioteca de ícones.

Para SVG standalone use renderStampSVG(snapshot,{embedFont:true,idPrefix:'id-unico'}). Para renderizações lado a lado, idPrefix deve ser único. O React usa useId automaticamente. Para uso como img isolada, exportDataURL incorpora o SVG.

PNG requer navegador com Canvas; exportStampPNG retorna Promise<Blob>. O tamanho padrão é 2048 px e o intervalo permitido é de 64 a 4096. O fundo é transparente, a menos que seja fornecida uma cor como terceiro argumento. Em Node, use SVG ou conecte um rasterizador próprio, sem alterar o núcleo.

A pasta public/engine contém uma distribuição ESM pronta, com núcleo, adaptador React e CSS/fonte. A exportação JSON pode ser armazenada no seu backend. Ela contém dados de demonstração no laboratório; substitua por visitas autorizadas na integração real.
