# Publicação estática na Vercel

A Vercel deve tratar este repositório como **Other / site estático**. O `vercel.json` define `framework: null` e publica diretamente a pasta `github-pages/`.

Não há variáveis de ambiente obrigatórias, banco, migrations, segredos ou serviços externos.

Ao conectar o repositório, mantenha a raiz do projeto em `./`. O deploy deve servir os arquivos estáticos sem runtime de servidor.

Para validar antes de publicar:

```sh
npm ci
npm run validate
```
