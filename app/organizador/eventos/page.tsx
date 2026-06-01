import type { Metadata } from 'next';
import prisma from '@/app/lib/prisma';

export const metadata: Metadata = { title: 'Mis Eventos' };
import GaleriaEventos from '@/app/organizador/eventos/_componentes/galeriaEventos';
import FiltrosEventos from '@/app/_componentes/filtrosEventos';
import Paginacion from '@/app/_componentes/paginacion';
import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { EVENTOS_POR_PAGINA } from '@/app/lib/constants';
import { buildFechaFiltro } from '@/app/lib/utils';
import ResultadosFiltro from '@/app/_componentes/resultadosFiltro';

type SearchParams = Promise<{ search?: string; categoria?: string; fechaDesde?: string; fechaHasta?: string; page?: string }>;

// searchParams es una Promise en Next.js 16 - hay que awaitearla
export default async function EventosPage({ searchParams }: { searchParams: SearchParams }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  // El h1 se envia al navegador apenas termina auth, sin esperar las queries de DB
  return (
    <div className="space-y-6 bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-4 pt-1 sm:mb-5">
        <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#8b1010] sm:text-[38px]">
          Mis Eventos
        </h1>
        <p className="font-label ml-1 mt-1 w-fit text-[12px] leading-[1.4] text-[#9a444a]">
          Todos tus eventos publicados
        </p>
      </div>

      {/* FiltrosEventos sin organizadores - el select de organizador no aparece */}
      <Suspense fallback={<div className="h-12 w-full rounded-[16px] bg-[#eadfd2] animate-pulse" />}>
        <FiltrosEventos />
      </Suspense>

      <Suspense fallback={<SkeletonContenido />}>
        <ContenidoEventos userId={userId} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Skeleton para el area de resultados + galeria + paginacion mientras carga la DB
function SkeletonContenido() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-40 rounded-full bg-[#eadfd2] animate-pulse" />
      <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-[24px] bg-[#eadfd2] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente que hace las queries - se renderiza dentro del Suspense
async function ContenidoEventos({ userId, searchParams }: { userId: string; searchParams: SearchParams }) {
  const { search = '', categoria = '', fechaDesde = '', fechaHasta = '', page = '1' } = await searchParams;
  const paginaActual = Math.max(1, Number(page));

  const fechaFiltro = buildFechaFiltro(fechaDesde, fechaHasta);

  // Siempre filtra por el usuario logueado - el vendedor solo ve sus propios eventos
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
      skip: (paginaActual - 1) * EVENTOS_POR_PAGINA,
      take: EVENTOS_POR_PAGINA,
    }),
    prisma.eventos.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / EVENTOS_POR_PAGINA);

  return (
    <>
      <ResultadosFiltro
        total={total}
        hayFiltros={!!(search || categoria || fechaDesde || fechaHasta)}
      />
      <div className="rounded-[20px] border border-[#eadfd2] bg-[#f9f4ed] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="px-3 pt-3">
          <GaleriaEventos eventos={eventos as any} />
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
    </>
  );
}
