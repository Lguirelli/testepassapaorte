'use client';
import {useEffect} from 'react';import {track} from '@/modules/tracking/client';import type {Filters} from '@/modules/content/repository';
export function SearchTracking({filters}:{filters:Filters}){const key=JSON.stringify(filters);useEffect(()=>{const f=JSON.parse(key) as Filters;if(f.q)track('SEARCH_PERFORMED',{hasQuery:true,queryLength:Array.from(f.q).length});const safe={category:f.category,environment:f.environment,cost:f.cost,relation:f.relation,accessible:f.accessible};if(Object.values(safe).some(Boolean))track('FILTER_APPLIED',safe);},[key]);return null;}
