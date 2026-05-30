'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CalendarDays, FlaskConical, Home, Users } from 'lucide-react';
import { useState } from 'react';

export default function SidebarAdmin() {
  const pathname = usePathname();
  const [simOpen, setSimOpen] = useState(false);

  const linkClass = (href: string) =>
    `mx-2 flex items-center gap-2.5 border-l-[3px] px-4 py-2 text-[13px] transition-colors ${
      pathname === href
        ? 'border-l-[#8B1010] bg-[#f5e8e4] font-medium text-[#8B1010]'
        : 'border-l-transparent text-[#5a3a35] hover:bg-[#faf0ee]'
    }`;

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-[200px] shrink-0 flex-col overflow-y-auto border-r border-[#e8ddd5] bg-[#fdf8f3] py-5">
      <span className="px-4 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#b0a09a]">
        Panel de administrador
      </span>

      <Link href="/" className={linkClass('/')}>
        <Home className="h-4 w-4" /> Inicio
      </Link>

      <Link href="/admin/reportes" className={linkClass('/admin/reportes')}>
        <BarChart3 className="h-4 w-4" /> Reportes
      </Link>

      <Link href="/admin/eventos" className={linkClass('/admin/eventos')}>
        <CalendarDays className="h-4 w-4" /> Eventos
      </Link>

      <Link href="/admin/organizadores" className={linkClass('/admin/organizadores')}>
        <Users className="h-4 w-4" /> Organizadores
      </Link>

      <span className="px-4 pt-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#b0a09a]">
        Avanzado
      </span>

      <button
        onClick={() => setSimOpen(!simOpen)}
        className="mx-2 flex items-center gap-2.5 border-l-[3px] border-l-transparent px-4 py-2 text-[13px] font-medium text-[#5a3a35] transition-colors hover:bg-[#faf0ee]"
      >
        <FlaskConical className="h-4 w-4" />
        Simulaciones
        <span className="ml-auto text-[10px]">{simOpen ? '▲' : '▼'}</span>
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
