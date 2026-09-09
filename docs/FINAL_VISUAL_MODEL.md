# Modelo Visual de Destino V1

A pasta `showcase/` é o protótipo visual navegável do Passaporte Serra Negra.

Ela existe separada da build técnica de validação por um motivo: o repositório original foi criado para validar arquitetura, estados e fluxos sem fechar identidade. Depois das decisões visuais de 2026-09-09, passou a existir uma direção de produto suficiente para uma camada de apresentação.

## Direção aplicada

- Paleta principal neutra: creme/off-white, bege, taupe, grafite, carvão e preto profundo.
- Modo dark como variação dos mesmos tokens semânticos.
- Cores de acentuação por nicho derivadas do sistema de carimbos: terracota, oliva, petróleo, mostarda, vinho, azul e marrom quente.
- Arimo para títulos e interface.
- Cormorant Garamond para subtítulos e momentos editoriais.
- Ícones reutilizados do Icon System v2.
- Linguagem visual inspirada em papel, ticket, passaporte, carimbo e percurso, evitando gamificação por XP, ranking ou barra de conclusão.

## Superfícies incluídas

- `showcase/index.html`: Home e visão geral da experiência.
- `showcase/explorar.html`: busca, filtros, cards e mapa.
- `showcase/lugar.html`: template de ponto turístico.
- `showcase/roteiro.html`: roteiro personalizado e edição local.
- `showcase/passaporte.html`: capa, miolo, ticket e carimbos.
- `showcase/admin.html`: direção visual do painel operacional.

## O que este modelo representa

É uma hipótese visual de destino para orientar a implementação final. Os lugares e métricas continuam demonstrativos. A ilustração substitui fotografia real nesta fase para não confundir referência de interface com fonte turística validada.

## GitHub Pages

O workflow `.github/workflows/showcase-pages.yml` valida todas as referências locais, captura screenshots desktop/tablet/mobile e publica **somente `showcase/`** no GitHub Pages.

Se a URL do Pages estiver exibindo o README, em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. Depois execute o workflow `showcase-pages` ou faça push na `main` com alterações na pasta `showcase/`.
