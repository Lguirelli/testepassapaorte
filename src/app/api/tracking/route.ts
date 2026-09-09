import {NextResponse} from "next/server";import {getRepository} from "@/core/repository";import type {TrackingEventName} from "@/core/domain/types";
const allowed=new Set<TrackingEventName>(['PAGE_VIEWED','PLACE_VIEWED','SEARCH_PERFORMED','FILTER_APPLIED','PARTNER_CARD_CLICK','ROUTE_STARTED','TRIP_CREATED','PLACE_ADDED','PLACE_REMOVED','PLACE_SWAPPED','VISIT_CONFIRMED','PASSPORT_SHARED']);
export async function POST(req:Request){const body=await req.json();if(!allowed.has(body.name))return NextResponse.json({error:'Evento não permitido'},{status:400});const event=await getRepository().track(body.name,body.payload||{});return NextResponse.json(event,{status:201})}
export async function GET(){return NextResponse.json(await getRepository().recentTracking(100))}
