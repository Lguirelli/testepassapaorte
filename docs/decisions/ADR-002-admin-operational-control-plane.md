# ADR-002: operação editorial centralizada

Metadados de campos compartilhados definem formulários das seis entidades. O servidor aceita somente campos listados e valida valores, URLs demo, datas e referências. Permissões são verificadas no servidor por cookie assinado, e não por role enviada pelo cliente.

Salvar atualiza apenas `draft`; o público lê `published` enquanto o registro não estiver arquivado. Publicar copia o último rascunho salvo em transação e registra auditoria com antes/depois. Alteração concorrente exige recarregamento. Restaurar copia snapshot para novo rascunho e preserva auditoria.

Mock login é explicitamente demonstrativo e permite assumir o papel de administrador no ambiente de teste; não é autenticação pronta para produção. Cookie é HTTP-only, SameSite strict, assinado, expira em quatro horas e usa Secure em produção. Sem segredo configurado, reinício invalida sessões. Clerk permanece futura implementação do contrato de autenticação.
