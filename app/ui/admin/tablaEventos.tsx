type EventoAdmin = {
  idEvento: number;
  nombreEvento: string | null;
  precio: number | null;
  categoria: string | null;
  ubicacion: string | null;
  stock: number | null;
  fecha: Date | null;
  organizador: { nombreOrganizador: string | null; apellido: string | null } | null;
  _count: { pedidos: number };
};

export default function TablaEventosAdmin({ eventos }: { eventos: EventoAdmin[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-200">
          <th className="text-left px-4 py-3">Nombre</th>
          <th className="text-left px-4 py-3">Organizador</th>
          <th className="text-left px-4 py-3">Categoría</th>
          <th className="text-left px-4 py-3">Ubicación</th>
          <th className="text-left px-4 py-3">Fecha</th>
          <th className="text-right px-4 py-3">Precio</th>
          <th className="text-right px-4 py-3">Stock</th>
          <th className="text-right px-4 py-3">Pedidos</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {eventos.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
              No hay eventos.
            </td>
          </tr>
        ) : (
          eventos.map((e) => {
            const nombreOrg = e.organizador
              ? `${e.organizador.nombreOrganizador ?? ''} ${e.organizador.apellido ?? ''}`.trim()
              : '—';
            return (
              <tr key={e.idEvento} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800 font-medium">{e.nombreEvento ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{nombreOrg}</td>
                <td className="px-4 py-3 text-slate-500">{e.categoria ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{e.ubicacion ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">
                  {e.fecha ? new Date(e.fecha).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right text-slate-800">
                  ${e.precio?.toLocaleString() ?? '—'}
                </td>
                <td className="px-4 py-3 text-right text-slate-500">{e.stock ?? '—'}</td>
                <td className="px-4 py-3 text-right text-slate-500">{e._count.pedidos}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
