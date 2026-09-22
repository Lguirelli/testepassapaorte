export type Role='tourist'|'partner'|'admin';
// Actor must originate from a server-verified session, never request JSON.
export type Actor={id:string;role:Role;partnerId?:string};
export type Resource={ownerId?:string;partnerId?:string};
export type Permission='admin:access'|'trip:write'|'partner:edit'|'partner:request'|'qr:manage';
export function can(actor:Actor|null,permission:Permission,resource:Resource={}):boolean{
 if(!actor)return false;
 if(permission==='admin:access'||permission==='qr:manage')return actor.role==='admin';
 if(permission==='trip:write')return actor.role==='tourist'&&resource.ownerId===actor.id;
 return actor.role==='partner'&&!!actor.partnerId&&resource.partnerId===actor.partnerId;
}
export function requirePermission(actor:Actor|null,permission:Permission,resource:Resource={}){
 if(!can(actor,permission,resource))throw new Error('Acesso não autorizado.');
}
