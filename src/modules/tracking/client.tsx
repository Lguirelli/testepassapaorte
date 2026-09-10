'use client';
import {useEffect} from 'react';import {usePathname} from 'next/navigation';
export function track(event:string,payload:Record<string,string|number|boolean>={}){void fetch('/api/tracking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,payload})}).catch(()=>{});}
export function PageTracking(){const path=usePathname();useEffect(()=>{track('PAGE_VIEWED',{path});},[path]);return null;}
