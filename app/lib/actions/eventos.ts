'use server';

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateOrganizador } from "@/app/lib/actions/organizadores";
import { isAdmin } from "@/app/lib/admin";

export async function upsertEventoAction(idEvento: number | null, data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const admin = await isAdmin();

  const organizador = await getOrCreateOrganizador();
  const payload = {
    nombreEvento: data.nombreEvento,
    descripcion: data.descripcion,
    fecha: data.fecha ? new Date(`${data.fecha}T${data.hora ?? '00:00'}`) : null,
    ubicacion: [data.direccion, data.ciudad].filter(Boolean).join(', ') || null,
    stock: data.stock ? Number(data.stock) : null,
    precio: data.precio ? Number(data.precio) : null,
    idOrganizador: organizador.idOrganizador,
  };

  try {
    if (idEvento) {
      // comprobar que el usuario sea admin o propietario del evento
      const existing = await prisma.eventos.findUnique({ where: { idEvento } });
      if (!existing) throw new Error("Evento no encontrado");
      if (!admin && existing.idOrganizador !== userId) throw new Error("No autorizado a editar este evento");

      await prisma.eventos.update({ where: { idEvento }, data: payload });
    } else {
      await prisma.eventos.create({ data: payload });
    }
  } catch (error) {
    console.error("Error en Server Action:", error);
    return { error: "No se pudo guardar el evento" };
  }

  revalidatePath('/vendedor/eventos');
  redirect('/vendedor/eventos');
}

export async function deleteEventoAction(idEvento: number) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "No autorizado" };

    const admin = await isAdmin();

    const existing = await prisma.eventos.findUnique({ where: { idEvento } });
    if (!existing) return { error: "Evento no encontrado" };
    if (!admin && existing.idOrganizador !== userId) return { error: "No autorizado a eliminar este evento" };

    await prisma.eventos.delete({ where: { idEvento } });
    revalidatePath('/vendedor/eventos');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return { error: "No se pudo eliminar el evento" };
  }
}