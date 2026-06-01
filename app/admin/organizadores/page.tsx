import type { Metadata } from 'next';
import prisma from '@/app/lib/prisma';

export const metadata: Metadata = { title: 'Organizadores' };
import TablaOrganizadores from '@/app/admin/organizadores/_componentes/tablaOrganizadores';
import BuscadorOrganizadores from '@/app/admin/organizadores/_componentes/buscadorOrganizadores';
import Paginacion from '@/app/_componentes/paginacion';
import { Suspense } from 'react';

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
      include: { _count: { select: { eventos: true, pedidos: true } } },
    }),
    prisma.organizadores.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="space-y-6 bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-4 pt-1 sm:mb-5">
        <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#8b1010] sm:text-[38px]">
          Organizadores
        </h1>
        <p className="font-label ml-1 mt-1 w-fit text-[12px] leading-[1.4] text-[#9a444a]">
          GestionÃ¡ los organizadores de la plataforma
        </p>
      </div>

      <Suspense>
        <BuscadorOrganizadores />
      </Suspense>

      {search && (
        <p className="text-sm text-slate-500">
          {total === 0
            ? 'Sin resultados para la bÃºsqueda'
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

