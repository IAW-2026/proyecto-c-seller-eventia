import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin';

export default async function AuthRedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const admin = await isAdmin();
  redirect(admin ? '/admin' : '/vendedor');
}