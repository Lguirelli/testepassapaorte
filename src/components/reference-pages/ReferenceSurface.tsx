'use client';
import {useEffect,useRef} from 'react';
import {useRouter} from 'next/navigation';
import {initializeReferencePage} from './interactions';
import type {ReferenceKind} from './ReferencePage';
export function ReferenceSurface({kind,html}:{kind:ReferenceKind;html:string}){
 const root=useRef<HTMLDivElement>(null);
 const router=useRouter();
 useEffect(()=>{if(root.current)return initializeReferencePage(root.current,kind,path=>router.push(path));},[kind,html,router]);
 // HTML is a reviewed, build-time source artifact; never supply user or CMS content.
 return <div ref={root} className={`reference-page reference-${kind}`} dangerouslySetInnerHTML={{__html:html}}/>;
}
