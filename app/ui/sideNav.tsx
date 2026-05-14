'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, CalendarDays } from 'lucide-react';

export default function Sidenav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Inicio', icon: LayoutDashboard },
    { href: '/seller/eventos', label: 'Mis Eventos', icon: CalendarDays },
  ];

  return (
    <nav className="w-full border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between gap-8">
        <h1 className="text-2xl font-bold text-blue-700">Eventia</h1>

        <div className="flex flex-1 items-center justify-center gap-6">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}