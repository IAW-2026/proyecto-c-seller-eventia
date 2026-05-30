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

  return <FormularioEventoVendedor eventoInicial={eventoInicial} />;
}
