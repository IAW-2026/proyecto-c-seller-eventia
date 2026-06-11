'use client';

import { usePathname } from 'next/navigation';
import { BarChart3, CalendarDays, FlaskConical, Home, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import ItemNav from '@/app/_componentes/itemNav';

export default function SidebarVendedor({ esAdmin = false }: { esAdmin?: boolean }) {
  const pathname = usePathname();
  const [simOpen, setSimOpen] = useState(false);

  return (
    <aside className="flex h-full md:h-[calc(100vh-4rem)] w-full shrink-0 flex-col overflow-y-auto md:border-r border-[#e8ddd5] bg-[#fcf4e5] py-5">
      <span className="px-4 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8b1010]">
        General
      </span>

      <ItemNav href="/" label="Inicio" icon={Home} active={pathname === '/'} />
      <ItemNav href="/organizador" label="Reportes" icon={BarChart3} active={pathname === '/organizador'} />
      <ItemNav href="/organizador/eventos" label="Mis Eventos" icon={CalendarDays} active={pathname === '/organizador/eventos'} />
      <ItemNav href="/organizador/eventos/nuevo" label="Crear Evento" icon={Plus} active={pathname === '/organizador/eventos/nuevo'} />

      {esAdmin && (
        <>
          <span className="px-4 pt-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8b1010]">
            Administración
          </span>

          <ItemNav href="/admin/reportes" label="Reportes globales" icon={BarChart3} active={pathname === '/admin/reportes'} />
          <ItemNav href="/admin/eventos" label="Todos los Eventos" icon={CalendarDays} active={pathname.startsWith('/admin/eventos')} />
          <ItemNav href="/admin/organizadores" label="Organizadores" icon={Users} active={pathname.startsWith('/admin/organizadores')} />

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
              <ItemNav href="/admin/simulacion/buyer" label="Buyer" icon={FlaskConical} active={pathname === '/admin/simulacion/buyer'} />
              <ItemNav href="/admin/simulacion/payments" label="Payments" icon={FlaskConical} active={pathname === '/admin/simulacion/payments'} />
            </div>
          )}
        </>
      )}
    </aside>
  );
}
