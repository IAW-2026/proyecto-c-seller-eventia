'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { esAdmin } from '@/app/lib/rolesAdmin';

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

  return prisma.organizadores.create({
    data: {
      idOrganizador: userId,
      nombreOrganizador: nombre,
      apellido,
      mail: email,
      activo: true,
    },
  });
}

export async function activarOrganizador(idOrganizador: string) {
  await prisma.organizadores.update({
    where: { idOrganizador },
    data: { activo: true },
  });
  revalidatePath('/admin/organizadores');
  return { ok: true };
}

export async function desactivarOrganizador(idOrganizador: string) {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(idOrganizador);
    if (esAdmin(user.publicMetadata as Record<string, unknown>)) {
      return { ok: false, error: 'No se puede desactivar a un organizador con rol de administrador.' };
    }
  } catch {
    // Si el usuario no existe en Clerk, no es admin — se permite continuar
  }

  const pedidosPagados = await prisma.pedidos.count({
    where: { idOrganizador, estado: 'PAGADO' },
  });

  if (pedidosPagados > 0) {
    return { ok: false, error: 'El organizador tiene pedidos pagados asociados.' };
  }

  await prisma.organizadores.update({
    where: { idOrganizador },
    data: { activo: false },
  });

  revalidatePath('/admin/organizadores');
  return { ok: true };
}
