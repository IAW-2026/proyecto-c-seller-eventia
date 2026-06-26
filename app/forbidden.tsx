import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldX, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: '403 — Acceso restringido' };

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px]"
        style={{ background: 'rgba(101, 0, 3, 0.08)' }}
      >
        <ShieldX size={40} style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
      </div>

      <h1
        className="font-display text-[30px] leading-tight tracking-[-0.02em] sm:text-[38px]"
        style={{ color: 'var(--color-ink, #111111)' }}
      >
        Acceso restringido
      </h1>

      <p
        className="font-body mt-3 max-w-[380px] text-[16px] leading-[1.6]"
        style={{ color: 'var(--color-text-muted, #6e5549)' }}
      >
        No tenés permisos para ver esta sección.
        Solo los administradores pueden acceder al panel de admin.
      </p>

      <Link
        href="/organizador/eventos"
        className="font-label mt-8 inline-flex items-center gap-2 rounded-[14px] px-[22px] py-[12px] text-[14px] font-bold transition hover:-translate-y-px hover:brightness-95"
        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground, #fff9ea)' }}
      >
        <ArrowLeft size={17} />
        Ir a mis eventos
      </Link>
    </div>
  );
}
