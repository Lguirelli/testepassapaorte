import {publicDataset} from '@/modules/content/repository';
import {GuestRouteExperience} from '@/modules/trips/GuestExperience';
import {sanitizeText} from '@/core/security/sanitize';
export const dynamic='force-dynamic';
export const metadata={title:'Roteiro de apresentação'};
export default async function Page({searchParams}:{searchParams:Promise<{day?:string}>}){const data=await publicDataset();const {day}=await searchParams;const initialDay=sanitizeText(day||'',10,{multiline:false});return <GuestRouteExperience places={data.places.filter(p=>p.discoveryVisible!==false)} initialDay={initialDay}/>;}
