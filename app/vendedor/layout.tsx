import { getOrCreateOrganizador } from "@/app/lib/actions/organizadores";
import SidebarVendedor from "@/app/ui/vendedor/sidebarVendedor";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getOrCreateOrganizador();

  return (
    <div className="flex flex-1">
      <SidebarVendedor />
      <main className="flex-1 bg-slate-50">
        {children}
      </main>
    </div>
  );
}