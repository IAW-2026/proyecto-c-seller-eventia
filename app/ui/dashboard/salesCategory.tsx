type CategoriaStats = {
  categoria: string;
  tickets: number;
  porcentaje: number;
};

const COLORES = [
  { fill: '#8B1010', text: '#8B1010' },
  { fill: '#d4848a', text: '#d4848a' },
  { fill: '#e8a898', text: '#e8a898' },
  { fill: '#c0706a', text: '#c0706a' },
];

export default function SalesCategory({ categorias }: { categorias: CategoriaStats[] }) {
  return (
    <div className="rounded-xl border border-[#e8ddd5] bg-white p-5">
      <h2 className="text-[13px] font-semibold text-[#1a0a0a]">Categorías</h2>
      <p className="mb-4 text-[11px] text-[#a08078]">Distribución de entradas vendidas</p>

      {categorias.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#a08078]">Sin datos aún</p>
      ) : (
        <div className="space-y-3">
          {categorias.map(({ categoria, porcentaje }, i) => (
            <div key={categoria}>
              <div className="mb-1 flex justify-between text-[12px]">
                <span className="font-medium text-[#5a3a35]">{categoria}</span>
                <span style={{ color: COLORES[i % COLORES.length].text, fontWeight: 600 }}>{porcentaje}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#f0e8e0]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${porcentaje}%`,
                    backgroundColor: COLORES[i % COLORES.length].fill,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
