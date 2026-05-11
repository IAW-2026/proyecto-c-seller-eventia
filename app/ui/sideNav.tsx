'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, PlusCircle, Settings } from 'lucide-react';
import NavItem from '@/app/ui/navItem';

export default function Sidenav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Principal', icon: LayoutDashboard },
    { href: '/seller/eventos', label: 'Mis eventos', icon: CalendarDays },
    { href: '/seller/eventos/nuevo', label: 'Agregar Evento', icon: PlusCircle },
    { href: '/settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-72 min-h-screen border-r border-slate-200 bg-white p-5">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-700">Eventia</h1>
        <p className="text-sm text-slate-500">Seller App</p>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            active={pathname === link.href}
          />
        ))}
      </nav>
    </aside>
  );
}