import type {TripData,TripItem} from './types';
export function itemEvidence(trip:TripData,item:TripItem,date:string){return trip.visits.some(v=>v.placeId===item.placeId&&v.occurredAt.slice(0,10)===date)?'Presença registrada demo':'Sem evidência registrada';}
