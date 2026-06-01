import { currentUser, type User } from '@clerk/nextjs/server';
import { esAdmin } from '@/app/lib/rolesAdmin'; // función pura compartida con cliente

// función servidor: obtiene el usuario actual si no se pasa uno
export async function isAdmin(user?: User | null) {
  const u = user ?? await currentUser();
  if (!u) return false;
  return esAdmin(u.publicMetadata as Record<string, unknown>);
}