'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Home, Plus } from 'lucide-react';

const links = [
  { href: '/', label: 'Inicio', icon: Home, exact: true, home: true },
  { href: '/vendedor', label: 'Reportes', icon: CalendarDays, exact: true },
  { href: '/vendedor/eventos', label: 'Mis Eventos', icon: CalendarDays, exact: true },
  { href: '/vendedor/eventos/nuevo', label: 'Crear Evento', icon: Plus, exact: true },
];

export default function SidebarVendedor() {
  const pathname = usePathname();

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-[200px] shrink-0 flex-col overflow-y-auto border-r border-[#e8ddd5] bg-[#fdf8f3] py-5">
      <span className="px-4 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#b0a09a]">
        General
      </span>

      {links.map(({ href, label, icon: Icon, exact, home }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        const isHome = home && pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`mx-2 flex items-center gap-2.5 border-l-[3px] px-4 py-2 text-[13px] transition ${
              isActive || isHome
                ? 'border-l-[#8B1010] bg-[#f5e8e4] font-medium text-[#8B1010]'
                : 'border-l-transparent text-[#5a3a35] hover:bg-[#faf0ee]'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
