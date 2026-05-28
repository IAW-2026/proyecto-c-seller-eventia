type Pedido = {
  idPedido: number;
  monto: number;
  estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
  createdAt: Date;
  evento: { nombreEvento: string | null } | null;
};

const estadoStyles = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  PAGADO: 'bg-emerald-100 text-emerald-700',
  CANCELADO: 'bg-red-100 text-red-700',
};

export default function PedidosRecientes({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-semibold text-slate-800 mb-1">Pedidos Recientes</h2>
      <p className="text-xs text-slate-400 mb-5">Las últimas transacciones de tus eventos</p>

      {pedidos.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Sin pedidos aún</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
              <th className="text-left pb-3">ID</th>
              <th className="text-left pb-3">Evento</th>
              <th className="text-left pb-3">Fecha</th>
              <th className="text-right pb-3">Monto</th>
              <th className="text-right pb-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pedidos.map((p) => (
              <tr key={p.idPedido}>
                <td className="py-3 text-slate-400 font-mono">#{p.idPedido}</td>
                <td className="py-3 text-slate-700">{p.evento?.nombreEvento ?? '—'}</td>
                <td className="py-3 text-slate-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right font-semibold text-slate-900">
                  ${p.monto.toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoStyles[p.estado]}`}>
                    {p.estado}
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
