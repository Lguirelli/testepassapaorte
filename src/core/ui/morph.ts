import type {CSSProperties} from 'react';

const safe=(value:string)=>String(value||'item').replace(/[^a-zA-Z0-9_-]/g,'-');

export const morphNames={
  placeMedia:(id:string)=>`psn-place-media-${safe(id)}`,
  placeTitle:(id:string)=>`psn-place-title-${safe(id)}`,
  placeMeta:(id:string)=>`psn-place-meta-${safe(id)}`,
  mapPreview:(id:string)=>`psn-map-preview-${safe(id)}`,
  routeMedia:(slug:string)=>`psn-route-media-${safe(slug)}`,
  routeTitle:(slug:string)=>`psn-route-title-${safe(slug)}`,
  routeMeta:(slug:string)=>`psn-route-meta-${safe(slug)}`,
};

export function morphStyle(name:string){return {viewTransitionName:name} as CSSProperties;}
