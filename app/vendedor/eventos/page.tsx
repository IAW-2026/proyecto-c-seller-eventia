import prisma from '@/app/lib/prisma';
import TablaEventos from '@/app/ui/tablaEventos';
import Buscador from '@/app/ui/buscador';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin';

// searchParams es una Promise en Next.js 16 — hay que awaitearla
export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const admin = await isAdmin();

  // Extraemos el valor de búsqueda de la URL (?search=algo)
  // Si no hay nada escrito, por defecto es string vacío
  //espero a que llegue el valor real
  const { search = '' } = await searchParams;

  // Construimos el filtro de Prisma dinámicamente:
  // - Si es admin, ve todos los eventos (sin filtro de organizador)
  // - Si es vendedor normal, solo ve los suyos
  // - Si hay búsqueda activa, agrega el filtro por nombre (contains = "contiene", insensitive = ignora mayúsculas)
  const where = {
    ...(admin ? {} : { idOrganizador: userId }),
    ...(search ? { nombreEvento: { contains: search, mode: 'insensitive' as const } } : {}),
  };

  const eventos = await prisma.eventos.findMany({ where });

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-semibold">
        {admin ? 'Todos los eventos' : 'Mis Eventos'}
      </h2>

      {/* Barra de búsqueda — al hacer submit actualiza la URL con ?search=valor
          lo que hace que esta página se re-ejecute en el servidor con el nuevo filtro */}
      <div className="mb-6">
        <Buscador
          basePath="/vendedor/eventos"
          placeholder="Buscar por nombre..."
          searchActual={search}
        />
      </div>

      {/* Si hay búsqueda activa, mostramos cuántos resultados encontró */}
      {search && (
        <p className="mb-4 text-sm text-slate-500">
          {eventos.length === 0
            ? `Sin resultados para "${search}"`
            : `${eventos.length} resultado${eventos.length !== 1 ? 's' : ''} para "${search}"`}
        </p>
      )}

      <TablaEventos eventos={eventos as any} />
    </div>
  );
}
