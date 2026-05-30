'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import BotonVolver from '@/app/ui/botonVolver';
import { useState } from 'react';

type AuthShellProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function AuthShell({ children, sidebar }: AuthShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcf4e5] text-slate-900">
      <header className="sticky top-0 z-40 h-16 border-b border-[#e8ddd5] bg-[#fdf8f3]/95 backdrop-blur">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 transition hover:bg-[#faf0ee] md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-3 no-underline">
              <Image src="/logo.png" alt="Eventia logo" width={34} height={34} className="rounded-full" />
              <span className="font-display text-[22px] tracking-[0.01em]" style={{ color: '#8B1010' }}>
                Eventia
              </span>
            </Link>
          </div>

          <UserButton />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="hidden md:block">{sidebar}</div>
        <main className="min-w-0 flex-1 overflow-x-hidden bg-[#fcf4e5]">
          <div className="px-3 pt-3 sm:px-5 lg:px-8">
            <BotonVolver />
          </div>
          {children}
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

          <div className="absolute left-0 top-0 h-full w-72 bg-[#fdf8f3] shadow-2xl">
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