import prisma from "@/app/lib/prisma";
import type { Prisma } from "@prisma/client";

export function buildCamposEvento(raw: {
  nombreEvento?: string | null;
  descripcion?: string | null;
  fecha?: string | Date | null;
  ubicacion?: string | null;
  stock?: number | null;
  precio?: number | null;
  categoria?: string | null;
  imagenes?: string[] | null;
}): Prisma.eventosUpdateInput {
  const campos: Prisma.eventosUpdateInput = {};
  if (raw.nombreEvento !== undefined) campos.nombreEvento = raw.nombreEvento;
  if (raw.descripcion !== undefined) campos.descripcion = raw.descripcion;
  if (raw.fecha !== undefined && raw.fecha !== null) campos.fecha = raw.fecha instanceof Date ? raw.fecha : new Date(raw.fecha);
  if (raw.ubicacion !== undefined) campos.ubicacion = raw.ubicacion;
  if (raw.stock !== undefined) campos.stock = raw.stock;
  if (raw.precio !== undefined) campos.precio = raw.precio;
  if (raw.categoria !== undefined) campos.categoria = raw.categoria;
  if (raw.imagenes !== undefined) campos.imagenes = raw.imagenes ?? [];
  return campos;
}

export async function eliminarEvento(idEvento: number): Promise<{ ok: true } | { error: string }> {
  const pedidosActivos = await prisma.pedidos.count({
    where: { idEvento, estado: { not: "CANCELADO" } },
  });
  if (pedidosActivos > 0) {
    return { error: "No se puede eliminar un evento con pedidos pendientes o pagados" };
  }
  await prisma.eventos.delete({ where: { idEvento } });
  return { ok: true };
}

export async function modificarEvento(idEvento: number, campos: Prisma.eventosUpdateInput) {
  return prisma.eventos.update({ where: { idEvento }, data: campos });
}
