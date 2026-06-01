import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { getDashboardData } from '@/app/lib/dashboard';
import PantallaReportes from '@/app/_componentes/dashboard/pantallaReportes';

export const metadata: Metadata = { title: 'Reportes globales — Eventia' };

export default async function ReportesPage() {
  const [user, datos] = await Promise.all([
    currentUser(),
    getDashboardData(),
  ]);
  const displayName = user?.firstName ?? user?.fullName ?? user?.username ?? 'usuario';

  return (
    <PantallaReportes
      {...datos}
      displayName={displayName}
      subtitulo="Resumen global de la plataforma"
    />
  );
}
