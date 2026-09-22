import {currentActor,requireActor} from './session';
export async function isAdmin(){return (await currentActor())?.role==='admin';}
export async function requireAdmin(){return requireActor('admin');}
