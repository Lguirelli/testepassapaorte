"use client";
import {useEffect} from "react";
import type {TrackingEventName} from "@/core/domain/types";
export function PageTracker({name="PAGE_VIEWED",payload}:{name?:TrackingEventName;payload:Record<string,unknown>}){useEffect(()=>{fetch("/api/tracking",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name,payload})}).catch(()=>{})},[name,payload]);return null}
