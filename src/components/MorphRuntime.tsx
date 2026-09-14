'use client';

import {useEffect} from 'react';
import {morphNames} from '@/core/ui/morph';

type MorphHost=HTMLElement&{dataset:DOMStringMap&{morphCard?:string;morphId?:string}};

function namesFor(kind:string,id:string){
  if(kind==='route')return {media:morphNames.routeMedia(id),title:morphNames.routeTitle(id),meta:morphNames.routeMeta(id)};
  return {media:morphNames.placeMedia(id),title:morphNames.placeTitle(id),meta:morphNames.placeMeta(id)};
}

function clearHost(host:MorphHost){
  host.querySelectorAll<HTMLElement>('[data-morph-media],[data-morph-title],[data-morph-meta]').forEach(node=>{node.style.viewTransitionName='';});
}

function activate(host:MorphHost){
  const kind=host.dataset.morphCard||'place';
  const id=host.dataset.morphId;
  if(!id)return;
  const names=namesFor(kind,id);
  const media=host.querySelector<HTMLElement>('[data-morph-media]');
  const title=host.querySelector<HTMLElement>('[data-morph-title]');
  const meta=host.querySelector<HTMLElement>('[data-morph-meta]');
  if(media)media.style.viewTransitionName=names.media;
  if(title)title.style.viewTransitionName=names.title;
  if(meta)meta.style.viewTransitionName=names.meta;
  window.setTimeout(()=>clearHost(host),1400);
}

export function MorphRuntime(){
  useEffect(()=>{
    const prepare=(event:Event)=>{
      const target=event.target instanceof Element?event.target:null;
      const link=target?.closest<HTMLAnchorElement>('a[data-morph-link],a.card-morph-link,a.route-morph-link');
      if(!link)return;
      if(link.target==='_blank'||link.hasAttribute('download'))return;
      const host=link.closest<MorphHost>('[data-morph-card][data-morph-id]');
      if(host)activate(host);
    };
    document.addEventListener('pointerdown',prepare,true);
    document.addEventListener('click',prepare,true);
    return()=>{document.removeEventListener('pointerdown',prepare,true);document.removeEventListener('click',prepare,true);};
  },[]);
  return null;
}
