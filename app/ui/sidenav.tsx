'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, PlusCircle, Settings } from 'lucide-react';

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
        <h1 className="text-2xl font-bold text-blue-700">
          Eventia
        </h1>

        <p className="text-sm text-slate-500">
          Seller App
        </p>
      </div>

      <nav className="flex flex-col gap-2">

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}