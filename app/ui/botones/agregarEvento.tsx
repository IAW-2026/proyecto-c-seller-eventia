'use client';

import Link from 'next/link';

export default function AgregarEventoButton() {
  return (
    <Link
      href="/seller/eventos/nuevo"
      className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200 text-lg flex items-center gap-2"
    >
      <span>+</span>
      Agregar evento
    </Link>
  );
}