type CategoriaStats = {
  categoria: string;
  tickets: number;
  porcentaje: number;
};

const COLORES = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-400'];

export default function SalesCategory({ categorias }: { categorias: CategoriaStats[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-semibold text-slate-800 mb-1">Sales Category</h2>
      <p className="text-xs text-slate-400 mb-5">Distribución de entradas vendidas</p>

      {categorias.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Sin datos aún</p>
      ) : (
        <div className="space-y-4">
          {categorias.map(({ categoria, porcentaje }, i) => (
            <div key={categoria}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 font-medium">{categoria}</span>
                <span className="text-slate-500">{porcentaje}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${COLORES[i % COLORES.length]}`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
