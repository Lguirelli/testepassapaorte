import type {ButtonHTMLAttributes, HTMLAttributes, ReactNode} from "react";
import Link from "next/link";
import {Icon} from "@/design-system/icons";
import type {IconName} from "@/design-system/icons";
export function Button({variant="primary",className="",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"secondary"|"ghost"|"danger"}){return <button className={`button ${variant==='primary'?'':variant} ${className}`} {...props}/>}
export function LinkButton({href,children,variant="primary"}:{href:string;children:ReactNode;variant?:"primary"|"secondary"|"ghost"}){return <Link className={`button ${variant==='primary'?'':variant}`} href={href}>{children}</Link>}
export function Badge({children,tone="default"}:{children:ReactNode;tone?:"default"|"success"|"warning"|"danger"}){return <span className={`badge ${tone==='default'?'':tone}`}>{children}</span>}
export function Card({children,className="",...props}:HTMLAttributes<HTMLDivElement>){return <article className={`card ${className}`} {...props}>{children}</article>}
export function StateMessage({type="empty",title,children}:{type?:"empty"|"error"|"loading"|"success";title:string;children?:ReactNode}){return <div className={`${type}-state`} role={type==='error'?'alert':undefined}><strong>{title}</strong>{children&&<div className="muted">{children}</div>}</div>}
export function Meta({icon,label,value}:{icon:IconName;label:string;value:ReactNode}){return <div className="info-box"><span className="cluster muted"><Icon name={icon} size="sm"/><span>{label}</span></span><strong>{value}</strong></div>}
