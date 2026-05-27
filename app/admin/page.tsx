"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r border-slate-200 p-4 flex flex-col gap-2">
        <h2 className="font-bold text-lg mb-4">Panel Admin</h2>

        <button
          onClick={() => setOpen(!open)}
          className="text-left px-3 py-2 rounded hover:bg-slate-100 font-medium"
        >
          Simulacion {open ? '▲' : '▼'}
        </button>

        {open && (
          <div className="flex flex-col gap-1 pl-4">
            <Link href="/admin/simulacion/buyer" className="px-3 py-2 rounded hover:bg-slate-100">
              Buyer
            </Link>
            <Link href="/admin/simulacion/payments" className="px-3 py-2 rounded hover:bg-slate-100">
              Payments
            </Link>
          </div>
        )}
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Bienvenido al panel de administrador</h1>
      </main>
    </div>
  );
}
