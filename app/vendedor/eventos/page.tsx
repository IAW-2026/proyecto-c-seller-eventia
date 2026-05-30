import prisma from '@/app/lib/prisma';
import TablaEventos from '@/app/ui/tablaEventos';
import FiltrosEventos from '@/app/ui/admin/filtrosEventos';
import Paginacion from '@/app/ui/paginacion';
import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// 6 eventos por página: 2 filas de 3 en desktop
const POR_PAGINA = 6;

// searchParams es una Promise en Next.js 16 — hay que awaitearla
export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoria?: string; fechaDesde?: string; fechaHasta?: string; page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { search = '', categoria = '', fechaDesde = '', fechaHasta = '', page = '1' } = await searchParams;
  const paginaActual = Math.max(1, Number(page));

  const fechaFiltro = {
    ...(fechaDesde ? { gte: new Date(fechaDesde + 'T00:00:00') } : {}),
    ...(fechaHasta ? { lte: new Date(fechaHasta + 'T23:59:59') } : {}),
  };

  // Siempre filtra por el usuario logueado — el vendedor solo ve sus propios eventos
  const where = {
    idOrganizador: userId,
    ...(search ? { nombreEvento: { contains: search, mode: 'insensitive' as const } } : {}),
    ...(categoria ? { categoria } : {}),
    ...(Object.keys(fechaFiltro).length ? { fecha: fechaFiltro } : {}),
  };

  // Query paginada y conteo total en paralelo
  const [eventos, total] = await Promise.all([
    prisma.eventos.findMany({
      where,
      orderBy: { idEvento: 'desc' },
      skip: (paginaActual - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.eventos.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="space-y-6 bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-4 pt-1 sm:mb-5">
        <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#111111] sm:text-[38px]">
          Mis Eventos
        </h1>
        <p className="font-label ml-1 mt-1 w-fit text-[12px] leading-[1.4] text-[#6e5549]">
          Todos tus eventos publicados
        </p>
      </div>

      {/* FiltrosEventos sin organizadores — el select de organizador no aparece */}
      <Suspense>
        <FiltrosEventos />
      </Suspense>

      {(search || categoria || fechaDesde || fechaHasta) && (
        <p className="text-sm text-slate-500">
          {total === 0
            ? 'Sin resultados para los filtros aplicados'
            : `${total} resultado${total !== 1 ? 's' : ''} encontrados`}
        </p>
      )}

      <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="px-3 pt-3">
          <TablaEventos eventos={eventos as any} />
        </div>
        <Suspense>
          <Paginacion
            totalPaginas={totalPaginas}
            variant="admin"
            totalItems={total}
            currentItems={eventos.length}
            itemLabel="eventos"
          />
        </Suspense>
      </div>
    </div>
  );
}
