'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

type Props = {
  placeholder: string; // texto que aparece en el input cuando está vacío
  basePath: string;    // URL base a la que navega, ej: '/vendedor/eventos'
  searchActual?: string; // valor actual del search (viene de la URL), para mostrarlo en el input
};

export default function Buscador({ placeholder, basePath, searchActual = '' }: Props) {
  // useRouter permite navegar a otras rutas desde un Client Component
  const router = useRouter();

  // useRef conecta la variable con el input del DOM para leer su valor al hacer submit
  // (no usamos useState para no re-renderizar en cada tecla)
  const inputRef = useRef<HTMLInputElement>(null);

  // Se ejecuta cuando el usuario aprieta Enter o el botón "Buscar"
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // evita que el form recargue la página (comportamiento default del browser)
    const valor = inputRef.current?.value ?? '';
    const params = new URLSearchParams(); // construye los query params de la URL
    if (valor) params.set('search', valor); // solo agrega el param si hay algo escrito
    // Navega a la URL con el search, ej: /vendedor/eventos?search=rock
    // Esto hace que el Server Component de la página se re-ejecute con los nuevos params
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={searchActual}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Buscar
      </button>
    </form>
  );
}
