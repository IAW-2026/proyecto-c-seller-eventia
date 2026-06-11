import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// GET /api/seller/eventos/[idEvento]/organizador
// Devuelve el organizador del evento con el id dado
export async function GET(
  _request: Request,
  { params }: { params: { idEvento: string } }
) {
  try {
    const idEvento = Number(params.idEvento);

    const evento = await prisma.eventos.findUnique({
      where: { idEvento },
    });

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ idOrganizador: evento.idOrganizador }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}