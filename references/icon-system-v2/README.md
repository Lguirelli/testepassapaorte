# Passaporte Serra Negra — Icon System v2

Versão consolidada dos três conjuntos fornecidos para o projeto.

- **165** nomes semânticos disponíveis no componente `Icon`.
- **154** glyphs recebidos/catalogados.
- **145** assets/componentes canônicos após reuso de geometrias idênticas.
- `public/icons/`: assets canônicos normalizados.
- `src/design-system/icons/`: componente, registry, aliases, tipos e componentes gerados.
- `src/design-system/tokens/icons.css`: escala de tamanho.
- `icon-manifest.json`: proveniência, códigos originais, escopos e resolução de aliases.
- `docs/ICON_CATALOG.md`: catálogo completo.
- `docs/ICON_ALIASES.md`: mapa de reuso.
- `docs/ICON_AUDIT_V2.md`: auditoria técnica.
- `docs/preview.html`: catálogo navegável.
- `scripts/validate-icons.mjs`: validação automatizada.

## Uso

```tsx
import { Icon } from "@/design-system/icons";

<Icon name="roteiro-adicionar-parada" />
<Icon name="qr-camera" size="lg" />
<Icon name="admin-conteudo-cms" title="Conteúdo" />
```

## Validar

```bash
node scripts/validate-icons.mjs
```
