import { getDashboardData } from '@/app/lib/dashboard';
import MetricCards from '@/app/ui/dashboard/metricCards';
import TopEventos from '@/app/ui/dashboard/topEventos';
import SalesCategory from '@/app/ui/dashboard/salesCategory';
import PedidosRecientes from '@/app/ui/dashboard/pedidosRecientes';

// Sin filtros → getDashboardData devuelve datos globales de toda la plataforma
export default async function ReportesPage() {
  const { metrics, topEventos, categoriaStats, pedidosRecientes } = await getDashboardData();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Vista global de la plataforma</p>
      </div>

      <MetricCards {...metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopEventos eventos={topEventos} />
        <SalesCategory categorias={categoriaStats} />
      </div>

      <PedidosRecientes pedidos={pedidosRecientes} />
    </div>
  );
}
