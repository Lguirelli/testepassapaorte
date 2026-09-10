import {cookies} from 'next/headers';import {randomBytes} from 'node:crypto';import {assertDemo} from '@/providers';import {verifyDemoToken} from './token';
const scope=globalThis as typeof globalThis & {demoSigningSecret?:string};
export function secret(){return scope.demoSigningSecret??=process.env.DEMO_SESSION_SECRET||randomBytes(32).toString('hex');}
export async function isAdmin(){assertDemo();return verifyDemoToken((await cookies()).get('demo-admin')?.value,secret());}
export async function requireAdmin(){if(!await isAdmin())throw new Error('Admin session required');return{id:'demo-admin',role:'admin' as const};}
