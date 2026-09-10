# ADR-001: monólito modular de validação

Next.js App Router com React e TypeScript strict. Conteúdo, Admin, viagens, Passaporte e tracking possuem limites de módulo. Repositórios concentram acesso por Drizzle; componentes não importam JSON de conteúdo para renderizar registros públicos.

O schema v0 usa documentos JSONB tipados para as seis entidades editoriais, com ID, tipo, slug único, versão, status, rascunho e publicação. É uma decisão reversível de validação, não o Data Model definitivo. Relações são validadas na camada de aplicação. Chaves estrangeiras relacionais e migração para tabelas por domínio deverão ser decididas antes de dados reais.

Viagem, dias, itens, visitas e clima demo compartilham um agregado JSONB versionado por usuário mock. A escrita usa comparação de versão; não sobrescreve silenciosamente uma edição concorrente.
