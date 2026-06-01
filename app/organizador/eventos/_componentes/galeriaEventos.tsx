'use client';

import { useRouter } from 'next/navigation';
import TarjetaEvento, { Evento } from '@/app/organizador/eventos/_componentes/tarjetaEvento';
import useConfirmarEliminar from '@/app/hooks/useConfirmarEliminar';

// Grid de tarjetas de eventos para el panel del vendedor
export default function GaleriaEventos({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();
  const { openConfirm, ConfirmElement } = useConfirmarEliminar(eventos.length);

  const handleModificar = (idEvento: number) => {
    // Redirigimos a la página del formulario pasando el modo y el ID
    router.push(`/organizador/eventos/nuevo?modo=editar&idEvento=${idEvento}`);
  };

  const handleEliminar = (idEvento: number) => {
    openConfirm(idEvento);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {eventos.map((evento) => (
          <TarjetaEvento
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
