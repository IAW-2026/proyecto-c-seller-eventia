import FormularioEventoVendedor from '@/app/ui/formularioEventoVendedor';
import prisma from '@/app/lib/prisma';

export default async function NuevoEventoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string; idEvento?: string }>;
}) {
  const { modo, idEvento } = await searchParams;

  // Si viene con ?modo=editar&idEvento=X, cargamos el evento existente para editar
  const eventoInicial =
    modo === 'editar' && idEvento
      ? await prisma.eventos.findUnique({ where: { idEvento: Number(idEvento) } })
      : null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {modo === 'editar' ? 'Editar Evento' : 'Crear Evento'}
      </h1>
      <FormularioEventoVendedor eventoInicial={eventoInicial} />
    </div>
  );
}
