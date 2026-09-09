# Integração do Dynamic Tourism Stamp Engine

O pacote adicional fornecido depois do comando inicial contém um motor completo, portanto o fallback de carimbo previsto no kit foi substituído pela implementação real.

## Integração

- código: `src/features/stamps/`;
- adapter da aplicação: `src/components/stamp-renderer.tsx`;
- fonte: `public/stamps/stamp.woff`;
- licença: `public/stamps/FONT_LICENSE.txt`;
- documentação original preservada em `docs/source/stamp-engine/`.

`StampRenderer` recebe `Visit + Place + category`. Os dados de visita continuam separados do desenho. O seed da visita mantém reprodução determinística e snapshots futuros podem persistir `stampSeed/stampSnapshot`.

## Limite

O motor renderiza a representação visual. Ele não confirma presença física nem valida QR; essa evidência pertence ao domínio de visita.
