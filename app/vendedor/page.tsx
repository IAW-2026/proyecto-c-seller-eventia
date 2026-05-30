import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin';
import { getDashboardData } from '@/app/lib/dashboard';
import MetricCards from '@/app/ui/dashboard/metricCards';
import TopEventos from '@/app/ui/dashboard/topEventos';
import SalesCategory from '@/app/ui/dashboard/salesCategory';
import PedidosRecientes from '@/app/ui/dashboard/pedidosRecientes';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const displayName = user?.firstName ?? user?.fullName ?? user?.username ?? 'usuario';

  // Si es admin ve todo, si no filtra por su propio idOrganizador
  const admin = await isAdmin();
  const pedidosWhere = admin ? {} : { idOrganizador: userId };
  const eventosWhere = admin ? {} : { idOrganizador: userId };

  const { metrics, topEventos, categoriaStats, pedidosRecientes } =
    await getDashboardData(pedidosWhere, eventosWhere);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido/a, {displayName}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {admin ? 'Resumen global de la plataforma' : 'Resumen de tu actividad y ventas'}
        </p>
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
