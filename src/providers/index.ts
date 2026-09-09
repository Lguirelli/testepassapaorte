import type {Place, TripBundle, WeatherSnapshot} from "@/core/domain/types";
export type MockUser={id:string;name:string;role:"admin"|"traveler"};
export interface AuthProvider{currentUser():Promise<MockUser>}
export interface MapsProvider{markers(places:Place[]):Promise<Array<{id:string;lat:number;lng:number;label:string}>>}
export interface RoutesProvider{travelMinutes(a:Place,b:Place):Promise<number>}
export interface WeatherProvider{forDate(bundle:TripBundle,date:string):Promise<WeatherSnapshot|null>}
export interface StorageProvider{kind:"local"|"external"}
export interface AnalyticsProvider{track(name:string,payload:Record<string,unknown>):Promise<void>}
export const mockAuthProvider:AuthProvider={async currentUser(){return{id:"mock-admin",name:"Admin de validação",role:"admin"}}};
export const mockMapsProvider:MapsProvider={async markers(places){return places.flatMap(p=>p.location?[{id:p.id,lat:p.location.lat,lng:p.location.lng,label:p.name}]:[])}};
export const mockRoutesProvider:RoutesProvider={async travelMinutes(a,b){const seed=(a.id+b.id).split("").reduce((n,c)=>n+c.charCodeAt(0),0);return 6+(seed%19)}};
export const mockWeatherProvider:WeatherProvider={async forDate(bundle,date){return bundle.weather.find(w=>w.date===date)||null}};
export const localStorageProvider:StorageProvider={kind:"local"};
