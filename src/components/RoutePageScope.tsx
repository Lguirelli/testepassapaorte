'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {pageKindForPath} from '@/core/routing/page-kind';

export function RoutePageScope(){
  const pathname=usePathname();
  useEffect(()=>{
    document.body.dataset.page=pageKindForPath(pathname);
    document.body.dataset.path=pathname;
  },[pathname]);
  return null;
}
