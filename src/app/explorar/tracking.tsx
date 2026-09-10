'use client';
import {useEffect} from 'react';import {track} from '@/modules/tracking/client';import type {Filters} from '@/modules/content/repository';
export function SearchTracking({filters}:{filters:Filters}){const key=JSON.stringify(filters);useEffect(()=>{const f=JSON.parse(key) as Filters;if(f.q)track('SEARCH_PERFORMED',{query:f.q});if(Object.entries(f).some(([k,v])=>k!=='q'&&v))track('FILTER_APPLIED',f);},[key]);return null;}
