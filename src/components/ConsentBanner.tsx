'use client';
import {useState,useSyncExternalStore} from 'react';
import Link from 'next/link';

const subscribe=()=>()=>{};
function hasConsentChoice(){return document.cookie.split('; ').some(cookie=>cookie.startsWith('psn_analytics='));}

export function ConsentBanner(){
 const decided=useSyncExternalStore(subscribe,hasConsentChoice,()=>true);
 const[dismissed,setDismissed]=useState(false);
 const[error,setError]=useState('');
 const[saving,setSaving]=useState(false);
 if(decided||dismissed)return null;
 async function save(status:'granted'|'denied'){
  setSaving(true);setError('');
  try{
   const response=await fetch('/api/consent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
   if(!response.ok)throw new Error();
   setDismissed(true);
  }catch{setError('Não foi possível salvar sua preferência. Tente novamente.');}
  finally{setSaving(false);}
 }
 return <aside className="consent-banner" role="dialog" aria-label="Preferências de privacidade"><div><strong>Privacidade primeiro</strong><p>Cookies essenciais mantêm a sessão. Analytics opcional só é ativado com sua escolha e não usa rastreamento GPS contínuo. <Link href="/cookies">Ver detalhes</Link>.</p>{error&&<p role="alert">{error}</p>}</div><div className="actions"><button disabled={saving} onClick={()=>save('denied')}>Somente essenciais</button><button disabled={saving} className="primary" onClick={()=>save('granted')}>{saving?'Salvando…':'Permitir analytics'}</button></div></aside>;
}
