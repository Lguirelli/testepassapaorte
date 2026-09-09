import type {GeneratedStamp} from './types';import {renderStampSVG} from './renderer';
export const exportStampSVG=(s:GeneratedStamp)=>new Blob([renderStampSVG(s,{embedFont:true,size:1024})],{type:'image/svg+xml;charset=utf-8'});
export const exportDataURL=(s:GeneratedStamp)=>`data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderStampSVG(s,{embedFont:true,size:1024}))}`;
export async function exportStampPNG(s:GeneratedStamp,size=2048,background?:string):Promise<Blob>{
 if(typeof document==='undefined')throw new Error('PNG requer um navegador com Canvas');
 if(!Number.isFinite(size)||size<64||size>4096)throw new Error('Tamanho permitido: 64 a 4096');
 const url=URL.createObjectURL(exportStampSVG(s));try {const img=new Image();await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error('Não foi possível renderizar o SVG'));img.src=url;});const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas indisponível');if(background){ctx.fillStyle=background;ctx.fillRect(0,0,size,size);}ctx.drawImage(img,0,0,size,size);return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Falha ao exportar PNG')),'image/png'));}finally{URL.revokeObjectURL(url);}
}
export function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
