'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';

// Buscador simple para la tabla de organizadores (solo nombre/apellido/mail)
export default function BuscadorOrganizadores() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get('search') ?? '');

  function actualizarURL(valor: string) {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set('search', valor);
    else params.delete('search');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    actualizarURL(busqueda);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8b80]" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o mail..."
          className={`h-11 w-full rounded-[14px] border border-[#d7cfc6] bg-[#fbfaf8] pl-11 text-sm text-[#5d4d45] placeholder:text-[#9e8a80] outline-none transition focus:border-[#c9b8aa] focus:bg-white ${busqueda ? 'pr-8' : 'pr-4'}`}
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => { setBusqueda(''); actualizarURL(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e8ddd5] text-[#7b5a50] transition hover:bg-[#ddd0c6]"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="h-11 rounded-[16px] bg-[#7b0b0b] px-7 font-bold text-white shadow-[0_10px_20px_rgba(123,11,11,0.22)] transition hover:-translate-y-0.5 hover:bg-[#640808] active:translate-y-0"
      >
        Buscar
      </button>
    </form>
  );
}
