import type { Metadata } from 'next';
import prisma from '@/app/lib/prisma';

export const metadata: Metadata = { title: 'Eventos' };
import FiltrosEventos from '@/app/_componentes/filtrosEventos';
import TablaEventosAdmin from '@/app/admin/eventos/_componentes/tablaEventos';
import Paginacion from '@/app/_componentes/paginacion';
import { Suspense } from 'react';
import ResultadosFiltro from '@/app/_componentes/resultadosFiltro';
import { EVENTOS_POR_PAGINA } from '@/app/lib/constants';
import { buildFechaFiltro } from '@/app/lib/utils';
import { CalendarDays } from 'lucide-react';

export default async function AdminEventosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoria?: string; organizador?: string; fechaDesde?: string; fechaHasta?: string; page?: string }>;
}) {
  const { search = '', categoria = '', organizador = '', fechaDesde = '', fechaHasta = '', page = '1' } = await searchParams;
  const paginaActual = Math.max(1, Number(page));

  const fechaFiltro = buildFechaFiltro(fechaDesde, fechaHasta);

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
      skip: (paginaActual - 1) * EVENTOS_POR_PAGINA,
      take: EVENTOS_POR_PAGINA,
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

  const totalPaginas = Math.ceil(total / EVENTOS_POR_PAGINA);

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
            <CalendarDays className="w-3 h-3" /> Eventos
          </span>
          <h1 className="font-display text-3xl md:text-5xl leading-none mt-2" style={{ color: 'var(--color-primary)' }}>
            Eventos
          </h1>
          <p className="text-sm font-body font-medium mt-1" style={{ color: 'var(--color-primary)', opacity: 0.9 }}>
            Todos los eventos de la plataforma
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="h-12 w-full rounded-[16px] bg-[#eadfd2] animate-pulse" />}>
        <FiltrosEventos organizadores={organizadores} />
      </Suspense>

      <ResultadosFiltro
        total={total}
        // Si hay algún filtro activo (search, categoria, organizador o fecha), muestro el mensaje de resultados encontrados. Si no hay filtros, no muestro nada.
        hayFiltros={!!(search || categoria || organizador || fechaDesde || fechaHasta)}
      />

      <div className="border border-[#eadfd2] bg-[#fdf9f2] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto sm:overflow-x-visible px-3 no-scrollbar">
          <TablaEventosAdmin eventos={eventos} />
        </div>
        <Suspense fallback={<div className="h-10 w-full rounded-b-[20px] bg-[#eadfd2] animate-pulse" />}>
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

