export function siteOrigin(){
  const explicit=process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost=(process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.VERCEL_URL)?.trim();
  const raw=explicit||(vercelHost?`https://${vercelHost}`:'https://passaporteserranegra.local');
  if(process.env.NODE_ENV==='production'&&!explicit&&!vercelHost)throw new Error('Defina NEXT_PUBLIC_SITE_URL fora da Vercel.');
  let url:URL;try{url=new URL(raw);}catch{throw new Error('Origem pública inválida.');}
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('A origem pública deve conter somente protocolo e host.');
  const local=['localhost','127.0.0.1','::1'].includes(url.hostname);
  if(process.env.NODE_ENV==='production'&&url.protocol!=='https:')throw new Error('A origem pública deve usar HTTPS em produção.');
  if(url.protocol!=='https:'&&!(process.env.NODE_ENV!=='production'&&local&&url.protocol==='http:'))throw new Error('Origem pública inválida.');
  return url.origin;
}
