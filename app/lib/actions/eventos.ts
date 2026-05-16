'use server';

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateOrganizador } from "@/app/lib/actions/organizadores";

export async function upsertEventoAction(idEvento: number | null, data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  // Creamos o actualizamos el organizador local a partir de Clerk
  const organizador = await getOrCreateOrganizador();

  const payload = {
    nombreEvento: data.nombreEvento,
    descripcion: data.descripcion,
    fecha: data.fecha ? new Date(data.fecha) : null,
    ubicacion: data.ubicacion,
    stock: data.stock ? Number(data.stock) : null,
    precio: data.precio ? Number(data.precio) : null,
    idOrganizador: organizador.idOrganizador, // Asignamos la llave foránea
  };

  try {
    if (idEvento) {
      // Lógica de edición
      await prisma.eventos.update({
        where: { idEvento },
        data: payload,
      });
    } else {
      // Lógica de creación
      await prisma.eventos.create({
        data: payload,
      });
    }
  } catch (error) {
    console.error("Error en Server Action:", error);
    return { error: "No se pudo guardar el evento" };
  }

  // Limpiar caché para que la lista se actualice y volver atrás
  revalidatePath('/seller/eventos'); // Esto avisa a Next.js que los datos cambiaron
  redirect('/seller/eventos');       // Esto saca al usuario del formulario
}


export async function deleteEventoAction(idEvento: number) {
  try {
    await prisma.eventos.delete({
      where: { idEvento },
    });
    revalidatePath('/seller/eventos');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return { error: "No se pudo eliminar el evento" };
  }
}
