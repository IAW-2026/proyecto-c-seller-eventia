import { isAdmin } from '@/app/lib/admin';
import { redirect } from 'next/navigation';
import SidebarAdmin from '@/app/ui/admin/sidebarAdmin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/');

  return (
    <div className="flex flex-1">
      <SidebarAdmin />
      <main className="flex-1 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
