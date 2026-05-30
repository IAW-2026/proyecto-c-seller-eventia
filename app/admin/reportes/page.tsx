import { currentUser } from '@clerk/nextjs/server';
import { getDashboardData } from '@/app/lib/dashboard';
import MetricCards from '@/app/ui/dashboard/metricCards';
import TopEventos from '@/app/ui/dashboard/topEventos';
import SalesCategory from '@/app/ui/dashboard/salesCategory';
import PedidosRecientes from '@/app/ui/dashboard/pedidosRecientes';
// Sin filtros → getDashboardData devuelve datos globales de toda la plataforma
export default async function ReportesPage() {
  const user = await currentUser();
  const displayName = user?.firstName ?? user?.fullName ?? user?.username ?? 'usuario';
  const { metrics, topEventos, categoriaStats, pedidosRecientes } = await getDashboardData();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido/a, {displayName}</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen global de la plataforma</p>
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
