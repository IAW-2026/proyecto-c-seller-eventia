'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Props = {
  totalPaginas: number;
  variant?: 'default' | 'admin';
  totalItems?: number;
  currentItems?: number;
  itemLabel?: string;
};

export default function Paginacion({
  totalPaginas,
  variant = 'default',
  totalItems,
  currentItems,
  itemLabel = 'resultados',
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Lee la página actual de la URL — si no existe el param, arranca en 1
  const paginaActual = Number(searchParams.get('page')) || 1;

  // Si solo hay una página no tiene sentido mostrar la paginación
  if (totalPaginas <= 1) return null;

  function cambiarPagina(nuevaPagina: number) {
    // Copia todos los params actuales (ej: search=rock) para no perderlos
    const params = new URLSearchParams(searchParams);
    params.set('page', nuevaPagina.toString());
    // replace en vez de push: no agrega al historial del browser en cada página
    replace(`${pathname}?${params.toString()}`);
  }

  const mostrarResumen = typeof totalItems === 'number' && typeof currentItems === 'number';

  const paginasVisibles = (): (number | 'ellipsis')[] => {
    if (totalPaginas <= 5) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }

    if (paginaActual <= 3) {
      return [1, 2, 3, 'ellipsis', totalPaginas];
    }

    if (paginaActual >= totalPaginas - 2) {
      return [1, 'ellipsis', totalPaginas - 2, totalPaginas - 1, totalPaginas];
    }

    return [1, 'ellipsis', paginaActual, 'ellipsis', totalPaginas];
  };

  if (variant === 'admin') {
    return (
      <div className="flex items-center justify-between border-t border-[#eadfd2] bg-[#f9f4ed] px-4 py-4 sm:px-6">
        <p className="hidden text-sm text-[#9b7f74] sm:block">
          {mostrarResumen
            ? `Mostrando ${currentItems} de ${totalItems} ${itemLabel}`
            : `Página ${paginaActual} de ${totalPaginas}`}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <button
            disabled={paginaActual <= 1}
            onClick={() => cambiarPagina(paginaActual - 1)}
            className="inline-flex h-10 items-center rounded-[12px] border border-[#d8ccc1] bg-[#f6efe8] px-4 text-sm text-[#b8aaa0] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            ← Ant
          </button>

          {paginasVisibles().map((item, idx) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-[#b3a095]">…</span>
            ) : (
              <button
                key={item}
                onClick={() => cambiarPagina(item)}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-[12px] border px-3 text-sm font-semibold transition ${
                  item === paginaActual
                    ? 'border-[#9e0b0f] bg-[#9e0b0f] text-white'
                    : 'border-[#d8ccc1] bg-[#f6efe8] text-[#4b3f38] hover:bg-white'
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            disabled={paginaActual >= totalPaginas}
            onClick={() => cambiarPagina(paginaActual + 1)}
            className="inline-flex h-10 items-center rounded-[12px] border border-[#d8ccc1] bg-[#f6efe8] px-4 text-sm text-[#4b3f38] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sig →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
      {/* Mobile: solo botones anterior/siguiente */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={paginaActual <= 1}
          onClick={() => cambiarPagina(paginaActual - 1)}
          className="disabled:opacity-40 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Anterior
        </button>
        <button
          disabled={paginaActual >= totalPaginas}
          onClick={() => cambiarPagina(paginaActual + 1)}
          className="disabled:opacity-40 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Siguiente
        </button>
      </div>

      {/* Desktop: indicador de página + botones */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          Página <span className="font-medium">{paginaActual}</span> de{' '}
          <span className="font-medium">{totalPaginas}</span>
        </p>
        <nav className="inline-flex -space-x-px rounded-md shadow-sm">
          <button
            disabled={paginaActual <= 1}
            onClick={() => cambiarPagina(paginaActual - 1)}
            className="disabled:opacity-40 inline-flex items-center rounded-l-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            Anterior
          </button>
          <button
            disabled={paginaActual >= totalPaginas}
            onClick={() => cambiarPagina(paginaActual + 1)}
            className="disabled:opacity-40 inline-flex items-center rounded-r-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            Siguiente
          </button>
        </nav>
      </div>
    </div>
  );
}
