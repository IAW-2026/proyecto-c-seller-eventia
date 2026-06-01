import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin';
import { getOrCreateOrganizador } from '@/app/lib/actions/organizadores';
import PlantillaAuth from '@/app/_componentes/plantillaAuth';
import SidebarVendedor from '@/app/organizador/_componentes/sidebarVendedor';

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const admin = await isAdmin(user);
  await getOrCreateOrganizador();

  return (
    <PlantillaAuth sidebar={<SidebarVendedor esAdmin={admin} />}>
      {children}
    </PlantillaAuth>
  );
}
