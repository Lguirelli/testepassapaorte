import {defineConfig} from 'drizzle-kit';
const url=process.env.DATABASE_URL||(process.env.NODE_ENV!=='production'?'postgres://validation:validation@localhost:5432/passaporte':'');
if(!url)throw new Error('DATABASE_URL é obrigatório para usar drizzle-kit em produção.');
export default defineConfig({schema:'./src/core/db/schema.ts',out:'./drizzle',dialect:'postgresql',dbCredentials:{url}});
