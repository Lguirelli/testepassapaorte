import content from './content.json';
import {ReferenceSurface} from './ReferenceSurface';
export type ReferenceKind='landing'|'partners'|'place';
export function ReferencePage({kind}:{kind:ReferenceKind}){
 return <ReferenceSurface kind={kind} html={content[kind]}/>;
}
