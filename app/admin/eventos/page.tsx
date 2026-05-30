import prisma from '@/app/lib/prisma';
import FiltrosEventos from '@/app/ui/admin/filtrosEventos';
import TablaEventosAdmin from '@/app/ui/admin/tablaEventos';
import Paginacion from '@/app/ui/paginacion';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';

const POR_PAGINA = 3;

export default async function AdminEventosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoria?: string; organizador?: string; fechaDesde?: string; fechaHasta?: string; page?: string }>;
}) {
  const { search = '', categoria = '', organizador = '', fechaDesde = '', fechaHasta = '', page = '1' } = await searchParams;
  const paginaActual = Math.max(1, Number(page));

  const fechaFiltro = {
    ...(fechaDesde ? { gte: new Date(fechaDesde + 'T00:00:00') } : {}),
    ...(fechaHasta ? { lte: new Date(fechaHasta + 'T23:59:59') } : {}),
  };

  const where = {
    ...(search ? { nombreEvento: { contains: search, mode: 'insensitive' as const } } : {}),
    ...(categoria ? { categoria } : {}),
    ...(organizador ? { idOrganizador: organizador } : {}),
    ...(Object.keys(fechaFiltro).length ? { fecha: fechaFiltro } : {}),
  };

  const [eventos, total, organizadores] = await Promise.all([
    prisma.eventos.findMany({
      where,
      orderBy: { idEvento: 'desc' },
      skip: (paginaActual - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: {
        organizador: { select: { nombreOrganizador: true, apellido: true } },
        _count: { select: { pedidos: { where: { estado: 'PAGADO' } } } },
      },
    }),
    prisma.eventos.count({ where }),
    prisma.organizadores.findMany({
      select: { idOrganizador: true, nombreOrganizador: true, apellido: true },
      orderBy: { nombreOrganizador: 'asc' },
    }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="space-y-6 bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-4 flex items-start justify-between gap-3 pt-1 sm:mb-5">
        <div className="min-w-0">
          <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#111111] sm:text-[38px]">
            Eventos
          </h1>
          <p className="font-label ml-1 mt-1 w-fit text-[12px] leading-[1.4] text-[#6e5549]">
            Todos los eventos de la plataforma
          </p>
        </div>

        <Link
          href="/admin/eventos/nuevo"
          className="mt-1 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#8B1010] bg-transparent px-3 text-[11px] font-semibold text-[#8B1010] transition hover:bg-[#8B1010]/5 sm:mt-0 sm:h-9 sm:px-4 sm:text-[13px]"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Nuevo evento
        </Link>
      </div>

      <Suspense>
        <FiltrosEventos organizadores={organizadores} />
      </Suspense>

      {(search || categoria || organizador || fechaDesde || fechaHasta) && (
        <p className="text-sm text-slate-500">
          {total === 0
            ? 'Sin resultados para los filtros aplicados'
            : `${total} resultado${total !== 1 ? 's' : ''} encontrados`}
        </p>
      )}

      <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto sm:overflow-x-visible px-3 no-scrollbar">
          <TablaEventosAdmin eventos={eventos} />
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
