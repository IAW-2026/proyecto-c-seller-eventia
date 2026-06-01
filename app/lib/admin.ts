import { currentUser, type User } from '@clerk/nextjs/server';

export async function isAdmin(user?: User | null) {
  const u = user ?? await currentUser();
  if (!u) return false;
  return u.publicMetadata?.role === 'adminSeller';
}