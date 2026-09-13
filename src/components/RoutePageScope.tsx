'use client';

import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {pageKindForPath} from '@/core/routing/page-kind';

function routeLabel(pathname:string){
  if(pathname==='/')return'Início';
  if(pathname.startsWith('/explorar'))return'Explorar Serra Negra';
  if(pathname.startsWith('/pontos-turisticos')||pathname.startsWith('/lugares/'))return'Pontos turísticos';
  if(pathname.startsWith('/mapa'))return'Mapa de Serra Negra';
  if(pathname.startsWith('/roteiro')||pathname.startsWith('/viagens/'))return'Roteiros';
  if(pathname.startsWith('/parceiros'))return'Parceiros';
  if(pathname.startsWith('/meu-passaporte'))return'Meu Passaporte';
  if(pathname.startsWith('/login'))return'Acessar Passaporte';
  return'Nova página';
}

export function RoutePageScope(){
  const pathname=usePathname();
  const firstRender=useRef(true);
  const [announcement,setAnnouncement]=useState('');

  useEffect(()=>{
    document.body.dataset.page=pageKindForPath(pathname);
    document.body.dataset.path=pathname;
    setAnnouncement(`${routeLabel(pathname)} carregado`);

    if(firstRender.current){
      firstRender.current=false;
      return;
    }

    const frame=requestAnimationFrame(()=>{
      document.getElementById('conteudo')?.focus({preventScroll:true});
    });
    return()=>cancelAnimationFrame(frame);
  },[pathname]);

  return <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>;
}
