import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// GET /api/seller/eventos/[idEvento]/organizador
// Devuelve el idOrganizador del evento con el id dado
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  try {
    const { idEvento } = await params;

    const evento = await prisma.eventos.findUnique({
      where: { idEvento: Number(idEvento) },
    });

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ idOrganizador: evento.idOrganizador }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}