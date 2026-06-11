import MetricCards from './metricCards';
import TopEventos from './topEventos';
import CategoriaVentas from './categoriaVentas';
import PedidosRecientes from './pedidosRecientes';
import type { DashboardData } from '@/app/lib/dashboard';

type Props = DashboardData & {
  displayName: string;
  subtitulo: string;
};

export default function PantallaReportes({ displayName, subtitulo, metrics, topEventos, categoriaStats, pedidosRecientes }: Props) {
  return (
    <div className="space-y-6 bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-4 pt-1 sm:mb-5">
        <h1 className="font-display text-[30px] leading-tight tracking-[-0.02em] text-[#8b1010] sm:text-[38px]">
          Bienvenido/a, {displayName}
        </h1>
        <p className="font-label ml-1 mt-1 w-fit text-[12px] leading-[1.4] text-[#9a444a]">{subtitulo}</p>
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

