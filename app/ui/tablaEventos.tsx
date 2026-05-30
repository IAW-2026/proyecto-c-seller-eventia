'use client';

import { useRouter } from 'next/navigation';
import EventoCard, { Evento } from '@/app/ui/tarjetas/evento';
import useDeleteConfirm from '@/app/ui/hooks/useDeleteConfirm';

export default function TablaEventos({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();
  const { openConfirm, ConfirmElement } = useDeleteConfirm(eventos.length);

  const handleModificar = (idEvento: number) => {
    // Redirigimos a la página del formulario pasando el modo y el ID
    router.push(`/vendedor/eventos/nuevo?modo=editar&idEvento=${idEvento}`);
  };

  const handleEliminar = (idEvento: number) => {
    openConfirm(idEvento);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {eventos.map((evento) => (
          <EventoCard
            key={evento.idEvento}
            evento={evento}
            onModificar={handleModificar}
            onEliminar={handleEliminar}
          />
        ))}
      </div>
      {ConfirmElement}
    </>
  );
}