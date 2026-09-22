'use client';
import {useEffect,useRef} from 'react';
import {useRouter} from 'next/navigation';
import {mountDashboard} from './dashboard-runtime';
export function Dashboard({view}:{view:string}){
 const ref=useRef<HTMLDivElement>(null);const router=useRouter();
 useEffect(()=>{if(ref.current)return mountDashboard(ref.current,view,path=>router.push(path));},[view,router]);
 return <div className="psn-dashboard" ref={ref}><p>Preparando a demonstração…</p></div>;
}
