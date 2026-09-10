# Dynamic Tourism Stamp Engine: integração no Passaporte

Fonte: pacote `dynamic-tourism-stamp-engine.zip` fornecido durante o desenvolvimento do projeto.

Este repositório incorpora somente o núcleo necessário para geração e renderização procedural em `src/features/stamps/`. O adaptador foi ligado ao ciclo de visitas do Passaporte no Bloco 08. O motor não valida presença, QR, antifraude, compra, reserva ou benefício; essas responsabilidades permanecem fora do renderer.

A integração persiste o snapshot serializável por visita para preservar a aparência histórica do carimbo. A biblioteca de ícones derivada de Lucide mantém a licença em `LUCIDE_LICENSE.txt`.

Arquivos binários de fonte e payloads de fonte incorporada não fazem parte desta integração. O renderer usa a pilha tipográfica de fallback definida no SVG.
