import {createHmac} from 'node:crypto';
import type {Role} from './permissions';

function sessionSecretForIdentity(){
  const value=process.env.SESSION_SECRET||'';
  if(value.length<32)throw new Error('SESSION_SECRET deve possuir ao menos 32 caracteres.');
  return value;
}

export function identityPepper(){
  const configured=process.env.IDENTITY_PEPPER||'';
  const fallback=process.env.NODE_ENV!=='production'?sessionSecretForIdentity():'';
  const value=configured||fallback;
  if(value.length<32)throw new Error('IDENTITY_PEPPER deve possuir ao menos 32 caracteres.');
  if(process.env.NODE_ENV==='production'&&/replace-with|change-me/i.test(value))throw new Error('IDENTITY_PEPPER de demonstração não é permitido em produção.');
  if(process.env.NODE_ENV==='production'&&value===sessionSecretForIdentity())throw new Error('IDENTITY_PEPPER deve ser diferente de SESSION_SECRET em produção.');
  return value;
}

export function authSubjectForEmail(email:string){return createHmac('sha256',identityPepper()).update(email).digest('hex');}

export function preferredActorId(role:Role,authSubject:string){
  const token=authSubject.slice(0,16);
  if(role==='tourist')return `traveler-${token}`;
  if(role==='partner')return `partner-user-${token}`;
  return `admin-${token}`;
}
