"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import useDeleteConfirm from '@/app/ui/hooks/useDeleteConfirm';
import { ptSerif } from '@/app/ui/fonts';
import { deleteEventoAction } from '@/app/lib/actions/eventos';
import { PencilLine, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/app/ui/confirmDialog';

type EventoAdmin = {
  idEvento: number;
  nombreEvento: string | null;
  precio: number | null;
  categoria: string | null;
  ubicacion: string | null;
  stock: number | null;
  fecha: Date | null;
  organizador: { nombreOrganizador: string | null; apellido: string | null } | null;
  _count: { pedidos: number };
};

export default function TablaEventosAdmin({ eventos }: { eventos: EventoAdmin[] }) {
  const router = useRouter();
  const { openConfirm, ConfirmElement } = useDeleteConfirm(eventos.length);

  const handleModificar = (idEvento: number) => {
    router.push(`/admin/eventos/nuevo?modo=editar&idEvento=${idEvento}`);
  };

  const openConfirmHandler = (id: number) => openConfirm(id);

  return (
    <>
      <table className="min-w-[960px] w-full table-fixed bg-[#f9f4ed] text-[11px]">
      <colgroup>
        <col className="w-[11%]" />
        <col className="w-[11%]" />
        <col className="w-[14%]" />
        <col className="w-[20%]" />
        <col className="w-[8%]" />
        <col className="w-[8%]" />
        <col className="w-[8%]" />
        <col className="w-[8%]" />
        <col className="w-[12%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-[#eadfd2] text-[11px] uppercase tracking-[0.12em] text-[#b38c7d]">
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Nombre</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Organizador</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Categoría</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Ubicación</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Fecha</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Precio</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Stock</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Pedidos</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#ebdfd4]">
        {eventos.length === 0 ? (
          <tr>
            <td colSpan={9} className="px-4 py-12 text-center text-[#9b8074]">
              No hay eventos.
            </td>
          </tr>
        ) : (
          eventos.map((e) => {
            const nombreOrg = e.organizador
              ? `${e.organizador.nombreOrganizador ?? ''} ${e.organizador.apellido ?? ''}`.trim()
              : '—';
            return (
              <tr key={e.idEvento} className="transition hover:bg-[#fffaf4]">
                <td className={`truncate px-2 py-3 text-center text-[11px] font-semibold leading-[1.2] text-[var(--color-primary)] ${ptSerif.className}`}>
                  {e.nombreEvento ?? '—'}
                </td>
                <td className="truncate px-2 py-3 text-center text-[11px] text-[#6f5a50]">{nombreOrg}</td>
                <td className="px-2 py-3 text-center">
                  <span className="inline-flex rounded-full bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold leading-tight text-[var(--color-accent-foreground)] whitespace-normal">
                    {e.categoria ?? '—'}
                  </span>
                </td>
                <td className="px-2 py-3 text-center text-[11px] text-[#6f5a50] whitespace-normal">{e.ubicacion ?? '—'}</td>
                <td className="px-0.5 py-3 text-center text-[11px] text-[#6f5a50]">
                  {e.fecha ? new Date(e.fecha).toLocaleDateString('es-AR', {
                    timeZone: 'America/Argentina/Buenos_Aires',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }) : '—'}
                </td>
                <td className="px-0.5 py-3 text-center text-[11px] font-semibold text-[#2c2a28]">
                  ${e.precio?.toLocaleString() ?? '—'}
                </td>
                <td className="px-2 py-3 text-center text-[11px] text-[#6f5a50]">{e.stock ?? '—'}</td>
                <td className="px-2 py-3 pr-3 text-center text-[11px] text-[#6f5a50]">{e._count.pedidos}</td>
                <td className="px-1 py-3">
                  <div className="flex justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleModificar(e.idEvento)}
                      className="inline-flex h-7 w-[72px] items-center justify-center gap-1 rounded-[9px] border border-[#d9cfc6] bg-[#fbf9f6] px-1 text-[10px] font-semibold text-[#2f241f] transition hover:bg-white"
                    >
                      <PencilLine className="h-2.5 w-2.5" />
                      Modificar
                    </button>
                    <button
                      type="button"
                      onClick={() => openConfirmHandler(e.idEvento)}
                      className="inline-flex h-7 w-[68px] items-center justify-center gap-1 rounded-[9px] border border-[#edc5c5] bg-[#fbf9f6] px-1 text-[10px] font-semibold text-[#de3131] transition hover:bg-[#fff6f6]"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
    {ConfirmElement}
    </>
  );
}
