"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ConfirmDialog from '@/app/ui/confirmDialog';
import { deleteEventoAction } from '@/app/lib/actions/eventos';

type UseDeleteConfirm = {
  openConfirm: (idEvento: number) => void;
  ConfirmElement: React.ReactElement;
};

export default function useDeleteConfirm(itemsOnPageCount?: number): UseDeleteConfirm {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openConfirm = (idEvento: number) => {
    setSelectedId(idEvento);
    setOpen(true);
  };

  const closeConfirm = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setOpen(false);
    const result = await deleteEventoAction(selectedId);
    if (result?.error) {
      setToastMessage(result.error);
      return;
    }

    setToastMessage('Evento eliminado correctamente');

    // lógica de paginación: si era el último elemento y page>1, ir a página anterior
    const paginaActual = Number(searchParams.get('page') ?? '1');
    if ((itemsOnPageCount ?? 0) <= 1 && paginaActual > 1) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('page', String(paginaActual - 1));
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.refresh();
    }
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const ConfirmElement = (
    <>
      <ConfirmDialog
        open={open}
        title="Eliminar evento"
        message="¿Seguro que querés eliminar este evento? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-md bg-[#111111] px-4 py-2 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </>
  );

  return { openConfirm, ConfirmElement };
}
