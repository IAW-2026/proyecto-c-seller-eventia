import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/seller/eventos - Público: Ver todos los eventos de todos los organizadores
export async function GET() {
  try {
    const eventos = await prisma.eventos.findMany();
    return NextResponse.json(eventos);
  } catch (error) {
    console.error("[seller/eventos] Prisma error:", error);
    return NextResponse.json({ error: "Error al obtener los eventos" }, { status: 500 });
  }
}

