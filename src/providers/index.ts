import trip from '../../seed/validation-trip.json';
export interface AuthProvider { currentUser(): Promise<{id:string;role:'admin'|'tourist'|'partner'}>; }
export interface MapsProvider { points<T extends {id:string}>(places:T[]): Array<{id:string;x:number;y:number}>; }
export interface RoutesProvider { between(from:string,to:string):{minutes:number;distanceKm:number;demo:true}; }
export interface WeatherProvider { forDate(date:string):typeof trip.weather[number]|undefined; }
export interface StorageProvider { placeholder(ratio:'hero'|'card'|'gallery'|'avatar'):string; }
export interface AnalyticsProvider { record(event:string,payload:Record<string,unknown>):Promise<void>; }
export function assertDemo(){
 if(process.env.NODE_ENV==='production' && process.env.ALLOW_DEMO!=='true') throw new Error('Validation requires explicit ALLOW_DEMO=true; real providers are not configured.');
 for(const [key,value] of Object.entries({AUTH_MODE:'mock',MAPS_MODE:'mock',ROUTES_MODE:'mock',WEATHER_MODE:'mock',STORAGE_MODE:'local',ANALYTICS_MODE:'local'})) if(process.env[key] && process.env[key]!==value)throw new Error(`${key}: adapter not implemented`);
}
export const authProvider:AuthProvider={async currentUser(){assertDemo();return{id:'demo-tourist',role:'tourist'};}};
export const mapsProvider:MapsProvider={points:places=>places.map((p,i)=>({id:p.id,x:15+(i%3)*33,y:18+Math.floor(i/3)*28}))};
export const routesProvider:RoutesProvider={between(from,to){const seed=[...from+to].reduce((sum,c)=>sum+c.charCodeAt(0),0);return{minutes:8+seed%13,distanceKm:1+seed%5,demo:true};}};
export const weatherProvider:WeatherProvider={forDate:date=>trip.weather.find(w=>w.date===date)};
export const storageProvider:StorageProvider={placeholder:ratio=>`/placeholders/${ratio}.svg`};
