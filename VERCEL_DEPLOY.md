# Publicar a apresentação na Vercel

1. Extraia o ZIP e envie o conteúdo da pasta `passaporte-serra-negra` para um repositório GitHub. `package.json` deve ficar na raiz do repositório. Não envie apenas o ZIP.
2. Na Vercel, escolha **Add New → Project**, importe esse repositório e selecione **Next.js**.
3. Mantenha **Root Directory** na raiz (`./`), Node.js **24.x** e **Output Directory** no padrão do framework. O arquivo `vercel.json` configura `npm ci` e `npm run build`.
4. Adicione `APP_MODE=visual` nas variáveis do projeto para Production e Preview. Esta apresentação não precisa de banco, migrations ou segredos de autenticação.
5. Não copie `.env.example` inteiro para a Vercel. Deixe `NEXT_PUBLIC_SITE_URL` sem definir para usar o domínio fornecido pela plataforma; com domínio próprio, informe sua URL HTTPS.
6. Clique em **Deploy**. Abra a URL gerada e confira as rotas de `docs/APRESENTACAO.md`, incluindo acesso direto e atualização da página.

## Desenvolvimento local

Com Node.js 24 e npm instalados:

```sh
npm ci
npm run dev
```

Abra `http://localhost:4173`. O modo visual é o padrão. Para validar a compilação: `npm run build`.

## Evolução para operação real

Antes de usar dados reais, planeje banco PostgreSQL, autenticação e autorização no servidor e a integração dos painéis demonstrativos. Definir `APP_MODE=database` não transforma os logins simulados em autenticação real. Consulte a documentação técnica preservada em `docs/historico/`.

## Referências

- [Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Configuração de projetos](https://vercel.com/docs/project-configuration)

O pacote foi preparado para importação. A publicação remota ainda não foi executada.
