'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/app/lib/prisma';


/**
 * Definimos el rol que queremos asignar en Clerk.
 * Lo manejamos como metadata para aprovechar Clerk y no guardarlo en la BD.
 */

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
  
 //agrego el rol de seller a los usuarios que se crean desde esta función
  const currentRoles = (user.publicMetadata.roles as string[]) || [];
  if (!currentRoles.includes('seller')) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        roles: [...currentRoles, 'seller'],
      },
    });
  }
  
  const organizador = await prisma.organizadores.upsert({
    where: { idOrganizador: userId },
    update: {
      nombreOrganizador: nombre,
      apellido,
      mail: email,
    },
    create: {
      idOrganizador: userId,
      nombreOrganizador: nombre,
      apellido,
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