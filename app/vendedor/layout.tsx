import { getOrCreateOrganizador } from "@/app/lib/actions/organizadores";
import AuthShell from "@/app/ui/authShell";
import SidebarVendedor from "@/app/ui/vendedor/sidebarVendedor";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getOrCreateOrganizador();

  return (
    <AuthShell sidebar={<SidebarVendedor />}>{children}</AuthShell>
  );
}