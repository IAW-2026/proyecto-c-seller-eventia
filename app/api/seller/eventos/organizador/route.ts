import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idEvento = Number(body?.idEvento ?? body?.id ?? null);

    if (!Number.isInteger(idEvento)) {
      return NextResponse.json({ error: "idEvento inválido" }, { status: 400 });
    }

    const evento = await prisma.eventos.findUnique({
      where: { idEvento },
      include: { organizador: true },
    });

    if (!evento) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }
    
    if (!evento.organizador) {
        return NextResponse.json({ error: "Organizador no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ idOrganizador: evento.organizador.idOrganizador }, { status: 200 });
  } catch (error) {
    console.error("[seller/eventos/organizador] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}