import { ClerkProvider } from '@clerk/nextjs';
import '@/app/globals.css';
import type { Metadata, Viewport } from 'next';
import { ffBody, ffDisplay, ffLabel } from '@/app/_componentes/fonts';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export const viewport: Viewport = {
  themeColor: '#fcf4e5',
};

// Metadata base — las páginas sobreescriben title via template '%s | Eventia'
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  title: {
    template: '%s | Eventia',
    default: 'Eventia - Plataforma de eventos',
  },
  description: 'La plataforma para organizadores de eventos. Creá tu evento, vendé entradas y gestioná todo desde un solo lugar.',
  openGraph: {
    title: 'Eventia - Plataforma de eventos',
    description: 'La plataforma para organizadores de eventos. Creá tu evento, vendé entradas y gestioná todo desde un solo lugar.',
    type: 'website',
    siteName: 'Eventia',
    locale: 'es_AR',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" className={cn(ffDisplay.variable, ffBody.variable, ffLabel.variable, "font-sans", geist.variable)}>
        <body className="flex min-h-screen flex-col bg-[#fcf4e5]">
          <main className="flex-1">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
