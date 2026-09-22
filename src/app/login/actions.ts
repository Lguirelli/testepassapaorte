'use server';
import {redirect} from 'next/navigation';
import {authenticateCredentials,createSession,endSession} from '@/core/auth/session';
import {sanitizeRelativePath,sanitizeText} from '@/core/security/sanitize';

export async function loginAction(_state:{message:string},form:FormData){
  const email=sanitizeText(form.get('email'),254,{multiline:false});
  const password=String(form.get('password')||'').slice(0,256);
  const next=sanitizeRelativePath(form.get('next'),'/');
  const actor=await authenticateCredentials(email,password);
  if(!actor)return{message:'Credenciais inválidas.'};
  await createSession(actor);
  redirect(next==='/'?(actor.role==='admin'?'/admin':actor.role==='partner'?'/painel-parceiro':'/roteiro'):next);
}
export async function logoutAction(){await endSession();redirect('/');}
