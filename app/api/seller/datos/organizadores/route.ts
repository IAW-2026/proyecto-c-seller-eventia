import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/seller/organizadores - Público: Ver todos los organizadores
export async function GET() {
  try {
    const organizadores = await prisma.organizadores.findMany();
    return NextResponse.json(organizadores);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los organizadores" }, { status: 500 });
  }
}