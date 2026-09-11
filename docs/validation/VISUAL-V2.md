# Checkpoint visual v2

Data: 2026-09-10.

## Objetivo

Aplicar o `Passaporte Serra Negra — Guia de Construção Visual e Modular v2` à demonstração estática já funcional, sem reiniciar o produto nem substituir os dados sintéticos existentes.

## Implementado na Home

A Home passa a ser renderizada por um registry local de seções e contém, nesta ordem:

1. Hero editorial com busca funcional e sugestões rápidas;
2. Conheça Serra Negra com destaque selecionável;
3. índice visual de parceiros com item central e navegação;
4. narrativa visual de rota;
5. showcase selecionável de tipos de roteiro;
6. cards de roteiro;
7. bloco editorial contextual com clima/evento demo;
8. categorias de exploração;
9. FAQ em accordion;
10. apresentação visual do Passaporte;
11. mapa demonstrativo vinculado a lugares;
12. CTA final.

As imagens de referência do kit não foram usadas como conteúdo das páginas. A demo usa arte abstrata em CSS claramente demonstrativa, evitando copiar marcas, fotografias ou composições pixel a pixel das referências.

## Página pública de parceiro

Foi reconstruída com:

- Hero imersivo;
- Quick Info;
- seção Sobre;
- módulos de experiências existentes;
- informações e ações com resumo sticky em desktop;
- estado de roteiro e visita;
- contatos bloqueados como demo;
- localização com mapa abstrato;
- continuidade de exploração.

`PartnerGallerySection`, `PartnerFeatureBannerSection` e `PartnerFaqSection` não receberam conteúdo artificial porque o seed atual não fornece galeria, mídia adicional nem perguntas estruturadas. Elas devem ser adicionadas quando existirem dados válidos.

## Shell público

O Header foi alinhado à estrutura do guia, com Explorar, Pontos turísticos, Roteiros, Mapa, Para parceiros e CTA de roteiro. Menu mobile agora bloqueia scroll e fecha por Escape. O Footer usa o mesmo sistema visual.

## Página Para parceiros

Foi adicionada uma landing funcional curta para que o item do Header não aponte para uma rota inexistente. Ela apresenta a jornada de descoberta até Passaporte e encaminha para uma página pública de parceiro demonstrativa.

## Compatibilidade funcional preservada

Não foram removidos os fluxos existentes de Explorar, onboarding, roteiro, calendário, Passaporte ou Admin. `localStorage` continua sendo a persistência da demo publicada no Pages.

## Validação executada

- `node --check app.js`: PASS;
- smoke de renderização JavaScript com DOM controlado: 8 rotas PASS;
- 11 nomes de ícones usados pela camada nova conferidos contra `assets/icons`: 0 ausentes;
- workflow Pages atualizado para incluir `visual-v2.css`;
- referências 01–20 não são importadas na superfície pública;
- browser smoke autocontido em Chromium, sem rede: Home e Parceiro PASS em 1440×1100 e 390×844;
- interações testadas: seleção de ponto, troca de tipo de roteiro, accordion, avanço do índice de parceiros e ação de adicionar ao roteiro;
- overflow horizontal: 0 nos quatro cenários.

Capturas geradas em `artifacts/visual-v2/`: `home-desktop.jpg`, `home-mobile.jpg`, `partner-desktop.jpg` e `partner-mobile.jpg`. A política do ambiente bloqueia navegação do Chromium para localhost, então o teste usa um documento autocontido com os mesmos HTML, CSS, dados e JavaScript da superfície Pages. Isso valida a camada visual e suas interações sem promover os gates E2E/PostGIS do Bloco 08.
