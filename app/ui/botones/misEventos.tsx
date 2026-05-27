'use client';

import Link from 'next/link';

export default function MisEventosButton() {
  return (
    <Link
      href="/vendedor/eventos"
      className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200 text-lg border border-slate-600 flex items-center gap-2"
    >
      <span>📋</span>
      Mis eventos
    </Link>
  );
}