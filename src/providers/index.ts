export interface MapsProvider { points<T extends {id:string}>(places:T[]): Array<{id:string;x:number;y:number}>; }
export interface StorageProvider { placeholder(ratio:'hero'|'card'|'gallery'|'avatar'):string; }
export interface AnalyticsProvider { record(event:string,payload:Record<string,unknown>):Promise<void>; }
export const mapsProvider:MapsProvider={points:places=>places.map((p,i)=>({id:p.id,x:15+(i%3)*33,y:18+Math.floor(i/3)*28}))};
export const storageProvider:StorageProvider={placeholder:ratio=>`/placeholders/${ratio}.svg`};
