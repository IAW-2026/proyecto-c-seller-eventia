import { isAdmin } from '@/app/lib/admin';
import { redirect } from 'next/navigation';
import AuthShell from '@/app/ui/authShell';
import SidebarAdmin from '@/app/ui/admin/sidebarAdmin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/');

  return (
    <AuthShell sidebar={<SidebarAdmin />}>{children}</AuthShell>
  );
}
