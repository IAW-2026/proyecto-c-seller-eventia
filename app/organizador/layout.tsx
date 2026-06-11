import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin';
import { getOrCreateOrganizador } from '@/app/lib/actions/organizadores';
import PlantillaAuth from '@/app/_componentes/plantillaAuth';
import SidebarVendedor from '@/app/organizador/_componentes/sidebarVendedor';
import { Suspense } from 'react';

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  // auth() es solo decode de JWT - no hace llamadas a red
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <PlantillaAuth sidebar={
      <Suspense fallback={<div className="w-full h-full" />}>
        <SidebarConDatos />
      </Suspense>
    }>
      {children}
    </PlantillaAuth>
  );
}

// currentUser() y getOrCreateOrganizador corren en paralelo dentro de Suspense
// para no bloquear el render del layout ni de sus hijos
async function SidebarConDatos() {
  const [user] = await Promise.all([
    currentUser(),
    getOrCreateOrganizador(),
  ]);
  const admin = await isAdmin(user);
  return <SidebarVendedor esAdmin={admin} />;
}
