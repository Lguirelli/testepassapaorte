import {analyticsProvider,events} from '@/modules/tracking/service';
import {z} from 'zod';
const schema=z.object({event:z.enum(events),payload:z.record(z.string(),z.union([z.string().max(200),z.number(),z.boolean()])).default({})});
export async function POST(req:Request){if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Origin denied'},{status:403});try{const data=schema.parse(await req.json());await analyticsProvider.record(data.event,data.payload);return Response.json({ok:true});}catch{return Response.json({error:'Invalid validation event'},{status:400});}}
