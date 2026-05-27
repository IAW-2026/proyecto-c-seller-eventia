import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

function parseId(idEventoParam: string) {
  const id = Number(idEventoParam);
  return Number.isInteger(id) ? id : null;
}

// GET /api/seller/eventos/[idEvento] — Público: ver detalle de un evento
export async function GET(
  request: Request,
  { params }: { params: Promise<{ idEvento: string }> }
) {
  const { idEvento } = await params;
  const id = parseId(idEvento);

  if (id === null) {
    return NextResponse.json({ error: "ID de evento no válido" }, { status: 400 });
  }

  const evento = await prisma.eventos.findUnique({
    where: { idEvento: id },
  });

  if (!evento) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  return NextResponse.json(evento);
}
