import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { esAdmin } from "@/app/lib/rolesAdmin";

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

    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(idOrganizador);
      if (esAdmin(user.publicMetadata as Record<string, unknown>)) {
        return NextResponse.json({ error: "No se puede desactivar un administrador" }, { status: 403 });
      }
    } catch {
      // Si el usuario no existe en Clerk, no es admin — se permite continuar
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

// PUT /api/seller/datos/organizadores/[idOrganizador] — Activar un organizador
export async function PUT(
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

    await prisma.organizadores.update({
      where: { idOrganizador },
      data: { activo: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al activar el organizador" }, { status: 500 });
  }
}
