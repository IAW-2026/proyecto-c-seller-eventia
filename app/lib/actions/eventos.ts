'use server';

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/app/lib/admin";
import { type FormValues } from "@/app/_componentes/formularioEvento";
import { TZ_OFFSET } from "@/app/lib/constants";

export async function upsertEventoAction(idEvento: number | null, data: FormValues, imagenes: string[] = []) {
  const user = await currentUser();
  if (!user) throw new Error("No autorizado");
  const userId = user.id;
  const admin = await isAdmin(user);

  if (!data.nombreEvento?.trim()) return { error: "El nombre del evento es obligatorio" };
  if (!data.fecha) return { error: "La fecha es obligatoria" };
  if (!data.hora) return { error: "La hora es obligatoria" };
  if (!data.direccion?.trim()) return { error: "La dirección es obligatoria" };
  if (!data.ciudad?.trim()) return { error: "La ciudad es obligatoria" };
  if (data.stock === null || data.stock === undefined || isNaN(data.stock)) return { error: "La capacidad es obligatoria" };
  if (data.precio === null || data.precio === undefined || isNaN(data.precio)) return { error: "El precio es obligatorio" };

  const camposEvento = {
    nombreEvento: data.nombreEvento,
    descripcion: data.descripcion,
    fecha: new Date(`${data.fecha}T${data.hora}:00${TZ_OFFSET}`),
    ubicacion: `${data.direccion}, ${data.ciudad}`,
    stock: data.stock,
    precio: data.precio,
    categoria: data.categoria,
    imagenes,
  };

  try {
    if (idEvento) {
      // comprobar que el usuario sea admin o propietario del evento
      const existing = await prisma.eventos.findUnique({ where: { idEvento } });
      if (!existing) throw new Error("Evento no encontrado");
      if (!admin && existing.idOrganizador !== userId) throw new Error("No autorizado a editar este evento");

      // no se incluye idOrganizador para no sobreescribir al dueño original
      await prisma.eventos.update({ where: { idEvento }, data: camposEvento });
    } else {
      await prisma.eventos.create({ data: { ...camposEvento, idOrganizador: userId } });
    }
  } catch (error) {
    console.error("Error en Server Action:", error);
    return { error: "No se pudo guardar el evento" };
  }

  revalidatePath('/organizador/eventos');
  revalidatePath('/admin/eventos');
  redirect('/organizador/eventos');
}

export async function deleteEventoAction(idEvento: number) {
  try {
    const user = await currentUser();
    if (!user) return { error: "No autorizado" };
    const userId = user.id;

    const admin = await isAdmin(user);

    const existing = await prisma.eventos.findUnique({ where: { idEvento } });
    if (!existing) return { error: "Evento no encontrado" };
    if (!admin && existing.idOrganizador !== userId) return { error: "No autorizado a eliminar este evento" };

    const pedidosCount = await prisma.pedidos.count({ where: { idEvento } });
    if (pedidosCount > 0) return { error: "No se puede eliminar un evento que tiene pedidos asociados" };

    await prisma.eventos.delete({ where: { idEvento } });
    revalidatePath('/organizador/eventos');
    revalidatePath('/admin/eventos');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return { error: "No se pudo eliminar el evento" };
  }
}