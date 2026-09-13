'use client';

import {useState,useSyncExternalStore} from 'react';

type Consent='granted'|'denied'|'unset';
const subscribe=()=>()=>{};

function readConsent():Consent{
  const raw=document.cookie.split('; ').find(value=>value.startsWith('psn_analytics='))?.split('=')[1];
  return raw==='granted'||raw==='denied'?raw:'unset';
}

export function PrivacyPreferences(){
  const storedConsent=useSyncExternalStore(subscribe,readConsent,()=> 'unset' as Consent);
  const[override,setOverride]=useState<Consent|null>(null);
  const consent=override??storedConsent;
  const[saving,setSaving]=useState<Consent|null>(null);
  const[message,setMessage]=useState('');
  const[error,setError]=useState('');

  async function save(status:Exclude<Consent,'unset'>){
    setSaving(status);setMessage('');setError('');
    try{
      const response=await fetch('/api/consent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
      if(!response.ok)throw new Error();
      setOverride(status);
      setMessage(status==='granted'?'Analytics opcional ativado.':'Analytics opcional desativado. Identificadores de analytics deste navegador foram removidos.');
    }catch{
      setError('Não foi possível atualizar sua preferência. Tente novamente.');
    }finally{setSaving(null);}
  }

  return <section className="privacy-preferences" aria-labelledby="privacy-preferences-title">
    <h2 id="privacy-preferences-title">Gerenciar preferência</h2>
    <p>Estado atual: <strong>{consent==='granted'?'Analytics permitido':consent==='denied'?'Somente essenciais':'Ainda não definido'}</strong>.</p>
    <p>Você pode mudar esta escolha a qualquer momento. Negar analytics não bloqueia a exploração, o roteiro ou o Passaporte.</p>
    <div className="actions" aria-label="Preferência de analytics">
      <button type="button" disabled={saving!==null||consent==='denied'} aria-pressed={consent==='denied'} onClick={()=>save('denied')}>{saving==='denied'?'Salvando…':'Usar somente essenciais'}</button>
      <button type="button" className="primary" disabled={saving!==null||consent==='granted'} aria-pressed={consent==='granted'} onClick={()=>save('granted')}>{saving==='granted'?'Salvando…':'Permitir analytics'}</button>
    </div>
    <div className="status-message" aria-live="polite">{message}</div>
    {error&&<p role="alert" className="error-text">{error}</p>}
  </section>;
}
