'use client';

import ModificarEventoButton from '@/app/ui/botones/modificarEvento';
import EliminarEventoButton from '@/app/ui/botones/eliminarEvento';

export type Evento = {
  idEvento: number;
  nombreEvento: string;
  descripcion: string;
  ubicacion: string;
  fecha: string;
  precio: number;
  categoria: string;
};

type Props = {
  evento: Evento;
  onModificar: (idEvento: number) => void;
  onEliminar: (idEvento: number) => void;
};

export default function EventoCard({ evento, onModificar, onEliminar }: Props) {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-44 items-center justify-center bg-slate-300 text-slate-600">
        Image cap
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-slate-900">
          {evento.nombreEvento}
        </h3>

        <p className="text-sm text-slate-600">
          {evento.descripcion}
        </p>
      </div>

      <ul className="border-t border-slate-200">
        <li className="border-b border-slate-200 px-4 py-2 text-sm">
          {evento.ubicacion}
        </li>
        <li className="border-b border-slate-200 px-4 py-2 text-sm">
          {new Date(evento.fecha).toLocaleString()}
        </li>
        <li className="border-b border-slate-200 px-4 py-2 text-sm"> Entrada </li>
      </ul>

      <div className="flex justify-center gap-2 p-4">
        <ModificarEventoButton onClick={() => onModificar(evento.idEvento)} />
        <EliminarEventoButton onClick={() => onEliminar(evento.idEvento)} />
      </div>
    </div>
  );
}