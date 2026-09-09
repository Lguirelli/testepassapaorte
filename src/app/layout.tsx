import type {Metadata} from "next";
import "./globals.css";
import {SiteShell} from "@/components/layout";
export const metadata:Metadata={title:"Passaporte Serra Negra — Validation V1",description:"Vertical slice de validação com conteúdo sintético."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR" suppressHydrationWarning><body><SiteShell>{children}</SiteShell></body></html>}
