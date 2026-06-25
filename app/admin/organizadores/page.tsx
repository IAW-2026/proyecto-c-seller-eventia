import type { Metadata } from 'next';
import prisma from '@/app/lib/prisma';

export const metadata: Metadata = { title: 'Organizadores' };
import TablaOrganizadores from '@/app/admin/organizadores/_componentes/tablaOrganizadores';
import BuscadorOrganizadores from '@/app/admin/organizadores/_componentes/buscadorOrganizadores';
import Paginacion from '@/app/_componentes/paginacion';
import { Suspense } from 'react';
import { Users } from 'lucide-react';

const POR_PAGINA = 10;

export default async function AdminOrganizadoresPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search = '', page = '1' } = await searchParams;
  const paginaActual = Math.max(1, Number(page));

  const where = search
    ? {
        OR: [
          { nombreOrganizador: { contains: search, mode: 'insensitive' as const } },
          { apellido: { contains: search, mode: 'insensitive' as const } },
          { mail: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [organizadores, total] = await Promise.all([
    prisma.organizadores.findMany({
      where,
      orderBy: { nombreOrganizador: 'asc' },
      skip: (paginaActual - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: { _count: { select: { eventos: true, pedidos: { where: { estado: 'PAGADO' } } } } },
    }),
    prisma.organizadores.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="space-y-6 bg-background px-3 py-5 sm:px-5 lg:px-8">
      {/* Banner */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[var(--color-primary)]/20 shadow-[var(--color-shadow)] bg-cover bg-center min-h-[180px] flex items-center p-8 md:p-10"
        style={{ backgroundImage: "url('/imgHome.jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary-container)]/30 via-transparent to-transparent mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 max-w-md flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-[10px] font-label font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full w-fit">
            <Users className="w-3 h-3" /> Organizadores
          </span>
          <h1 className="font-display text-3xl md:text-5xl leading-none mt-2 whitespace-nowrap" style={{ color: 'var(--color-primary)' }}>
            Organizadores
          </h1>
          <p className="text-sm font-body font-medium mt-1" style={{ color: 'var(--color-primary)', opacity: 0.9 }}>
            Gestioná los organizadores de la plataforma
          </p>
        </div>
      </div>

      <Suspense>
        <BuscadorOrganizadores />
      </Suspense>

      {search && (
        <p className="text-sm text-slate-500">
          {total === 0
            ? 'Sin resultados para la búsqueda'
            : `${total} resultado${total !== 1 ? 's' : ''} encontrados`}
        </p>
      )}

      <div className="border border-[#eadfd2] bg-[#fdf9f2] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto sm:overflow-x-visible px-3 no-scrollbar">
          <TablaOrganizadores organizadores={organizadores} />
        </div>
        <Suspense>
          <Paginacion
            totalPaginas={totalPaginas}
            variant="admin"
            totalItems={total}
            currentItems={organizadores.length}
            itemLabel="organizadores"
          />
        </Suspense>
      </div>
    </div>
  );
}

