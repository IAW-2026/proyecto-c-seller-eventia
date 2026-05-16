import prisma from '@/app/lib/prisma';
import TablaEventos from '@/app/ui/tablaEventos';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function EventosPage() {
  // Obtenemos el id del usuario autenticado con Clerk
  const { userId } = await auth();
  if (!userId) {
    // Si no está autenticado, redirigimos al sign-in de Clerk
    redirect('/sign-in');
  }

  // Filtramos los eventos por el id del organizador (userId)
  const eventos = await prisma.eventos.findMany({
    where: { idOrganizador: userId },
  });

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-semibold">Mis Eventos</h2>
      <TablaEventos eventos={eventos as any} />
    </div>
  );
}