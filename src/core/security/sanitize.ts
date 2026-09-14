const CONTROL_CHARS=/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const BIDI_CONTROLS=/[\u202A-\u202E\u2066-\u2069]/g;
const ZERO_WIDTH=/[\u200B\uFEFF]/g;
const SAFE_ID=/^[A-Za-z0-9](?:[A-Za-z0-9._:-]{0,127})$/;
const SAFE_SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REDACTED='[redacted]';
const DANGEROUS_KEYS=new Set(['__proto__','prototype','constructor']);
const SENSITIVE_KEY=/(?:password|passwd|secret|token|cookie|authorization|session|email|phone|whatsapp|authsubject|anonymousvisitor|traveleruser|requester|reviewedby|storagekey|recovery|credential|privatekey|apikey|api_key)/i;
const TECHNICAL_ERROR=/(?:failed query|duplicate key|constraint|postgres|pglite|drizzle|node_modules|stack trace|\bsql\b|select\s+.+\s+from|insert\s+into|update\s+.+\s+set|delete\s+from|database_url|session_secret|econn|enotfound|eai_again|\/mnt\/|sandbox:|file:\/\/| at [A-Za-z_$][\w$]*\s*\()/i;
const PRIVATE_HOST=/^(?:localhost|.+\.localhost|.+\.local|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.)/i;

function limitCodePoints(value:string,max:number){return Array.from(value).slice(0,max).join('');}
function cleanUnicode(value:string){return value.normalize('NFC').replace(/\r\n?/g,'\n').replace(CONTROL_CHARS,'').replace(BIDI_CONTROLS,'').replace(ZERO_WIDTH,'');}
function isPrivateHost(hostname:string){
  const host=hostname.toLowerCase().replace(/^\[|\]$/g,'');
  if(PRIVATE_HOST.test(host))return true;
  if(host==='::1'||host.startsWith('fc')||host.startsWith('fd')||host.startsWith('fe80:'))return true;
  if(host.startsWith('::ffff:')){const mapped=host.slice(7);if(PRIVATE_HOST.test(mapped))return true;}
  return false;
}
function looksSensitiveString(value:string){
  if(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(value))return true;
  if(/(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s]+/i.test(value))return true;
  if(/\b(?:bearer\s+)?(?:sk-[A-Za-z0-9_-]{12,}|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{8,})\b/i.test(value))return true;
  if(/(?:^|\s)\+?\d[\d\s().-]{7,}\d(?:\s|$)/.test(value))return true;
  if(/(?:\/mnt\/data\/|sandbox:\/|file:\/\/)/i.test(value))return true;
  return false;
}

export function sanitizeText(value:unknown,max=5000,{multiline=true}:{multiline?:boolean}={}){
  let text=cleanUnicode(String(value??''));
  text=multiline?text.replace(/[\t ]+\n/g,'\n').replace(/\n{4,}/g,'\n\n\n'):text.replace(/\s+/g,' ');
  return limitCodePoints(text.trim(),max);
}

export function sanitizeOptionalText(value:unknown,max=5000,options?:{multiline?:boolean}){
  const text=sanitizeText(value,max,options);return text||undefined;
}

export function sanitizeId(value:unknown,label='Identificador'){
  const text=sanitizeText(value,128,{multiline:false});
  if(!SAFE_ID.test(text))throw new Error(`${label} inválido.`);
  return text;
}

export function sanitizeOptionalId(value:unknown,label='Identificador'){
  const text=sanitizeText(value,128,{multiline:false});return text?sanitizeId(text,label):undefined;
}

export function trySanitizeId(value:unknown,label='Identificador'){try{return sanitizeId(value,label);}catch{return null;}}
export function trySanitizeSlug(value:unknown){try{return sanitizeSlug(value);}catch{return null;}}

export function sanitizeSlug(value:unknown){
  const text=sanitizeText(value,120,{multiline:false}).toLowerCase();
  if(!SAFE_SLUG.test(text))throw new Error('Slug inválido. Use letras minúsculas, números e hífens.');
  return text;
}

export function sanitizeEmail(value:unknown){
  const text=sanitizeText(value,254,{multiline:false}).toLowerCase();
  if(!EMAIL.test(text))throw new Error('E-mail inválido.');
  return text;
}

export function sanitizePassword(value:unknown){
  const text=String(value??'');
  if(text.length<1||text.length>256||/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/.test(text))throw new Error('Senha inválida.');
  return text;
}

export function sanitizeRelativePath(value:unknown,fallback='/'){
  const raw=sanitizeText(value,2048,{multiline:false});
  if(!raw.startsWith('/')||raw.startsWith('//')||raw.includes('\\'))return fallback;
  try{const parsed=new URL(raw,'https://passaporte.invalid');return parsed.origin==='https://passaporte.invalid'?`${parsed.pathname}${parsed.search}${parsed.hash}`:fallback;}catch{return fallback;}
}

export function sanitizeHttpsUrl(value:unknown,{allowEmpty=true,allowPrivate=false}:{allowEmpty?:boolean;allowPrivate?:boolean}={}){
  const raw=sanitizeText(value,2048,{multiline:false});
  if(!raw){if(allowEmpty)return null;throw new Error('URL obrigatória.');}
  let url:URL;try{url=new URL(raw);}catch{throw new Error('URL inválida.');}
  if(url.protocol!=='https:'||!url.hostname||url.username||url.password)throw new Error('URL externa deve usar HTTPS e não pode conter credenciais.');
  if(!allowPrivate&&isPrivateHost(url.hostname))throw new Error('URL externa não pode apontar para endereço local ou privado.');
  url.hash='';
  return url.toString();
}

export function trySanitizeHttpsUrl(value:unknown){try{return sanitizeHttpsUrl(value);}catch{return null;}}

export function sanitizeAssetReference(value:unknown){
  const raw=sanitizeText(value,2048,{multiline:false});if(!raw)return null;
  const relative=!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(raw)&&!raw.startsWith('//');
  if(relative){
    if(raw.includes('..')||raw.includes('\\')||raw.startsWith('.'))throw new Error('Caminho de asset inválido.');
    const normalized=raw.replace(/^\/+/, '');
    if(!normalized||/[\u0000-\u001F]/.test(normalized))throw new Error('Caminho de asset inválido.');
    return normalized;
  }
  return sanitizeHttpsUrl(raw,{allowEmpty:false});
}

export function safeAssetSrc(value:unknown,fallback='/placeholders/card.svg'){
  try{const ref=sanitizeAssetReference(value);if(!ref)return fallback;return ref.startsWith('https://')?ref:`/${ref.replace(/^\/+/, '')}`;}catch{return fallback;}
}

export function safeObjectPosition(value:unknown){
  const raw=sanitizeText(value,100,{multiline:false}).toLowerCase();if(!raw)return 'center';
  const keywords=new Set(['center','top','bottom','left','right','left top','left center','left bottom','right top','right center','right bottom','center top','center bottom']);
  if(keywords.has(raw))return raw;
  const match=raw.match(/^(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%$/);if(match&&Number(match[1])<=100&&Number(match[2])<=100)return raw;
  return 'center';
}

export function sanitizePhone(value:unknown){
  const raw=sanitizeText(value,64,{multiline:false});if(!raw)return null;
  const digits=raw.replace(/\D/g,'');if(digits.length<8||digits.length>15)throw new Error('Telefone inválido.');
  return raw.trim().startsWith('+')?`+${digits}`:digits;
}

export function sanitizeWhatsApp(value:unknown){
  const raw=sanitizeText(value,2048,{multiline:false});if(!raw)return null;
  if(/^https:\/\//i.test(raw)){
    const parsed=new URL(sanitizeHttpsUrl(raw,{allowEmpty:false})!);const host=parsed.hostname.toLowerCase().replace(/^www\./,'');
    if(!['wa.me','whatsapp.com','api.whatsapp.com'].includes(host))throw new Error('Link de WhatsApp inválido.');
    return parsed.toString();
  }
  const digits=raw.replace(/\D/g,'');if(digits.length<8||digits.length>15)throw new Error('WhatsApp inválido.');return digits;
}

export function sanitizeInstagram(value:unknown){
  const raw=sanitizeText(value,2048,{multiline:false});if(!raw)return null;
  if(/^https:\/\//i.test(raw)){
    const parsed=new URL(sanitizeHttpsUrl(raw,{allowEmpty:false})!);const host=parsed.hostname.toLowerCase().replace(/^www\./,'');
    if(host!=='instagram.com')throw new Error('Link do Instagram inválido.');return parsed.toString();
  }
  const handle=raw.replace(/^@/,'');if(!/^[A-Za-z0-9._]{1,30}$/.test(handle))throw new Error('Usuário do Instagram inválido.');return `@${handle}`;
}

export function safeContactHref(kind:string,value:string){
  try{
    if(kind==='phone'){const phone=sanitizePhone(value);return phone?`tel:${phone}`:null;}
    if(kind==='whatsapp'){const whatsapp=sanitizeWhatsApp(value);if(!whatsapp)return null;return whatsapp.startsWith('https://')?whatsapp:`https://wa.me/${whatsapp}`;}
    if(kind==='instagram'){const instagram=sanitizeInstagram(value);if(!instagram)return null;return instagram.startsWith('https://')?instagram:`https://instagram.com/${instagram.slice(1)}`;}
    if(kind==='website'||kind==='booking'){return sanitizeHttpsUrl(value);}
  }catch{return null;}
  return null;
}

export function sanitizeSearchQuery(value:unknown){return sanitizeText(value,120,{multiline:false});}

export function sanitizeNarrative(value:unknown,max=5000){
  const text=sanitizeText(value,max);
  if(looksSensitiveString(text))throw new Error('Remova e-mails, telefones, credenciais ou outros dados sensíveis deste campo.');
  return text;
}


export type SanitizedStructuredValue=null|string|number|boolean|SanitizedStructuredValue[]|{[key:string]:SanitizedStructuredValue};
export function sanitizeStructuredValue(value:unknown,depth=0):SanitizedStructuredValue{
  if(depth>6)return '[truncated]';
  if(value===null||value===undefined)return null;
  if(typeof value==='string')return sanitizeText(value,5000);
  if(typeof value==='boolean')return value;
  if(typeof value==='number')return Number.isFinite(value)?Math.max(-1_000_000_000,Math.min(1_000_000_000,value)):0;
  if(Array.isArray(value))return value.slice(0,100).map(item=>sanitizeStructuredValue(item,depth+1));
  if(typeof value==='object'){
    const out:Record<string,SanitizedStructuredValue>={};
    for(const [rawKey,item] of Object.entries(value as Record<string,unknown>).slice(0,100)){
      const key=sanitizeText(rawKey,128,{multiline:false});
      if(!key||DANGEROUS_KEYS.has(key))continue;
      out[key]=sanitizeStructuredValue(item,depth+1);
    }
    return out;
  }
  return sanitizeText(String(value),5000);
}

export function redactForAudit(value:unknown,depth=0):unknown{
  if(depth>6)return '[truncated]';
  if(Array.isArray(value))return value.slice(0,100).map(item=>redactForAudit(item,depth+1));
  if(value&&typeof value==='object'){
    const out:Record<string,unknown>={};
    for(const [rawKey,item] of Object.entries(value as Record<string,unknown>).slice(0,100)){
      const key=sanitizeText(rawKey,128,{multiline:false});
      if(!key||DANGEROUS_KEYS.has(key))continue;
      out[key]=SENSITIVE_KEY.test(key)?REDACTED:redactForAudit(item,depth+1);
    }
    return out;
  }
  if(typeof value==='string'){
    const text=sanitizeText(value,2000);
    return looksSensitiveString(text)?REDACTED:text;
  }
  if(typeof value==='number')return Number.isFinite(value)?value:null;
  if(typeof value==='boolean'||value===null)return value;
  return sanitizeText(String(value??''),2000);
}

export function sanitizePublicError(error:unknown,fallback='Não foi possível concluir a operação.'){
  const raw=error instanceof Error?error.message:String(error??'');
  const text=sanitizeText(raw,300,{multiline:false});
  if(!text||TECHNICAL_ERROR.test(text)||looksSensitiveString(text))return fallback;
  return text;
}

const TRACKING_KEYS=new Set(['path','category','environment','cost','relation','accessible','placeId','partnerId','format','privacy','source','evidence','deduplicated','regenerated','queryLength','hasQuery']);
export function sanitizeTrackingPayload(payload:unknown){
  if(!payload||typeof payload!=='object'||Array.isArray(payload))return{};
  const out:Record<string,string|number|boolean>={};
  for(const [key,value] of Object.entries(payload as Record<string,unknown>)){
    if(!TRACKING_KEYS.has(key))continue;
    if(typeof value==='boolean'){out[key]=value;continue;}
    if(typeof value==='number'&&Number.isFinite(value)){
      const bounded=Math.max(-1_000_000,Math.min(1_000_000,value));
      out[key]=key==='queryLength'?Math.max(0,Math.min(120,Math.trunc(bounded))):bounded;continue;
    }
    if(typeof value!=='string')continue;
    if(key==='path'){out[key]=privacySafePath(value);continue;}
    if(key==='placeId'||key==='partnerId'||key==='category'){const id=trySanitizeId(value,key);if(id)out[key]=id;continue;}
    out[key]=sanitizeText(value,128,{multiline:false});
  }
  return out;
}

export function privacySafePath(pathname:string){
  const clean=sanitizeText(pathname,500,{multiline:false}).split('?')[0]||'/';
  return clean
    .replace(/^\/q\/[^/]+/,'/q/[code]')
    .replace(/^\/viagens\/[^/]+/,'/viagens/[tripId]')
    .replace(/^\/compartilhar\/[^/]+/,'/compartilhar/[tripId]')
    .replace(/^\/admin\/([^/]+)\/[^/]+/,'/admin/$1/[id]');
}

export function assertSameOrigin(req:Request){
  const fetchSite=req.headers.get('sec-fetch-site');if(fetchSite==='cross-site')throw new Error('Origem não autorizada.');
  const origin=req.headers.get('origin');if(!origin)return;
  let requestOrigin:string;try{requestOrigin=new URL(req.url).origin;}catch{throw new Error('Origem inválida.');}
  if(origin!==requestOrigin)throw new Error('Origem não autorizada.');
}

export function assertJsonRequestSize(req:Request,maxBytes=16_384){
  const type=req.headers.get('content-type')||'';if(!type.toLowerCase().startsWith('application/json'))throw new Error('Content-Type inválido.');
  const length=Number(req.headers.get('content-length')||'0');if(Number.isFinite(length)&&length>maxBytes)throw new Error('Payload muito grande.');
}

export async function readJsonBody(req:Request,maxBytes=16_384){
  assertJsonRequestSize(req,maxBytes);
  const raw=await req.text();
  if(new TextEncoder().encode(raw).byteLength>maxBytes)throw new Error('Payload muito grande.');
  if(!raw.trim())throw new Error('Payload JSON obrigatório.');
  try{return JSON.parse(raw) as unknown;}catch{throw new Error('JSON inválido.');}
}

// Backward-compatible name used by server actions. Keep all public error filtering centralized here.
export const publicErrorMessage=sanitizePublicError;
