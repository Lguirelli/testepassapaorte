import {publicDataset} from '@/modules/content/repository';
import {GuestShareExperience} from '@/modules/trips/GuestExperience';
export const dynamic='force-dynamic';
export const metadata={title:'Compartilhar viagem de apresentação'};
export default async function Page(){const data=await publicDataset();return <GuestShareExperience places={data.places.filter(p=>p.discoveryVisible!==false)}/>;}
