import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { eliminarEvento, modificarEvento, buildCamposEvento } from "@/app/lib/eventosHelpers";

// PUT /api/seller/datos/eventos/[idEvento] — Modificar un evento
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  const { idEvento } = await params;
  const id = Number(idEvento);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const existing = await prisma.eventos.findUnique({ where: { idEvento: id } });
    if (!existing) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

    const body = await request.json();
    const campos = buildCamposEvento(body);
    const evento = await modificarEvento(id, campos);
    return NextResponse.json(evento);
  } catch (error) {
    console.error("Error al modificar evento:", error);
    return NextResponse.json({ error: "Error al modificar el evento" }, { status: 500 });
  }
}

// DELETE /api/seller/datos/eventos/[idEvento] — Eliminar un evento
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  const { idEvento } = await params;
  const id = Number(idEvento);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const existing = await prisma.eventos.findUnique({ where: { idEvento: id } });
    if (!existing) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

    const result = await eliminarEvento(id);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return NextResponse.json({ error: "Error al eliminar el evento" }, { status: 500 });
  }
}
