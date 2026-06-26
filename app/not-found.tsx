import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: '404 — Página no encontrada' };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span
        className="font-display text-[120px] leading-none tracking-[-0.04em] select-none sm:text-[160px]"
        style={{ color: 'var(--color-primary)', opacity: 0.15 }}
      >
        404
      </span>

      <h1
        className="font-display -mt-4 text-[30px] leading-tight tracking-[-0.02em] sm:text-[38px]"
        style={{ color: 'var(--color-ink, #111111)' }}
      >
        Página no encontrada
      </h1>

      <p
        className="font-body mt-3 max-w-[380px] text-[16px] leading-[1.6]"
        style={{ color: 'var(--color-text-muted, #6e5549)' }}
      >
        La dirección que ingresaste no existe o fue movida.
        Revisá el link o volvé al inicio.
      </p>

      <Link
        href="/"
        className="font-label mt-8 inline-flex items-center gap-2 rounded-[14px] px-[22px] py-[12px] text-[14px] font-bold transition hover:-translate-y-px hover:brightness-95"
        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground, #fff9ea)' }}
      >
        <ArrowLeft size={17} />
        Volver al inicio
      </Link>
    </div>
  );
}
