# Patch para Documentação Mestra — Icon System v2

## Sistema oficial de ícones

O Passaporte Serra Negra possui um Icon System único e reutilizável para superfícies do turista, área do parceiro e Admin/CMS. Os ícones são SVG vetoriais, usam `currentColor`, compartilham a mesma família de traço e são consumidos por um registry semântico central.

Regras:

- código de produto utiliza nomes semânticos, nunca códigos de arquivo/prancheta;
- a mesma geometria pode ser reutilizada por múltiplos significados através de aliases do registry;
- duplicidade de glyph não deve gerar componentes independentes quando a geometria for idêntica;
- Admin/CMS pertence à mesma família gráfica, mas possui escopo semântico próprio;
- ícones devem funcionar em Light e Dark Mode sem cores hardcoded;
- tamanho padrão é controlado por tokens;
- acessibilidade é responsabilidade conjunta do componente `Icon` e do controle que o contém;
- SVGs com `mask` preservam cores internas necessárias à máscara;
- IDs internos são namespaced para impedir colisões no DOM;
- qualquer novo ícone deve entrar pelo registry, manifesto e validação automática.

A versão 2 consolida o núcleo original com os conjuntos de perfil de viagem, lugares/parceiros, clima, roteiro, calendário, QR/visita, Passaporte, mapa, compartilhamento, área do parceiro e Admin/CMS.
