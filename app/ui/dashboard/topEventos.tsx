import { Trophy } from 'lucide-react';

type TopEvento = {
  idEvento: number;
  nombreEvento: string;
  categoria: string;
  monto: number;
  entradas: number;
};

export default function TopEventos({ eventos }: { eventos: TopEvento[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={18} className="text-amber-500" />
        <h2 className="font-semibold text-slate-800">Top Eventos</h2>
        <span className="text-xs text-slate-400 ml-1">por recaudación</span>
      </div>

      {eventos.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Sin datos aún</p>
      ) : (
        <div className="space-y-4">
          {eventos.map((e, i) => (
            <div key={e.idEvento} className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{e.nombreEvento}</p>
                <p className="text-xs text-slate-400">{e.categoria}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-slate-900">${e.monto.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{e.entradas} entradas</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
