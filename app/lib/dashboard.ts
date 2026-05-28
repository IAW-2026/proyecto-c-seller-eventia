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
      where: pedidosWhere,
      _sum: { cantEntradas: true, monto: true },
    }),
    prisma.pedidos.count({ where: { ...pedidosWhere, estado: 'PENDIENTE' } }),
    prisma.pedidos.groupBy({
      by: ['idEvento'],
      where: { ...pedidosWhere, idEvento: { not: null } },
      _sum: { cantEntradas: true, monto: true },
      orderBy: { _sum: { monto: 'desc' } },
      take: 3,
    }),
    prisma.pedidos.findMany({
      where: pedidosWhere,
      select: { cantEntradas: true, evento: { select: { categoria: true } } },
    }),
    prisma.pedidos.findMany({
      where: pedidosWhere,
      orderBy: { createdAt: 'desc' },
      take: 4,
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
      monto: Number(p._sum.monto ?? 0),
      entradas: Number(p._sum.cantEntradas ?? 0),
    };
  });

  // Agrupar entradas por categoría y calcular porcentajes
  const categoriaMap = new Map<string, number>();
  for (const p of pedidosConCategoria) {
    const cat = p.evento?.categoria ?? 'Otro';
    categoriaMap.set(cat, (categoriaMap.get(cat) ?? 0) + (p.cantEntradas ?? 0));
  }
  const totalTickets = [...categoriaMap.values()].reduce((a, b) => a + b, 0);
  const categoriaStats = [...categoriaMap.entries()]
    .map(([categoria, tickets]) => ({
      categoria,
      tickets,
      porcentaje: totalTickets > 0 ? Math.round((tickets / totalTickets) * 100) : 0,
    }))
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 4);

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
