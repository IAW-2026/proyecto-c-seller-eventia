'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Plus } from 'lucide-react';

const links = [
  { href: '/vendedor', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/vendedor/eventos', label: 'Mis Eventos', icon: CalendarDays, exact: true },
  { href: '/vendedor/eventos/nuevo', label: 'Crear Evento', icon: Plus, exact: true },
];

export default function SidebarVendedor() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col gap-1 p-4 min-h-screen">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
