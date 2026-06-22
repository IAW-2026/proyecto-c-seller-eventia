import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// PATCH /api/seller/datos/organizadores/[idOrganizador] — Desactivar un organizador
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ idOrganizador: string }> }
) {
  const { idOrganizador } = await params;

  try {
    const organizador = await prisma.organizadores.findUnique({
      where: { idOrganizador },
    });

    if (!organizador) {
      return NextResponse.json({ error: "Organizador no encontrado" }, { status: 404 });
    }

    const pedidosPagados = await prisma.pedidos.count({
      where: { idOrganizador, estado: "PAGADO" },
    });

    if (pedidosPagados > 0) {
      return NextResponse.json(
        { ok: false, error: "No se puede desactivar el organizador porque tiene pedidos pagados asociados." },
        { status: 409 }
      );
    }

    await prisma.organizadores.update({
      where: { idOrganizador },
      data: { activo: false },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al desactivar el organizador" }, { status: 500 });
  }
}
