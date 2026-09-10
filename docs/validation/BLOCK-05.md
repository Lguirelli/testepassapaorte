# Bloco 05: calendário

Dia, Semana e Mês reutilizam o mesmo agregado do roteiro. Agenda mostra estado da parada e evidência separadamente. Mobile usa agenda linear e semana empilhada; mês mantém células legíveis e abre o dia detalhado.

Executado no navegador: agenda diária com café movido para 11:30, visão semanal com Bistrô fixado e sem evidência, visão mensal de setembro de 2026. Screenshot mensal e verificação de ausência de overflow em 1363×936. Onze testes unitários passaram, incluindo vínculo de evidência a lugar e data.

Durante desenvolvimento, uma rota criada depois de ter sido pré-carregada como inexistente exigiu recarga da página para descartar o estado anterior do cliente. Após acesso atualizado, os controles Dia/Semana/Mês funcionaram. A navegação deve ser repetida na suíte standalone final.

Gate G6 parcial: três viewports e Playwright standalone ainda não executados.
