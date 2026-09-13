'use client';
import {useSyncExternalStore} from 'react';
const subscribe=()=>()=>{};
/** Keep server and hydration output identical before reading browser storage. */
export function useClientReady(){return useSyncExternalStore(subscribe,()=>true,()=>false);}
