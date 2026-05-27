import { isAdmin } from '@/app/lib/admin';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/');
  return <>{children}</>;
}
