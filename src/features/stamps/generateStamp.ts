import type {StampData,StampOptions,GeneratedStamp} from './types';
import {hash,createSeededRandom} from './random';import {resolveStampIcon} from './icons';import {shapeRegistry} from './shapes';import {defaultTheme,tokens,createStampTheme} from './theme';
export function generateStamp(input:StampData,options:StampOptions={}):GeneratedStamp {
 if(input.rendererVersion&&input.rendererVersion!==1)throw new Error('Versão do renderer não suportada');
 if(!input.partnerId?.trim()||!input.partnerName?.trim())throw new Error('Informe identificador e nome do estabelecimento');
 if(options.detail===undefined){const size=typeof options.size==='number'?options.size:options.size==='sm'?96:240;options={...options,detail:size<=96?'compact':size<=160?'normal':'full'};}
 const data={...input,partnerName:input.partnerName.trim(),category:input.category||'destination'};
 const seed=input.seed??hash(options.variationMode==='partner'?input.partnerId:`${input.partnerId}:${input.visitId??input.visitDate??'preview'}:${input.visitNumber??0}`).toString(16);
 const random=createSeededRandom(seed);const theme=options.theme?createStampTheme(options.theme):defaultTheme;const icon=resolveStampIcon(data);
 let shapes=Object.values(shapeRegistry).filter(s=>!data.preferredShapes?.length||data.preferredShapes.includes(s.id));if(!shapes.length)shapes=Object.values(shapeRegistry);
 const affinity=['coffee','grape','beer'].includes(icon.id)?['circle','scalloped','oval-horizontal','double-circle']:['rectangle','octagon','rounded-square'];
 const chosen=random.weighted(shapes.map(s=>[s,affinity.includes(s.id)?1.7:1]));
 const shape=shapeRegistry[data.customShape??'']??chosen;
 const layouts=shape.supportedLayouts;const autoLayout=random.pick(layouts);const layout=layouts.includes(data.customLayout??'')?data.customLayout!:autoLayout;
 let colors=theme.palette.filter(c=>!data.preferredColors?.length||data.preferredColors.includes(c));if(!colors.length)colors=theme.palette;
 const autoColor=random.pick(colors);const color=theme.palette.includes(data.customColor??'')?data.customColor!:autoColor;
 return {seed,rendererVersion:1,themeVersion:theme.version,iconLibraryVersion:1,shape:structuredClone(shape),layout,color,icon:structuredClone(icon),rotation:options.rotation===false?0:Math.round((random.float()*2-1)*tokens.rotation*10)/10,texture:{level:Math.min(1,Math.max(0,options.textureLevel??tokens.texture)),seed:random.int(1,999999)},typography:{family:tokens.fontFamily},data,options:{...options,theme}};
}
export function generateStampCollection(visits:StampData[],options:StampOptions={}){
 const result:GeneratedStamp[]=[];for(const visit of visits){let stamp=generateStamp(visit,options);if(!visit.seed&&!visit.stampId){for(let n=1;n<=12&&result.length>=2;n++){const last=result.slice(-2);if(!['color','layout','shape'].some(k=>last.every(s=>k==='shape'?s.shape.id===stamp.shape.id:s[k as 'color'|'layout']===stamp[k as 'color'|'layout'])))break;stamp=generateStamp({...visit,seed:`${stamp.seed}:${n}`},options);}}result.push(stamp);}return result;
}
