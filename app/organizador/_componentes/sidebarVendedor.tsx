'use client';

import { usePathname } from 'next/navigation';
import { BarChart3, CalendarDays, Home, Plus, Users } from 'lucide-react';
import ItemNav from '@/app/_componentes/itemNav';

export default function SidebarVendedor({ esAdmin = false }: { esAdmin?: boolean }) {
  const pathname = usePathname();

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
        </>
      )}
    </aside>
  );
}
