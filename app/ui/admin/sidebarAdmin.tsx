'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CalendarDays, FlaskConical, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SidebarAdmin() {
  const pathname = usePathname();
  const [simOpen, setSimOpen] = useState(false);

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === href
        ? 'bg-slate-100 text-slate-900'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 mb-2">
        Admin
      </p>

      <Link href="/admin/reportes" className={linkClass('/admin/reportes')}>
        <BarChart3 className="h-4 w-4" /> Reportes
      </Link>

      <Link href="/admin/eventos" className={linkClass('/admin/eventos')}>
        <CalendarDays className="h-4 w-4" /> Eventos
      </Link>

      <Link href="/admin/eventos/nuevo" className={linkClass('/admin/eventos/nuevo')}>
        <Plus className="h-4 w-4" /> Crear Evento
      </Link>

      {/* Simulaciones con desplegable */}
      <button
        onClick={() => setSimOpen(!simOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      >
        <FlaskConical className="h-4 w-4" />
        Simulaciones
        <span className="ml-auto text-xs">{simOpen ? '▲' : '▼'}</span>
      </button>

      {simOpen && (
        <div className="flex flex-col gap-1 pl-6">
          <Link href="/admin/simulacion/buyer" className={linkClass('/admin/simulacion/buyer')}>
            Buyer
          </Link>
          <Link href="/admin/simulacion/payments" className={linkClass('/admin/simulacion/payments')}>
            Payments
          </Link>
        </div>
      )}
    </aside>
  );
}
