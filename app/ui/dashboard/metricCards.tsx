import { CalendarDays, Ticket, DollarSign, Clock } from 'lucide-react';

type Props = {
  totalEventos: number;
  ticketsSold: number;
  totalRevenue: number;
  pedidosPendientes: number;
};

const cards = (p: Props) => [
  {
    label: 'Total eventos',
    value: p.totalEventos,
    icon: CalendarDays,
    bar: '#d4848a',
    iconClass: 'bg-[#fdf0f0] text-[#8B1010]',
  },
  {
    label: 'Entradas vendidas',
    value: p.ticketsSold.toLocaleString(),
    icon: Ticket,
    bar: '#8B1010',
    iconClass: 'bg-[#f5e8e4] text-[#8B1010]',
  },
  {
    label: 'Recaudación total',
    value: `$${p.totalRevenue.toLocaleString()}`,
    icon: DollarSign,
    bar: '#c0706a',
    iconClass: 'bg-[#fdf5f0] text-[#c0706a]',
  },
  {
    label: 'Pedidos pendientes',
    value: p.pedidosPendientes,
    icon: Clock,
    bar: '#e8a898',
    iconClass: 'bg-[#fdf0ec] text-[#e8a898]',
  },
];

export default function MetricCards(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards(props).map(({ label, value, icon: Icon, bar, iconClass }) => (
        <div key={label} className="relative overflow-hidden rounded-xl border border-[#e8ddd5] bg-white p-4 pr-12">
          <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: bar }} />
          <div className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
            <Icon size={16} />
          </div>
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.06em] text-[#a08078]">{label}</p>
            <p className="text-[22px] font-bold leading-none text-[#1a0a0a]">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
