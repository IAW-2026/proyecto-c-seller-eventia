'use client';

import { useRouter } from 'next/navigation';
import EventoCard, { Evento } from '@/app/ui/tarjetas/evento';
import { deleteEventoAction } from '@/app/lib/actions/eventos';

export default function TablaEventos({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();

  const handleModificar = (idEvento: number) => {
    // Redirigimos a la página del formulario pasando el modo y el ID
    router.push(`/vendedor/eventos/nuevo?modo=editar&idEvento=${idEvento}`);
  };

  const handleEliminar = async (idEvento: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      const result = await deleteEventoAction(idEvento);
      if (result?.error) alert(result.error);
      // No hace falta recargar, revalidatePath en la acción lo hace por nosotros
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {eventos.map((evento) => (
        <EventoCard
          key={evento.idEvento}
          evento={evento}
          onModificar={handleModificar}
          onEliminar={handleEliminar}
        />
      ))}
    </div>
  );
}