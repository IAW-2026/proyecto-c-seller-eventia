'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';

export async function getOrCreateOrganizador() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No autorizado');
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const nombre = user.firstName ?? null;
  const apellido = user.lastName ?? null;
  const email = user.emailAddresses[0]?.emailAddress ?? null;

  const organizador = await prisma.organizadores.upsert({
    where: { idOrganizador: userId },
    update: {
      nombreOrganizador: nombre,
      mail: email,
    },
    create: {
      idOrganizador: userId,
      nombreOrganizador: nombre,
      mail: email,
    },
  });

  return {
    ...organizador,
    nombre,
    apellido,
    email,
  };
}

export const ensureOrganizador = getOrCreateOrganizador;