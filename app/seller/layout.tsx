'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="border-b border-slate-200 px-6 py-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-semibold">Volver</span>
        </button>
      </header>

      <main className="flex-1 bg-white">
        {children}
      </main>
    </div>
  );
}