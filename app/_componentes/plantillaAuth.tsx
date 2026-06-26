'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import BotonVolver from '@/app/_componentes/botonVolver';
import Footer from '@/app/_componentes/footer';
import { useState } from 'react';

// ssr: false evita el hydration mismatch — Clerk renderiza el UserButton solo en el cliente
const UserButton = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.UserButton),
  { ssr: false }
);

type PlantillaAuthProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

// Layout principal para páginas autenticadas: header fijo, sidebar y área de contenido
export default function PlantillaAuth({ children, sidebar }: PlantillaAuthProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <header className="sticky top-0 z-40 h-16 border-b border-[#e8ddd5] bg-background/95 backdrop-blur">
        <div className="relative flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 transition hover:bg-[#faf0ee] md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* En desktop: logo con texto al lado del hamburger */}
            <Link href="/" className="hidden sm:flex items-center gap-3 no-underline">
              <Image src="/logo.png" alt="Eventia logo" width={34} height={34} className="rounded-full" />
              <span className="font-display text-[22px] tracking-[0.01em]" style={{ color: 'var(--color-primary-vivid)' }}>
                Eventia
              </span>
            </Link>
          </div>

          {/* En mobile: solo el logo circular, centrado absolutamente */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 sm:hidden">
            <Image src="/logo.png" alt="Eventia logo" width={36} height={36} className="rounded-full" />
          </Link>

          <UserButton />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="hidden md:sticky md:top-16 md:self-start md:block md:w-[200px] md:shrink-0">{sidebar}</div>
        <main className="min-w-0 flex-1 overflow-x-hidden bg-background">
          <div className="px-3 pt-3 sm:px-5 lg:px-8">
            <BotonVolver />
          </div>
          {children}
          <Footer />
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute left-0 top-0 h-full w-72 bg-background shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-[#e8ddd5] px-4">
              <span className="font-label text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Menú
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl p-2 text-slate-700 transition hover:bg-[#faf0ee]"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div onClick={(e) => {
              if ((e.target as HTMLElement).closest('a')) setMobileMenuOpen(false);
            }}>{sidebar}</div>
          </div>
        </div>
      )}
    </div>
  );
}
