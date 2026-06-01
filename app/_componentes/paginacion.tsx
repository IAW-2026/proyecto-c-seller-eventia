'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Props = {
  totalPaginas: number;
  variant?: 'default' | 'admin';
  totalItems?: number;
  currentItems?: number;
  itemLabel?: string;
};

export default function Paginacion({ totalPaginas }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const paginaActual = Number(searchParams.get('page')) || 1;

  if (totalPaginas <= 1) return null;

  function cambiarPagina(nuevaPagina: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', nuevaPagina.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between border-t border-[#eadfd2] px-4 py-4 sm:px-6">
      <p className="font-label text-[13px] text-[#9b7f74]">
        Mostrando página{' '}
        <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-[9px] py-[2px] text-[12px] font-bold text-[var(--color-accent-foreground)]">
          {paginaActual}
        </span>{' '}
        de <span className="font-bold text-[#4b3f38]">{totalPaginas}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={paginaActual <= 1}
          onClick={() => cambiarPagina(paginaActual - 1)}
          aria-label="Página anterior"
          className="font-label inline-flex h-10 items-center rounded-full border border-[#d8ccc1] bg-transparent px-5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#5a3a35] transition hover:bg-[#f5ede6] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          disabled={paginaActual >= totalPaginas}
          onClick={() => cambiarPagina(paginaActual + 1)}
          aria-label="Página siguiente"
          className="font-label inline-flex h-10 items-center rounded-full bg-[var(--color-primary)] px-5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
