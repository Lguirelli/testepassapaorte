# Composições

| ID | Composição |
|---|---|
| radial | Nome em arco, ícone central, data e visita abaixo |
| center | Nome superior, ícone central e bloco de dados inferior |
| iconTop | Ícone no alto, nome intermediário e dados inferiores |
| split | Nome superior, ícone à esquerda e dados à direita |
| ruled | Nome superior e linha divisória antes do ícone |
| banner | Ícone superior e nome entre divisórias horizontais |
| seal | Nome em arco com ícone central ampliado |

Todas as composições contêm somente uma área de ícone. O renderer aplica o contentTransform da forma ao conteúdo inteiro. Isso preserva um único layout reutilizável em formas diferentes.

Nomes acima de 28 caracteres são divididos em até duas linhas nos layouts retos. A fonte diminui de acordo com a largura estimada; textLength controla a extensão vetorial final. Não são usadas medidas dependentes de Canvas ou DOM durante SSR. O texto não é cortado por reticências.

Nos layouts em arco, textPath limita a extensão do nome. Nomes excepcionalmente longos exigem tamanho maior para leitura confortável; 64 px destina-se ao modo compacto. O teste visual inclui acentos, apóstrofos, números, símbolos e nomes longos.

Para acrescentar um layout, registre seu ID/rótulo e implemente sua composição em renderer.ts, preservando a área de ícone única. Depois inclua o ID apenas nas formas compatíveis e amplie a matriz de testes.
