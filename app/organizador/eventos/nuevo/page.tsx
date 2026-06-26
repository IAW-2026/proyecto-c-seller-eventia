import prisma from '@/app/lib/prisma';
import FormularioEventoClient from '@/app/_componentes/formularioEventoVendedor';

export default async function NuevoEventoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Obtenemos los parámetros de la URL
  const { idEvento, modo } = await searchParams;
  const idNum = idEvento ? Number(idEvento) : null;

  let eventoInicial = null;

  // SI aprietas modificar, la URL tendrá modo=editar e idEvento.
  // Entonces buscamos en la base de datos antes de mostrar el formulario.
  if (modo === 'editar' && idNum) {
    eventoInicial = await prisma.eventos.findUnique({
      where: { idEvento: idNum },
    });
  }

  // Si es una creación nueva, eventoInicial es null y el form aparece vacío.
  // Si es edición, le pasamos los datos y el form aparece lleno.
  return (
    <FormularioEventoClient eventoInicial={eventoInicial} />
  );
}