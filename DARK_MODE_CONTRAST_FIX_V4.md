# Correção de contraste v4 — Passaporte Serra Negra

## Causa raiz

A versão v3 corrigia os tokens globais, mas a camada visual legada ainda usava tokens de função como cores físicas. Exemplos: `--surface-primary` era usado como sinônimo de branco e `--text-primary` como sinônimo de preto. No dark mode esses tokens mudam semanticamente, fazendo elementos editoriais fixos inverterem de cor sem inverter corretamente seus descendentes.

Também havia diferença entre `data-theme="dark"` e `data-theme="system"`: algumas correções específicas só eram ativadas no primeiro caso.

## Correções aplicadas

- criado `data-resolved-theme="dark|light"`, atualizado imediatamente no `<head>` e em toda mudança de tema;
- modo Sistema agora recebe exatamente as mesmas correções do dark explícito quando o SO está escuro;
- paleta dark reforçada com canvas, surface, raised e inset realmente distintos;
- bordas de controle separadas das bordas decorativas;
- contextos **sempre escuros** passaram a usar foreground fixo claro;
- contextos **papel/claro** passaram a usar foreground fixo escuro;
- hero da Home, pontos, parceiros, FAQ, Passaporte e mapa foram normalizados;
- cards sobre fotografia usam texto claro independente do tema;
- `partner-feature` e `sticky-summary` não clareiam mais no dark mode;
- `partner-quick-info`, Passaporte e bloco de clima não recebem mais texto claro sobre papel claro;
- header das páginas escuras mantém texto claro e logo sobre chip claro estável;
- menu mobile das páginas escuras mantém fundo escuro e ações legíveis;
- tabs, chips e estados ativos usam pares `background/foreground` acoplados;
- cenários SVG/CSS que usavam tokens de texto como preenchimento não invertem mais com o tema;
- textos do mapa foram elevados para contraste AA mesmo sobre o cinza `#606268`;
- ícones dentro de círculos e cartões claros usam tinta escura fixa.

## Validação estática

CSS analisados: styles.css, visual-v2.css, visual.css, partners-page.css, tourism-pages.css, theme.css.

Erros de parsing CSS: **0**.

Todos os pares críticos abaixo cumprem o alvo correspondente:

| Par | Contraste | Alvo | Resultado |
|---|---:|---:|---|
| Texto principal / canvas dark | 16.45:1 | 4.5:1 | OK |
| Texto secundário / canvas dark | 12.58:1 | 4.5:1 | OK |
| Texto muted / surface dark | 7.1:1 | 4.5:1 | OK |
| Borda de controle / surface dark | 4.07:1 | 3:1 | OK |
| Texto de papel | 15.45:1 | 4.5:1 | OK |
| Muted de papel | 5.88:1 | 4.5:1 | OK |
| Texto em seção escura | 16.01:1 | 4.5:1 | OK |
| Secundário em seção escura | 12.52:1 | 4.5:1 | OK |
| Texto no mapa cinza | 5.4:1 | 4.5:1 | OK |
| Secundário no mapa cinza | 4.95:1 | 4.5:1 | OK |
| Texto em card escuro médio | 9.51:1 | 4.5:1 | OK |
| Secundário em card escuro médio | 7.02:1 | 4.5:1 | OK |


## Observação de validação visual

O Chromium instalado neste ambiente não conclui inicialização headless, inclusive para um HTML mínimo, portanto a validação automatizada por screenshot não é confiável neste runtime. A correção foi feita pela cascata CSS, especificidade, resolução efetiva do tema e auditoria matemática dos pares de cor. O arquivo `validation/contrast-audit-v4.json` acompanha o pacote.
