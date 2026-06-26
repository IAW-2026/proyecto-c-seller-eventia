import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin';
import { getOrCreateOrganizador } from '@/app/lib/actions/organizadores';
import PlantillaAuth from '@/app/_componentes/plantillaAuth';
import SidebarVendedor from '@/app/organizador/_componentes/sidebarVendedor';
import CuentaDesactivada from '@/app/_componentes/cuentaDesactivada';
import { Suspense } from 'react';

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const organizador = await getOrCreateOrganizador();
  const desactivado = organizador?.activo === false;

  return (
    <PlantillaAuth sidebar={
      <Suspense fallback={<div className="w-full h-full" />}>
        <SidebarConDatos />
      </Suspense>
    }>
      {desactivado ? <CuentaDesactivada /> : children}
    </PlantillaAuth>
  );
}

async function SidebarConDatos() {
  const user = await currentUser();
  const admin = await isAdmin(user);
  return <SidebarVendedor esAdmin={admin} />;
}
