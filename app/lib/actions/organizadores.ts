'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';

export async function getOrCreateOrganizador() {
  const { userId } = await auth();
  if (!userId) throw new Error('No autorizado');

  // Si ya existe en la BD, evitamos las llamadas a la API de Clerk
  const existing = await prisma.organizadores.findUnique({
    where: { idOrganizador: userId },
  });
  if (existing) return existing;

  // Primera vez: obtener datos de Clerk, asignar rol y crear en la BD
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  const email = user.emailAddresses[0]?.emailAddress ?? null;
  // Fallback: si Google/Clerk no trae firstName, usamos username o la parte del email
  const nombre = user.firstName ?? user.username ?? email?.split('@')[0] ?? null;
  const apellido = user.lastName ?? null;

  const currentRoles = (user.publicMetadata.roles as string[]) || [];
  if (!currentRoles.includes('seller')) {
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { roles: [...currentRoles, 'seller'] },
    });
  }

  // upsert por si dos requests llegan al mismo tiempo para el mismo usuario
  return prisma.organizadores.upsert({
    where: { idOrganizador: userId },
    create: { idOrganizador: userId, nombreOrganizador: nombre, apellido, mail: email },
    update: { nombreOrganizador: nombre, apellido, mail: email },
  });
}
