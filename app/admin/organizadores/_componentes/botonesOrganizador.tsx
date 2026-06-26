'use client';

import { useState, useTransition } from 'react';
import { activarOrganizador, desactivarOrganizador } from '@/app/lib/actions/organizadores';
import Toast from '@/app/_componentes/toast';

export default function BotonesOrganizador({
  idOrganizador,
  activo,
}: {
  idOrganizador: string;
  activo: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success' | 'error' } | null>(null);

  function handleActivar() {
    startTransition(async () => {
      try {
        await activarOrganizador(idOrganizador);
        setToast({ title: 'Organizador activado', message: 'El organizador fue activado correctamente.', type: 'success' });
      } catch {
        setToast({ title: 'No se pudo activar', message: 'Ocurrió un error inesperado.', type: 'error' });
      }
    });
  }

  function handleDesactivar() {
    startTransition(async () => {
      try {
        const result = await desactivarOrganizador(idOrganizador);
        if (!result.ok) {
          setToast({ title: 'No se pudo desactivar', message: result.error ?? 'Ocurrió un error.', type: 'error' });
        } else {
          setToast({ title: 'Organizador desactivado', message: 'El organizador fue desactivado correctamente.', type: 'success' });
        }
      } catch {
        setToast({ title: 'No se pudo desactivar', message: 'Ocurrió un error inesperado.', type: 'error' });
      }
    });
  }

  return (
    <>
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
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
