'use client';

import { useRouter } from 'next/navigation';
import ModificarEventoButton from '@/app/ui/botones/modificarEvento';
import EliminarEventoButton from '@/app/ui/botones/eliminarEvento';
import EventoCard from '@/app/ui/tarjetas/evento';

const eventosMock = [
  {
    idEvento: 1,
    nombreEvento: 'Festival Sunset 2026',
    descripcion: 'Una noche de música en vivo, food trucks y experiencias al aire libre.',
    ubicacion: 'Palermo, Buenos Aires',
    fecha: '2026-05-30T20:00:00.000Z',
  },
];

type Evento = {
  idEvento: number;
  nombreEvento: string | null;
  descripcion: string | null;
  ubicacion: string | null;
  fecha: string | null;
};

export default function EventosPage() {
  const router = useRouter();

  const modificarEvento = (idEvento: number) => {
    router.push(`/seller/eventos/nuevo?modo=editar&idEvento=${idEvento}`);
  };

  const eliminarEvento = async (idEvento: number) => {
    alert(`Eliminar evento ${idEvento}`);
  };

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-semibold">Mis Eventos</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {eventosMock.map((evento) => (
          <EventoCard
            key={evento.idEvento}
            evento={evento}
            onModificar={modificarEvento}
            onEliminar={eliminarEvento}
          />
        ))}
      </div>
    </div>
  );
}