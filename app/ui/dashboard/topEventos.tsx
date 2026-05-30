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
    <div className="rounded-xl border border-[#e8ddd5] bg-white p-5">
      <div className="flex items-center gap-2 text-[#1a0a0a]">
        <Trophy size={16} className="text-[#d4848a]" />
        <h2 className="text-[13px] font-semibold">Top eventos</h2>
        <span className="ml-1 text-[11px] text-[#a08078]">por recaudación</span>
      </div>

      {eventos.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#a08078]">Sin datos aún</p>
      ) : (
        <div className="mt-4">
          {eventos.map((e, i) => (
            <div key={e.idEvento} className="flex items-center gap-3 border-b border-[#f0e8e0] py-3 last:border-b-0 last:pb-0">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f5e8e4] text-[10px] font-bold text-[#8B1010]">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium text-[#1a0a0a]">{e.nombreEvento}</p>
                <p className="text-[11px] text-[#a08078]">{e.categoria}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-semibold text-[#8B1010]">${e.monto.toLocaleString()}</p>
                <p className="text-[11px] text-[#a08078]">{e.entradas} entradas</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
