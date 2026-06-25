'use client';

import { useTransition } from 'react';
import { activarOrganizador, desactivarOrganizador } from '@/app/lib/actions/organizadores';

export default function BotonesOrganizador({
  idOrganizador,
  activo,
}: {
  idOrganizador: string;
  activo: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleActivar() {
    startTransition(async () => { await activarOrganizador(idOrganizador); });
  }

  function handleDesactivar() {
    startTransition(async () => { await desactivarOrganizador(idOrganizador); });
  }

  return (
    <div className="flex justify-center gap-1.5">
      <button
        type="button"
        onClick={handleActivar}
        disabled={pending || activo}
        className="inline-flex h-5 items-center rounded-full bg-[var(--color-accent)] px-2 text-[9px] font-bold text-[var(--color-accent-foreground)] transition hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Activar
      </button>
      <button
        type="button"
        onClick={handleDesactivar}
        disabled={pending || !activo}
        className="inline-flex h-5 items-center rounded-full border border-[#8b1010] bg-transparent px-2 text-[9px] font-bold text-[#8b1010] transition hover:bg-[#8b1010]/8 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Desactivar
      </button>
    </div>
  );
}
