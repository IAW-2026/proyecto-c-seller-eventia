import { CalendarDays, Ticket, DollarSign, Clock } from 'lucide-react';

type Props = {
  totalEventos: number;
  ticketsSold: number;
  totalRevenue: number;
  pedidosPendientes: number;
};

const cards = (p: Props) => [
  { label: 'Total Eventos', value: p.totalEventos, icon: CalendarDays, color: 'text-blue-600 bg-blue-50' },
  { label: 'Entradas Vendidas', value: p.ticketsSold.toLocaleString(), icon: Ticket, color: 'text-violet-600 bg-violet-50' },
  { label: 'Recaudación Total', value: `$${p.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Pedidos Pendientes', value: p.pedidosPendientes, icon: Clock, color: 'text-orange-600 bg-orange-50' },
];

export default function MetricCards(props: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards(props).map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
