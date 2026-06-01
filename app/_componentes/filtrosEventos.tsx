'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { CATEGORIAS } from '@/app/lib/constants';

type Organizador = {
  idOrganizador: string;
  nombreOrganizador: string | null;
  apellido: string | null;
};

type Props = {
  // organizadores es opcional: si no se pasa no se muestra el filtro (ej: vista vendedor)
  organizadores?: Organizador[];
};

export default function FiltrosEventos({ organizadores }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get('search') ?? '');
  const [fechaDesde, setFechaDesde] = useState(searchParams.get('fechaDesde') ?? '');
  const [fechaHasta, setFechaHasta] = useState(searchParams.get('fechaHasta') ?? '');

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

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    actualizarURL({ search: busqueda });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-start">
      {/* Columna izquierda: buscador + fechas justo debajo */}
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 shrink-0 text-[#9a8b80] sm:hidden" />
          <div className="relative flex-1">
            <Search className="hidden sm:block absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8b80]" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              aria-label="Buscar eventos por nombre"
              className="h-9 sm:h-11 w-full rounded-full sm:rounded-[14px] border border-[#d7cfc6] bg-[#fcf4e5] px-3 sm:pl-11 pr-[90px] sm:pr-[100px] text-sm text-[#5d4d45] placeholder:text-[#9e8a80] outline-none transition focus:border-[#c9b8aa]"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {busqueda && (
                <button
                  type="button"
                  onClick={() => { setBusqueda(''); actualizarURL({ search: '' }); }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8ddd5] text-[#7b5a50] transition hover:bg-[#ddd0c6]"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                type="submit"
                className="h-7 sm:h-8 rounded-full bg-[#8b1010] px-3 sm:px-4 text-[11px] sm:text-[12px] font-bold text-white transition hover:brightness-95"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Filtro de fechas, alineado debajo del buscador */}
        <div className="ml-7 sm:ml-0 flex items-center gap-1.5">
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-[#6e5549]">Fecha</span>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => { setFechaDesde(e.target.value); actualizarURL({ fechaDesde: e.target.value }); }}
            aria-label="Fecha desde"
            className="h-6 px-1.5 text-[10px] sm:h-8 sm:px-2.5 sm:text-xs rounded-full border border-[#d7cfc6] bg-[#fcf4e5] text-[#5d4d45] outline-none transition focus:border-[#c9b8aa] focus:bg-white"
          />
          <span className="text-[9px] sm:text-[10px] text-[#6e5549]">→</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => { setFechaHasta(e.target.value); actualizarURL({ fechaHasta: e.target.value }); }}
            aria-label="Fecha hasta"
            className="h-6 px-1.5 text-[10px] sm:h-8 sm:px-2.5 sm:text-xs rounded-full border border-[#d7cfc6] bg-[#fcf4e5] text-[#5d4d45] outline-none transition focus:border-[#c9b8aa] focus:bg-white"
          />
          {(fechaDesde || fechaHasta) && (
            <button
              type="button"
              onClick={() => { setFechaDesde(''); setFechaHasta(''); actualizarURL({ fechaDesde: '', fechaHasta: '' }); }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8ddd5] text-[#7b5a50] transition hover:bg-[#ddd0c6]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Columna derecha: selects + botón */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Filtro por categoría */}
        <select
          defaultValue={searchParams.get('categoria') ?? ''}
          onChange={(e) => actualizarURL({ categoria: e.target.value })}
          aria-label="Filtrar por categoría"
          className="mobile-compact-select h-9 sm:h-11 w-3/4 sm:w-auto ml-7 sm:ml-0 max-w-[360px] rounded-full sm:rounded-[14px] border border-[#d7cfc6] bg-[#fcf4e5] px-3 sm:px-4 py-1 text-sm text-[#5d4d45] outline-none transition focus:border-[#c9b8aa] focus:bg-white"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Filtro por organizador: solo aparece si se pasa el prop (admin) */}
        {organizadores && organizadores.length > 0 && (
          <select
            defaultValue={searchParams.get('organizador') ?? ''}
            onChange={(e) => actualizarURL({ organizador: e.target.value })}
            aria-label="Filtrar por organizador"
            className="mobile-compact-select h-9 sm:h-11 w-3/4 sm:w-auto ml-7 sm:ml-0 max-w-[360px] rounded-full sm:rounded-[14px] border border-[#d7cfc6] bg-[#fcf4e5] px-3 sm:px-4 py-1 text-sm text-[#5d4d45] outline-none transition focus:border-[#c9b8aa] focus:bg-white"
          >
            <option value="">Todos los organizadores</option>
            {organizadores.map((org) => (
              <option key={org.idOrganizador} value={org.idOrganizador}>
                {`${org.nombreOrganizador ?? ''} ${org.apellido ?? ''}`.trim()}
              </option>
            ))}
          </select>
        )}

      </div>
    </form>
  );
}
