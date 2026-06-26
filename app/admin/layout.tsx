import { isAdmin } from '@/app/lib/admin';
import { forbidden } from 'next/navigation';
import { getOrCreateOrganizador } from '@/app/lib/actions/organizadores';
import PlantillaAuth from '@/app/_componentes/plantillaAuth';
import SidebarVendedor from '@/app/organizador/_componentes/sidebarVendedor';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) forbidden();
  await getOrCreateOrganizador();

  return (
    <PlantillaAuth sidebar={<SidebarVendedor esAdmin />}>{children}</PlantillaAuth>
  );
}
