# Resultado da validação

Execução em 9 de setembro de 2026.

- 14 testes automatizados aprovados, incluindo determinismo, SVG idêntico, prioridade semântica, datas, segurança do fragmento SVG, contraste, snapshots e SSR.
- 1000 seeds cobriram 17 formas, 7 composições e 7 cores. O ícone do mesmo nicho permaneceu estável.
- 68 carimbos renderizados na página de inspeção. Todos com um ícone. Nenhum texto reto saiu do contorno externo após os ajustes de margem. Os nomes incluíram acentos, apóstrofos, símbolos, números e textos extensos.
- Sete viewports em iframes Chrome: 320, 375, 390, 430, 1280, 1440 e 1920 px. Nenhum overflow horizontal após ajustar a navegação de 320 px.
- Coleção com 50 carimbos aberta na interface e contada no DOM.
- Busca por cachoeira retornou o símbolo correspondente.
- Botões SVG e PNG concluíram a exportação; PNG configurado em 2048 × 2048 px e fundo transparente.
- Recarregamento da sessão preservou forma, composição e cor após a restauração local.
- TypeScript sem erros. Lint sem erros ou avisos do código autoral. Build Vinext aprovado.

## Limites da verificação

O desempenho em PERFORMANCE.json mede a geração de strings no Node, não fluidez ou uso de memória em um telefone real. A verificação responsiva usa iframes, sem emular dispositivos. Safari, Firefox e leitores de tela não foram exercitados.

A comparação SSR automatizada apresentou IDs únicos e markup estável. O navegador instrumentado registrou um aviso de hidratação ligado exclusivamente a atributos de cursor adicionados pela extensão de automação no elemento html. O diff não apontou dados ou atributos dos carimbos. Nenhuma supressão genérica de avisos de hidratação foi aplicada.

A detecção geométrica cobre o contorno externo e textos retos. Os arcos, o desgaste e a distância das bordas internas foram avaliados visualmente; novas formas devem passar por revisão equivalente.
