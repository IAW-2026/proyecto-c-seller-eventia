'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRef } from 'react';
import { CATEGORIAS } from '@/app/lib/constants';

type Organizador = {
  idOrganizador: string;
  nombreOrganizador: string | null;
  apellido: string | null;
};

type Props = {
  organizadores: Organizador[];
};

export default function FiltrosEventos({ organizadores }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function actualizarURL(nuevosParams: Record<string, string>) {
    // Copia los params actuales y aplica los cambios
    const params = new URLSearchParams(searchParams);
    Object.entries(nuevosParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    // Al cambiar cualquier filtro volvemos a página 1
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    actualizarURL({ search: inputRef.current?.value ?? '' });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      {/* Buscador por nombre */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={searchParams.get('search') ?? ''}
          placeholder="Buscar por nombre..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filtro por categoría */}
      <select
        defaultValue={searchParams.get('categoria') ?? ''}
        onChange={(e) => actualizarURL({ categoria: e.target.value })}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas las categorías</option>
        {CATEGORIAS.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Filtro por organizador */}
      <select
        defaultValue={searchParams.get('organizador') ?? ''}
        onChange={(e) => actualizarURL({ organizador: e.target.value })}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos los organizadores</option>
        {organizadores.map((org) => (
          <option key={org.idOrganizador} value={org.idOrganizador}>
            {`${org.nombreOrganizador ?? ''} ${org.apellido ?? ''}`.trim()}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Buscar
      </button>
    </form>
  );
}
