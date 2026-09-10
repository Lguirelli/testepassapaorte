/* eslint-disable */
import type {ShapeDefinition} from './types';
export const layoutRegistry:Record<string,{label:string}>={radial:{label:'Nome em arco'},center:{label:'Clássico central'},iconTop:{label:'Ícone superior'},split:{label:'Ícone lateral'},ruled:{label:'Com divisória'},banner:{label:'Faixa central'},seal:{label:'Selo circular'}};
const centered=['center','iconTop','ruled','banner'];const round=['radial','center','seal','ruled'];
const circle='M160 18 A142 142 0 1 1 159.99 18 Z';
function polygon(n:number,rx:number,ry:number,start=-Math.PI/2){return Array.from({length:n},(_,i)=>{const a=start+i*Math.PI*2/n;return `${i?'L':'M'}${(160+Math.cos(a)*rx).toFixed(2)} ${(160+Math.sin(a)*ry).toFixed(2)}`;}).join(' ')+' Z';}
function wave(n:number,amp:number){return Array.from({length:180},(_,i)=>{const a=i*Math.PI*2/180;const r=135+amp*Math.cos(n*a);return `${i?'L':'M'}${(160+Math.cos(a)*r).toFixed(2)} ${(160+Math.sin(a)*r).toFixed(2)}`;}).join(' ')+' Z';}
export const shapeRegistry:Record<string,ShapeDefinition>={};
export function registerShape(shape:ShapeDefinition){if(!/^[a-z][a-z0-9-]*$/.test(shape.id)||!shape.supportedLayouts.length||shape.supportedLayouts.some(l=>!layoutRegistry[l])||!/^[MmLlHhVvCcSsQqTtAaZz0-9eE.,\s+\-]+$/.test(shape.path))throw new Error('Forma inválida');shapeRegistry[shape.id]=structuredClone(shape);}
const shapes:[string,string,string,string[],number?][]=[
 ['circle','Circular',circle,round],['double-circle','Círculo duplo',circle,round],['irregular-circle','Círculo irregular',wave(7,2.8),round],
 ['oval-horizontal','Oval horizontal','M20 160 A140 112 0 1 1 300 160 A140 112 0 1 1 20 160Z',['center','split','ruled'],55],
 ['oval-vertical','Oval vertical','M160 16 A115 144 0 1 1 159.99 16Z',centered],
 ['rectangle','Retangular','M17 45H303V275H17Z',['split',...centered],55],
 ['rounded-rectangle','Retângulo arredondado','M36 40H284Q300 40 300 56V264Q300 280 284 280H36Q20 280 20 264V56Q20 40 36 40Z',['split',...centered],50],
 ['square','Quadrado','M30 30H290V290H30Z',centered],
 ['rounded-square','Quadrado arredondado','M55 25H265Q295 25 295 55V265Q295 295 265 295H55Q25 295 25 265V55Q25 25 55 25Z',centered],
 ['octagon','Octogonal',polygon(8,148,148,Math.PI/8),centered],
 ['hexagon','Hexagonal',polygon(6,148,146),centered],
 ['scalloped','Borda ondulada',wave(12,8),round],
 ['badge','Brasão','M70 30H250L290 85V230L160 292L30 230V85Z',centered],
 ['postal','Postal',Array.from({length:4},(_,side)=>Array.from({length:16},(_,i)=>{const p=i*16;const q=i%2?25:18;const xy=side===0?[32+p,q]:side===1?[320-q,32+p]:side===2?[288-p,320-q]:[q,288-p];return `${side===0&&i===0?'M':'L'}${xy.join(' ')}`;}).join(' ')).join(' ')+'Z',centered],
 ['ticket','Ingresso','M25 50H295V120C265 120 265 180 295 180V270H25V180C55 180 55 120 25 120Z',['split',...centered],60],
 ['soft-shield','Escudo','M35 30Q160 48 285 30V175Q280 255 160 300Q40 255 35 175Z',centered],
 ['double-border','Moldura dupla','M25 40H295V280H25Z',['split',...centered],50]
];
for(const [id,label,path,supportedLayouts,y=42] of shapes){
 const [x,ty,scaleX,scaleY]=['soft-shield','badge','hexagon'].includes(id)?[22,18,.86,.80]:id==='oval-horizontal'?[13,40,.92,.73]:['rectangle','rounded-rectangle','ticket','double-border'].includes(id)?[4,20,.975,.86]:id==='oval-vertical'?[20,0,.875,1]:['irregular-circle','scalloped'].includes(id)?[8,9,.95,.91]:[0,0,1,1];
 registerShape({id,label,path,supportedLayouts,safeArea:{x:55,y,width:210,height:320-2*y},contentTransform:{x,y:ty,scaleX,scaleY}});
}
