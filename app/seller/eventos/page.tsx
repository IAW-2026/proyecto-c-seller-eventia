import prisma from '@/app/lib/prisma';
import TablaEventos from '@/app/ui/tablaEventos';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin';

export default async function EventosPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const admin = await isAdmin();

  const eventos = admin
    ? await prisma.eventos.findMany()
    : await prisma.eventos.findMany({ where: { idOrganizador: userId } });

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-semibold">{admin ? 'Todos los eventos' : 'Mis Eventos'}</h2>
      <TablaEventos eventos={eventos as any} />
    </div>
  );
}