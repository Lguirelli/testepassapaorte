import {publicDataset} from '@/modules/content/repository';
import {GuestCalendarExperience} from '@/modules/trips/GuestExperience';
export const dynamic='force-dynamic';
export const metadata={title:'Calendário de apresentação'};
export default async function Page(){const data=await publicDataset();return <GuestCalendarExperience places={data.places.filter(p=>p.discoveryVisible!==false)}/>;}
