import type {CSSProperties} from 'react';
import {iconRegistry} from './icon-registry';
import type {IconName, IconSizeToken} from './icon.types';
type Props = {name: IconName; size?: IconSizeToken | number; title?: string; className?: string; style?: CSSProperties; strokeWidth?: number};
export function Icon({name,size='md',title,className,style,strokeWidth}:Props){
 const Component=iconRegistry[name];
 const dimension=typeof size==='number'?`${size}px`:`var(--icon-size-${size})`;
 return <Component data-ui-icon="true" className={className} width={dimension} height={dimension} role={title?'img':undefined} aria-hidden={title?undefined:true} aria-label={title} focusable="false" style={{flexShrink:0,verticalAlign:'middle',...(strokeWidth?{'--icon-stroke-width':strokeWidth} as CSSProperties:{}),...style}}/>;
}
