type Pedido = {
  idPedido: number;
  monto: number;
  estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
  createdAt: Date;
  evento: { nombreEvento: string | null } | null;
};

const estadoStyles = {
  PENDIENTE: 'bg-[#fdf5e0] text-[#b07a10]',
  PAGADO: 'bg-[#eaf5e8] text-[#3a7a2a]',
  CANCELADO: 'bg-[#fdf0f0] text-[var(--color-primary-vivid)]',
};

const estadoLabel = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Completado',
  CANCELADO: 'Cancelado',
};

export default function PedidosRecientes({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <div className="rounded-xl border border-[#e8ddd5] bg-white p-5">
      <h2 className="text-[13px] font-semibold text-[#1a0a0a]">Todos los pedidos</h2>
      <p className="mb-4 text-[11px] text-[#a08078]">Transacciones de tus eventos según el alcance del reporte</p>

      {pedidos.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#a08078]">Sin pedidos aún</p>
      ) : (
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-[#f0e8e0] text-[11px] uppercase tracking-[0.05em] text-[#a08078]">
              <th className="pb-3 text-left font-medium">ID</th>
              <th className="pb-3 text-left font-medium">Evento</th>
              <th className="pb-3 text-left font-medium">Fecha</th>
              <th className="pb-3 text-right font-medium">Monto</th>
              <th className="pb-3 text-right font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.idPedido} className="border-b border-[#f0e8e0] last:border-b-0">
                <td className="py-3 font-mono text-[#a08078]">#{p.idPedido}</td>
                <td className="py-3 text-[#3a1a15]">{p.evento?.nombreEvento ?? '—'}</td>
                <td className="py-3 text-[#a08078]">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right font-semibold text-[var(--color-primary-vivid)]">
                  ${p.monto.toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  <span className={`inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${estadoStyles[p.estado]}`}>
                    {estadoLabel[p.estado]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
