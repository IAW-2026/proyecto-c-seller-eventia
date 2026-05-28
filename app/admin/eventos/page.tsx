import prisma from '@/app/lib/prisma';
import FiltrosEventos from '@/app/ui/admin/filtrosEventos';
import TablaEventosAdmin from '@/app/ui/admin/tablaEventos';
import Paginacion from '@/app/ui/paginacion';
import { Suspense } from 'react';

const POR_PAGINA = 3;

export default async function AdminEventosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoria?: string; organizador?: string; page?: string }>;
}) {
  const { search = '', categoria = '', organizador = '', page = '1' } = await searchParams;
  const paginaActual = Math.max(1, Number(page));

  const where = {
    ...(search ? { nombreEvento: { contains: search, mode: 'insensitive' as const } } : {}),
    ...(categoria ? { categoria } : {}),
    ...(organizador ? { idOrganizador: organizador } : {}),
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
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Eventos</h1>
        <p className="text-slate-500 text-sm mt-1">Todos los eventos de la plataforma</p>
      </div>

      <Suspense>
        <FiltrosEventos organizadores={organizadores} />
      </Suspense>

      {(search || categoria || organizador) && (
        <p className="text-sm text-slate-500">
          {total === 0
            ? 'Sin resultados para los filtros aplicados'
            : `${total} resultado${total !== 1 ? 's' : ''} encontrados`}
        </p>
      )}

      <div className="bg-white rounded-xl border border-slate-200">
        <TablaEventosAdmin eventos={eventos} />
        <Suspense>
          <Paginacion totalPaginas={totalPaginas} />
        </Suspense>
      </div>
    </div>
  );
}
