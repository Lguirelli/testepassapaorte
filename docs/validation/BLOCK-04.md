# Bloco 04: onboarding e roteiro demo

Oito etapas funcionais de perfil, geração determinística explícita e persistência pessoal mock. Edição inclui adicionar, mover, trocar, fixar/desfixar, remover e restaurar. Versões concorrentes são rejeitadas; intervalos e conflitos são apresentados sem reorganização silenciosa. Todos os caminhos usam o agregado da viagem.

Executado: oito etapas com datas demo, casal, natureza/gastronomia, ritmo equilibrado e carro; gerar; mover café de 11:00 a 11:30; confirmar horário anterior do Mirante (09:00) preservado e estado Movido. Captura disponível.

Dez testes unitários passaram, incluindo preservação de itens, determinismo, proteção de fixed, recusa de alteração de datas que perderia escolhas manuais e restauração de removidos. Novos limites impedem duração ultrapassando o dia. Necessidades não cobertas pelo dataset são registradas, sem garantia de atendimento.

Gate G5 parcial: suíte Playwright nos três viewports ainda não executada no ambiente local.
