import {LoginForm} from './LoginForm';
import {sanitizeRelativePath} from '@/core/security/sanitize';
export const metadata={title:'Entrar'};
export default async function LoginPage({searchParams}:{searchParams:Promise<{next?:string}>}){const params=await searchParams;const next=sanitizeRelativePath(params.next,'/roteiro');return <LoginForm next={next}/>;}
