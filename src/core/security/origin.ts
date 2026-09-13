export function siteOrigin(){
  const configured=process.env.NEXT_PUBLIC_SITE_URL;if(process.env.NODE_ENV==='production'&&!configured)throw new Error('NEXT_PUBLIC_SITE_URL é obrigatória em produção.');
  const raw=configured||'https://passaporteserranegra.local';
  let url:URL;try{url=new URL(raw);}catch{throw new Error('NEXT_PUBLIC_SITE_URL inválida.');}
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('NEXT_PUBLIC_SITE_URL deve conter somente a origem pública.');
  const local=['localhost','127.0.0.1','::1'].includes(url.hostname);
  if(process.env.NODE_ENV==='production'&&url.protocol!=='https:')throw new Error('NEXT_PUBLIC_SITE_URL deve usar HTTPS em produção.');
  if(url.protocol!=='https:'&&!(process.env.NODE_ENV!=='production'&&local&&url.protocol==='http:'))throw new Error('Origem pública inválida.');
  return url.origin;
}
