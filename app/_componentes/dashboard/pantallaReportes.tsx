import MetricCards from './metricCards';
import TopEventos from './topEventos';
import CategoriaVentas from './categoriaVentas';
import PedidosRecientes from './pedidosRecientes';
import type { DashboardData } from '@/app/lib/dashboard';
import { BarChart2 } from 'lucide-react';

type Props = DashboardData & {
  displayName: string;
  subtitulo: string;
};

export default function PantallaReportes({ displayName, subtitulo, metrics, topEventos, categoriaStats, pedidosRecientes }: Props) {
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
            <BarChart2 className="w-3 h-3" /> Reportes
          </span>
          <h1 className="font-display text-xl sm:text-3xl md:text-5xl leading-none mt-2" style={{ color: 'var(--color-primary)' }}>
            Bienvenido/a, {displayName}
          </h1>
          <p className="text-sm font-body font-medium mt-1" style={{ color: 'var(--color-primary)', opacity: 0.9 }}>
            {subtitulo}
          </p>
        </div>
      </div>

      <MetricCards {...metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopEventos eventos={topEventos} />
        <CategoriaVentas categorias={categoriaStats} />
      </div>

      <PedidosRecientes pedidos={pedidosRecientes} />
    </div>
  );
}

