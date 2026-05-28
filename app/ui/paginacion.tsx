'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Props = {
  totalPaginas: number;
};

export default function Paginacion({ totalPaginas }: Props) {
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
