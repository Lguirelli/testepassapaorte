'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import type {ContentData} from '@/core/db/schema';
import {createGuestDraft,writeGuestDraft} from '@/modules/trips/guest-trip';
import {profileForReadyRoute,type ReadyRoutePreset} from '@/modules/trips/ready-routes';

export function ReadyRouteStart({route,places,defaultStart}:{route:ReadyRoutePreset;places:ContentData[];defaultStart:string}){
  const [startsOn,setStartsOn]=useState(defaultStart);
  const [error,setError]=useState('');
  const router=useRouter();

  function start(){
    setError('');
    try{
      const profile=profileForReadyRoute(route,startsOn);
      const draft=createGuestDraft(profile,places);
      writeGuestDraft(draft);
      router.push('/experiencia/roteiro');
    }catch(err){
      setError(err instanceof Error?err.message:'Não foi possível preparar este roteiro.');
    }
  }

  return <div className="stack">
    <label className="field">
      Quando você quer começar?
      <input type="date" value={startsOn} onChange={event=>setStartsOn(event.target.value)} aria-label="Data de início do roteiro"/>
    </label>
    <p className="muted">Vamos usar a curadoria deste roteiro como ponto de partida. Depois você pode trocar, mover, remover ou adicionar paradas livremente.</p>
    {error&&<p role="alert">{error}</p>}
    <button className="primary" type="button" onClick={start}>Usar este roteiro</button>
  </div>;
}
