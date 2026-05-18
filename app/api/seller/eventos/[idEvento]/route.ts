import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/app/lib/admin";

function parseId(idEventoParam: string) {
  const idEvento = Number(idEventoParam);
  return Number.isInteger(idEvento) ? idEvento : null;
}

// GET /api/seller/eventos/[idEvento] - Público: Ver detalle de un evento
export async function GET(
  request: Request,
  { params }: { params: { idEvento: string } }
) {
  const id = parseId(params.idEvento);
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

async function canManageEvento(idEvento: number) {
  const { userId } = await auth();
  if (!userId) return false;

  const admin = await isAdmin();
  if (admin) return true;

  const evento = await prisma.eventos.findUnique({
    where: { idEvento },
    select: { idOrganizador: true },
  });

  return evento?.idOrganizador === userId;
}