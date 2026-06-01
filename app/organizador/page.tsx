import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDashboardData } from '@/app/lib/dashboard';
import PantallaReportes from '@/app/_componentes/dashboard/pantallaReportes';

export const metadata: Metadata = { title: 'Reportes' };

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const displayName = user.firstName ?? user.fullName ?? user.username ?? 'usuario';

  // Filtra por el usuario logueado — los reportes globales están en /admin/reportes
  const datos = await getDashboardData({ idOrganizador: user.id }, { idOrganizador: user.id });

  return (
    <PantallaReportes
      {...datos}
      displayName={displayName}
      subtitulo="Resumen de tu actividad y ventas"
    />
  );
}
