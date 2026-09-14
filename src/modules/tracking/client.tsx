'use client';
import {useEffect} from 'react';import {usePathname} from 'next/navigation';
import {privacySafePath,sanitizeTrackingPayload} from '@/core/security/sanitize';
function analyticsAllowed(){return typeof document!=='undefined'&&document.cookie.split('; ').some(value=>value==='psn_analytics=granted');}
export function track(event:string,payload:Record<string,string|number|boolean>={}){if(!analyticsAllowed())return;void fetch('/api/tracking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,payload:sanitizeTrackingPayload(payload)})}).catch(()=>{});}
export function PageTracking(){const path=usePathname();useEffect(()=>{track('PAGE_VIEWED',{path:privacySafePath(path)});},[path]);return null;}
