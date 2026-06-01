import prisma from '@/app/lib/prisma';

// Tipos de retorno del helper
type MetricData = {
  totalEventos: number;
  ticketsSold: number;
  totalRevenue: number;
  pedidosPendientes: number;
};

type TopEvento = {
  idEvento: number;
  nombreEvento: string;
  categoria: string;
  monto: number;
  entradas: number;
};

type CategoriaStats = {
  categoria: string;
  tickets: number;
  porcentaje: number;
};

type PedidoReciente = {
  idPedido: number;
  monto: number;
  estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
  createdAt: Date;
  evento: { nombreEvento: string | null } | null;
};

export type DashboardData = {
  metrics: MetricData;
  topEventos: TopEvento[];
  categoriaStats: CategoriaStats[];
  pedidosRecientes: PedidoReciente[];
};

// Acepta filtros opcionales — sin filtros devuelve datos globales (para admin)
// Con filtros devuelve solo los datos del organizador (para vendedor)
export async function getDashboardData(
  pedidosWhere: { idOrganizador?: string } = {},
  eventosWhere: { idOrganizador?: string } = {}
): Promise<DashboardData> {
  const [
    totalEventos,
    pedidosStats,
    pedidosPendientes,
    topPedidosRaw,
    pedidosConCategoria,
    pedidosRecientes,
  ] = await Promise.all([
    prisma.eventos.count({ where: eventosWhere }),
    prisma.pedidos.aggregate({
      where: { ...pedidosWhere, estado: 'PAGADO' },
      _sum: { cantEntradas: true, monto: true },
    }),
    prisma.pedidos.count({ where: { ...pedidosWhere, estado: 'PENDIENTE' } }),
    prisma.pedidos.groupBy({
      by: ['idEvento'],
      where: { ...pedidosWhere, estado: 'PAGADO' },
      _sum: { cantEntradas: true, monto: true },
      orderBy: { _sum: { monto: 'desc' } },
      take: 3,
    }),
    pedidosWhere.idOrganizador
      ? prisma.$queryRaw<{ categoria: string | null; tickets: bigint }[]>`
          SELECT e.categoria, COALESCE(SUM(p."cantEntradas"), 0) AS tickets
          FROM "pedidos" p
          JOIN "eventos" e ON p."idEvento" = e."idEvento"
          WHERE p."idOrganizador" = ${pedidosWhere.idOrganizador}
            AND p.estado = 'PAGADO'
          GROUP BY e.categoria
          ORDER BY tickets DESC
          LIMIT 4`
      : prisma.$queryRaw<{ categoria: string | null; tickets: bigint }[]>`
          SELECT e.categoria, COALESCE(SUM(p."cantEntradas"), 0) AS tickets
          FROM "pedidos" p
          JOIN "eventos" e ON p."idEvento" = e."idEvento"
          WHERE p.estado = 'PAGADO'
          GROUP BY e.categoria
          ORDER BY tickets DESC
          LIMIT 4`,
    prisma.pedidos.findMany({
      where: pedidosWhere,
      orderBy: { createdAt: 'desc' },
      select: {
        idPedido: true,
        monto: true,
        estado: true,
        createdAt: true,
        evento: { select: { nombreEvento: true } },
      },
    }),
  ]);

  // groupBy solo devuelve IDs, buscamos nombre y categoría de cada evento del top 3
  const topEventIds = topPedidosRaw.map((p) => p.idEvento).filter(Boolean) as number[];
  const topEventosInfo = await prisma.eventos.findMany({
    where: { idEvento: { in: topEventIds } },
    select: { idEvento: true, nombreEvento: true, categoria: true },
  });
  const topEventos = topPedidosRaw.map((p) => {
    const info = topEventosInfo.find((e) => e.idEvento === p.idEvento);
    return {
      idEvento: p.idEvento!,
      nombreEvento: info?.nombreEvento ?? '',
      categoria: info?.categoria ?? '',
      monto: Number(p._sum?.monto ?? 0),
      entradas: Number(p._sum?.cantEntradas ?? 0),
    };
  });

  // Calcular porcentajes sobre el resultado ya agrupado por la DB
  const totalTickets = pedidosConCategoria.reduce((a, b) => a + Number(b.tickets), 0);
  const categoriaStats = pedidosConCategoria.map(({ categoria, tickets }) => ({
    categoria: categoria ?? 'Otro',
    tickets: Number(tickets),
    porcentaje: totalTickets > 0 ? Math.round((Number(tickets) / totalTickets) * 100) : 0,
  }));

  return {
    metrics: {
      totalEventos,
      ticketsSold: Number(pedidosStats._sum.cantEntradas ?? 0),
      totalRevenue: Number(pedidosStats._sum.monto ?? 0),
      pedidosPendientes,
    },
    topEventos,
    categoriaStats,
    pedidosRecientes,
  };
}
