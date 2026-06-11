import { ptSerif } from '@/app/_componentes/fonts';

type Organizador = {
  idOrganizador: string;
  nombreOrganizador: string | null;
  apellido: string | null;
  mail: string | null;
  _count: { eventos: number; pedidos: number };
};

export default function TablaOrganizadores({ organizadores }: { organizadores: Organizador[] }) {
  return (
    <table className="min-w-[600px] w-full table-fixed bg-transparent text-[11px]">
      <colgroup>
        <col className="w-[20%]" />
        <col className="w-[20%]" />
        <col className="w-[34%]" />
        <col className="w-[13%]" />
        <col className="w-[13%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-[#eadfd2] text-[11px] uppercase tracking-[0.12em] text-[#b38c7d]">
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Nombre</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Apellido</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Mail</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Eventos</th>
          <th className="px-2 py-3 text-center font-label whitespace-nowrap">Pedidos</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#ebdfd4]">
        {organizadores.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-12 text-center text-[#9b8074]">
              No hay organizadores.
            </td>
          </tr>
        ) : (
          organizadores.map((org) => (
            <tr key={org.idOrganizador} className="transition hover:bg-[#ffe8e8]/40">
              <td className={`truncate px-2 py-3 text-center text-[11px] font-semibold text-[var(--color-primary)] ${ptSerif.className}`}>
                {org.nombreOrganizador ?? '—'}
              </td>
              <td className="truncate px-2 py-3 text-center text-[11px] text-[#6f5a50]">
                {org.apellido ?? '—'}
              </td>
              <td className="truncate px-2 py-3 text-center text-[11px] text-[#6f5a50]">
                {org.mail ?? '—'}
              </td>
              <td className="px-2 py-3 text-center text-[11px] text-[#6f5a50]">
                {org._count.eventos}
              </td>
              <td className="px-2 py-3 text-center text-[11px] text-[#6f5a50]">
                {org._count.pedidos}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
